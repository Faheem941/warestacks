import bcryptImport from 'bcrypt';
import { promisifyAll } from 'bluebird';

import { isEmail } from 'validator';
import { GraphQLContext, createResolver, selfTypeComposer } from '../graphql';
import { IMongooseSelf, MongooseDocument } from '../model';
import { Authentication, BannedUser, Self, optimized } from '../mongoose';

const bcrypt = promisifyAll(bcryptImport);

selfTypeComposer.addResolver({
  name: 'registerUser',
  args: {
    email: 'String!',
    password: 'String!',
  },
  type: selfTypeComposer.getTypeNonNull(),
  resolve: createResolver(
    'register',
    async ({ context, args }, resolve, reject) => {
      const { email, password } = args;

      // Validate email
      const sanitizedEmail = email.trim().toLowerCase();

      if (!sanitizedEmail) {
        reject('Please enter your email address 📧');
        return;
      }

      if (!isEmail(sanitizedEmail)) {
        reject("Oops, that doesn't seem like a valid email address.");
        return;
      }

      if (await BannedUser.exists({ email }).exec()) {
        reject('Oops, something unexpected happened. Please try again later.');
        return;
      }

      if (validatePassword(password, reject) !== true) {
        return;
      }

      // Check for email in use
      if (await Authentication.exists({ email: sanitizedEmail }).exec()) {
        reject('Email is already in use');
        return;
      }

      // Create password hash
      const salt = await bcrypt.genSaltAsync(10, 'b');
      const hash = await bcrypt.hashAsync(password, salt);

      const authenticationObject = new Authentication({ email: sanitizedEmail, password: hash });

      const newUser = await createSelfObject({ ...args });

      await Promise.all([authenticationObject.save(), newUser.save()]);

      await finishLogin(newUser, context);

      resolve(newUser);

      // if (authenticationObject) {
      //   sendEmailVerification(authenticationObject);
      // }
    },
    { isAuthenticated: false },
  ),
});

selfTypeComposer.addResolver({
  name: 'login',
  args: {
    email: 'String!',
    password: 'String!',
  },
  type: selfTypeComposer.getTypeNonNull(),
  resolve: createResolver(
    'log in',
    async ({ args, context, projection }, resolve, reject) => {
      const { email, password } = args;
      const failedLoginText = 'Given email or password is incorrect';

      const sanitizedEmail = email.trim().toLowerCase();
      const authenticationObject = await optimized(
        Authentication.findOne({ email: sanitizedEmail }),
        'password',
      );

      if (!authenticationObject) {
        reject(failedLoginText);
        return;
      }

      if ((await bcrypt.compareAsync(password, authenticationObject.password)) === true) {
        const user = await Self.findOneAndUpdate(
          { email: sanitizedEmail },
          { lastActive: new Date() },
          { new: true, projection },
        ).exec();

        if (!user) {
          reject("Couldn't log in because your account was not found");
          return;
        }

        await finishLogin(user, context);

        resolve(user);
        return;
      }

      reject(failedLoginText);
    },
    { isAuthenticated: false },
  ),
});

selfTypeComposer.addResolver({
  name: 'logout',
  args: {},
  type: 'Boolean!',
  async resolve({ context }: { context: GraphQLContext }) {
    await new Promise<void>((resolveDestroy) => {
      context.session.destroy(() => resolveDestroy());
    });

    return true;
  },
});

/* ------------------------------------------ Helpers ------------------------------------------- */

async function finishLogin(user: MongooseDocument<IMongooseSelf>, context: GraphQLContext) {
  context.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
  context.session.email = user.email;
  context.session.save();
}

async function createSelfObject(user: Partial<IMongooseSelf> & Pick<IMongooseSelf, 'email'>) {
  const { email } = user;

  // Create user

  const userData: Partial<IMongooseSelf> = {
    email,
    lastActive: new Date(),
    isOnboardingComplete: false,
  };

  const newUser = new Self(userData);
  return newUser;
}

function validatePassword(password: string, reject: (error?: any) => void) {
  if (!password) {
    reject('Please choose a password 🔐');
    return false;
  }

  if (password.length < 8) {
    reject('Make sure you use a password with at least 8 characters in it 🔐');
    return false;
  }

  return true;
}
