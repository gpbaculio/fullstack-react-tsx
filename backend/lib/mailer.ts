import * as nodemailer from 'nodemailer';

const from = '"GPB Todos" <info@gpbtodos.com>';

function setup() {
  return nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '3b7becf386cdef',
      pass: 'c69f4cb28f6e94'
    }
  });
}

export function sendConfirmationEmail(user) {
  const transport = setup();
  const email = {
    from,
    to: user.email,
    subject: 'Welcome to GPB Todos',
    text: `
    Welcome to GPB Todos. Confirm by going to this link ${user.generateConfirmationUrl()}
    `
  };
  transport.sendMail(email);
}
