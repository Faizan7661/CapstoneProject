import patientModel from '../models/patientModel.js';

async function verifyOtp(mobileNumber, userEnteredOtp, tempUserData) {
    try {
        if (tempUserData && tempUserData.mobileNumber === mobileNumber && tempUserData.otp === userEnteredOtp) {
            return true;
        }
        const user = await patientModel.findOne({ mobileNumber });

        if (!user) {
            return false;
        }

        return user.otp === userEnteredOtp;
    } catch (error) {
        console.error(`Error verifying OTP: ${error.message}`);
        return false;
    }
}

export default verifyOtp;
