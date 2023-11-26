import twilio from 'twilio';
import config from 'config'


const accountSid = config.get('SEND_SMS.TWILIO_SID');
const authToken = config.get('SEND_SMS.TWILIO_TOKEN');
const client = new twilio(accountSid, authToken);

async function sendSms(to, body) {
    try {
        const message = await client.messages.create({
            body: body,
            from: config.get('SEND_SMS.TWILIO_NUMBER'),
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
