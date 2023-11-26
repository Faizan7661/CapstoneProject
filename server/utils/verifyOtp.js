import patientModel from '../models/patientModel.js';

async function verifyOtp(mobileNumber, userEnteredOtp) {
    try {
        const user = await patientModel.findOne({ mobileNumber });

        if (!user) {
            return false;
        }

        if (user.otp !== userEnteredOtp) {
            return false;
        }

        return user.otp === userEnteredOtp;

    } catch (error) {
        console.error(`Error verifying OTP for ${mobileNumber}: ${error.message}`);
    
        return false;
    }
}

export default verifyOtp;
