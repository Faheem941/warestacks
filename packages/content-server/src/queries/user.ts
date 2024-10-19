import { createResolver, selfTypeComposer, userTypeComposer } from '../graphql';
import { BannedUser, Self, optimized } from '../mongoose';

/* ----------------------------------------- Resolvers ------------------------------------------ */

selfTypeComposer.addResolver({
  name: 'self',
  args: {},
  type: selfTypeComposer,
  resolve: createResolver(
    'get logged in user',
    async ({ context, projection }, resolve) => {
      const self = await optimized(Self.findOne({ email: context.session.email }), projection);

      resolve(self);
    },
    { isAuthenticated: true },
  ),
});

userTypeComposer.addResolver({
  name: 'isSelfBanned',
  args: {},
  type: 'Boolean',
  resolve: createResolver(
    'determine if user is banned',
    async ({ context }, resolve) => {
      const user = await optimized(Self.findOne({ email: context.session.email }), ['phone']);

      resolve(
        user &&
          !!(await BannedUser.exists({
            $or: [{ phone: user.phone }],
          }).exec()),
      );
    },
    { emptyResult: false },
  ),
});
