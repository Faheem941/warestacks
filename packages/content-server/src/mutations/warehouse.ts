import { Resend } from 'resend';
import { createResolver, warehouseTypeComposer } from '../graphql';
import { Warehouse, optimized } from '../mongoose';
import { getSecret } from '../utilities/gapis';
import { BookingEmailTemplate, BookingTextTemplate } from '../email/bookingTemplate';
import { PricingEmailTemplate, PricingTextTemplate } from '../email/pricingTemplate';
import { emailRegex } from '../utilities/miscellaneous';

/* ----------------------------------------- Resolvers ------------------------------------------ */

warehouseTypeComposer.addResolver({
  name: 'sendBooking',
  args: {
    warehouseId: 'String!',
    email: 'String!',
    name: 'String!',
  },
  type: 'Boolean',
  resolve: createResolver(
    'Send an email of getting a warehouse booking',
    async ({ args }, resolve, reject) => {
      const { warehouseId, email, name }: { warehouseId: string; email: string; name: string } =
        args;

      const sanitizedEmail = email.trim().toLowerCase();
      if (!emailRegex.test(sanitizedEmail)) {
        reject('Invalid email format');
        return;
      }

      const apiKey = await getSecret('RESEND_API_KEY');

      const resend = new Resend(apiKey);

      const warehouse = await optimized(Warehouse.findOne({ _id: warehouseId }), [
        'title',
        'pricePerDay',
      ]);

      if (!warehouse) {
        reject('Unable to find warehouse');
        return;
      }

      await resend.emails.send({
        from: 'Faheem <sales@warestacks.com>',
        to: [sanitizedEmail],
        subject: 'Booking Recieved',
        text: BookingTextTemplate({
          warehouseName: warehouse.title,
          warehousePrice: warehouse.pricePerDay,
          name,
        }),
        html: BookingEmailTemplate({
          warehouseName: warehouse.title,
          warehousePrice: warehouse.pricePerDay,
          name,
        }),
        bcc: ['m941faheem@gmail.com'],
      });

      resolve(true);
    },
    { isAuthenticated: false },
  ),
});

warehouseTypeComposer.addResolver({
  name: 'sendPriceBooking',
  args: {
    plan: 'String!',
    email: 'String!',
    name: 'String!',
  },
  type: 'Boolean',
  resolve: createResolver(
    'Send an email of getting a pricing booking',
    async ({ args }, resolve, reject) => {
      const { plan, email, name }: { plan: string; email: string; name: string } = args;

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
        subject: 'Booking Recieved',
        text: PricingTextTemplate({
          plan,
          name,
        }),
        html: PricingEmailTemplate({
          plan,
          name,
        }),
        bcc: ['m941faheem@gmail.com'],
      });

      resolve(true);
    },
    { isAuthenticated: false },
  ),
});
