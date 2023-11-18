import express from 'express';
import sendSms from '../../utils/sendSMS.js';
import otpGenerator from 'generate-otp';  
import verifyOtp from '../../utils/verifyOtp.js'
import dbConnect from '../../dbconnect.js';
import {
    userRegisterValidations,
    errorMiddleware,
} from '../../middlewares/validations/index.js';

import patientModel from '../../models/patientModel.js';
const router = express.Router();

dbConnect();

function generateOTP() {
  return otpGenerator.generate(6, { upperCase: false, specialChars: false });
}


router.post(
    '/signUp',
    userRegisterValidations(),
    errorMiddleware,
    async (req, res) => {
        try {
            console.log(req.body);
            let {
                name,
                mobileNumber,
                email,
                gender,
                address,
            } = req.body;

            const existingUser = await patientModel.findOne({ mobileNumber });

            if (existingUser) {
              return res.status(409).json({
                  message: 'User already exists. Please log in.',
                  status: false,
              });
          }

            const otp = generateOTP();
            const smsSent = await sendSms(mobileNumber, `Your OTP is: ${otp}. Please use this OTP to complete your registration.`);

            if (!smsSent) {
                return res.status(500).json({
                    message: 'Failed to send OTP',
                    status: false,
                });
            }

            // Saveing Temperory data in session
            req.session.tempUserData = {
                name,
                mobileNumber,
                email,
                gender,
                address,
                otp,
            };

            res.status(200).json({
                message: 'OTP sent successfully. Please check your mobile for verification.',
                status: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error Please Try Again!',
                status: false,
            });
        }
    }
);


router.post('/signIn', async (req, res) => {
  try {
      const { mobileNumber } = req.body;
      const existingUser = await patientModel.findOne({ mobileNumber });

      if (!existingUser) {
          return res.status(404).json({
              message: 'User not found. Please sign up.',
              status: false,
          });
      }

      const otp = generateOTP();
      const smsSent = await sendSms(mobileNumber, `Your OTP is: ${otp}. Please use this OTP to log in.`);

      if (!smsSent) {
          return res.status(500).json({
              message: 'Failed to send OTP',
              status: false,
          });
      }

      req.session.tempUserData = {
          mobileNumber,
          otp,
      };

      res.status(200).json({
          message: 'OTP sent successfully. Please check your mobile for verification.',
          status: true,
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'Internal Server Error. Please Try Again!',
          status: false,
      });
  }
});


router.post(
    '/verifyOtp',
    async (req, res) => {
        try {
            const {
                userEnteredOtp,
            } = req.body;
  
            const tempUserData = req.session.tempUserData;
  
            if (!tempUserData) {
                return res.status(400).json({
                    message: 'User details not found. Please sign in again.',
                    status: false,
                });
            }
  
            const { mobileNumber } = tempUserData;
  
            const isOtpValid = await verifyOtp(mobileNumber, userEnteredOtp, tempUserData);
  
            if (!isOtpValid) {
                return res.status(400).json({
                    message: 'Invalid OTP. Please try again.',
                    status: false,
                });
            }
  
            const existingUser = await patientModel.findOne({ mobileNumber });
  
            if (existingUser) {
                // User exists, proceed with login
                res.status(200).json({
                    message: 'Login Successful!',
                    status: true,
                    userData: existingUser, 
                });
            } else {
                // User doesn't exist, proceed with registration
                let userDataPayload = new patientModel(tempUserData);
                await userDataPayload.save();
  
                res.status(200).json({
                    message: 'Registration Successful!',
                    status: true,
                    userData: userDataPayload,
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error. Please Try Again!',
                status: false,
            });
        }
    }
  );
  
export default router;

