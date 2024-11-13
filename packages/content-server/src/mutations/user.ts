import { Resend } from 'resend';
import { createResolver, userTypeComposer } from '../graphql';
import { getSecret } from '../utilities/gapis';
import { emailRegex } from '../utilities/miscellaneous';
import { ContactEmailTemplate, ContactTextTemplate } from '../email/contactTemplate';

userTypeComposer.addResolver({
  name: 'sendContactUs',
  args: {
    message: 'String!',
    email: 'String!',
    name: 'String!',
  },
  type: 'Boolean',
  resolve: createResolver(
    'Send an email of getting a contact us',
    async ({ args }, resolve, reject) => {
      const { message, email, name }: { message: string; email: string; name: string } = args;

      const sanitizedEmail = email.trim().toLowerCase();
      if (!emailRegex.test(sanitizedEmail)) {
        reject('Invalid email format');
        return;
      }

      const apiKey = await getSecret('RESEND_API_KEY');

      const resend = new Resend(apiKey);

      await resend.emails.send({
        from: 'Faheem <sales@warestacks.com>',
        to: [sanitizedEmail],
        subject: 'Message Recieved',
        text: ContactTextTemplate({
          message,
          name,
        }),
        html: ContactEmailTemplate({
          message,
          name,
        }),
        bcc: ['m941faheem@gmail.com'],
      });

      resolve(true);
    },
    { isAuthenticated: false },
  ),
});
