const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch');

exports.handler = function(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');
  response.setStatusCode(200);
  const responseBody = {
    emailSent: false
  };
  response.setBody(responseBody);

  const {
    FROM_EMAIL_ADDRESS,
    TO_EMAIL_ADDRESS,
    SENDGRID_API_KEY
  } = context;

  sgMail.setApiKey(SENDGRID_API_KEY);

  const fetchSomeData = () => {
    // This is a simple function to simulate an API call. Returning
    // the promise response.json() so the calling code can handle it accordingly
    return fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(res => res.json())
  };

  const msg = {
    to: TO_EMAIL_ADDRESS,
    from: FROM_EMAIL_ADDRESS,
    subject: 'Test email from Twilio Function',
    text: 'This email was sent from a Twilio Function'
  };

  sgMail.send(msg)
    .then(() => {
      console.log('Email sent');
      responseBody.emailSent = true;

      console.log('Fetching data from another API');
    })
    .catch(error => {
      console.error('Error sending email.', error)
      responseBody.error = error.message || error;
      response.setStatusCode(error.status || 500)
      response.setBody(responseBody);
      
    });

    fetchSomeData().then(res => {
      console.log('Data fetched.', res);
      responseBody.data = res;
      response.setBody(responseBody);
    })
    .catch(error => {
      console.error('Error fetching data.', error);
      responseBody.error = error.message || error;
      response.setStatusCode(error.status || 500);
    });

    console.log('Function complete');
    callback(null, response);
};
