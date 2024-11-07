interface TemplateProps {
  warehouseName: string;
  warehousePrice: number;
  name: string;
}

export const BookingEmailTemplate = ({
  warehouseName,
  warehousePrice,
  name,
}: TemplateProps): string =>
  `
<!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #0B363C;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        h1 {
          color: #0B363C;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
        }
        .message-box {
          background-color: #E0FFC7;
          border-left: 4px solid #0B363C;
          padding: 12px;
          padding-left: 20px;
          margin: 10px 0;
          display: flex;
          flex-direction: column;
          
          p {
            padding: 0px;
            margin-top: 1px;
          }
        }
        .footer {
          text-align: center;
          font-size: 14px;
          color: #677294;
          margin-top: 20px;
        }
        .footer a {
          color: #0B363C;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Warehouse Booking Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>We are excited to let you know that your warehouse booking has been successfully confirmed. Here are the details:</p>

        <div class="message-box">
          <p>Warehouse Name: ${warehouseName}</p>
          <p>Price per day: $${warehousePrice}</p>
        </div>

        <p>Thank you for choosing our services! Our sales representative will be reaching out to you soon!</p>

        <p>Best Regards,<br>WareStacks Team</p>

        <div class="footer">
          <p>If you need assistance or have any questions, <a href="https://warestacks.com">reach out via warestacks.com</a>.</p>
          <p>&copy; 2024 warestacks.com. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>

  `;

export const BookingTextTemplate = ({
  warehouseName,
  warehousePrice,
  name,
}: TemplateProps): string =>
  `
    Warehouse Booking Confirmed!

    Hi ${name},

    We are excited to let you know that your warehouse booking has been successfully confirmed. Here are the details:

    Warehouse Name: ${warehouseName}
    Price per day: $${warehousePrice}
    Thank you for choosing our services! Our sales representative will be reaching out to you soon!

    Best Regards,
    WareStacks Team

    If you need assistance or have any questions, please reach out via warestacks.com.

    © 2024 warestacks.com. All rights reserved.

  `;
