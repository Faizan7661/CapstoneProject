import twilio from 'twilio';


const accountSid = 'ACb11a4a31b9efb9d78245f332d49cc8d6';
const authToken = '00a0c929d03b1bcc3af6e85f77f2e46f';
const client = new twilio(accountSid, authToken);

async function sendSms(to, body) {
    try {
        const message = await client.messages.create({
            body: body,
            from: '+16562188446',
            to: to,
        });

        console.log(`OTP sent. SID: ${message.sid}`);
        return true;
    } catch (error) {
        console.error(`Error sending SMS: ${error.message}`);
        return false;
    }
}

export default sendSms;
