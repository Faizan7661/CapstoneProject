import express from 'express';
import jwt from "jsonwebtoken";
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

function generateRandomString(length) {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
  } 

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
                area,
                city
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

            req.session.mobile = mobileNumber;

            const verificationToken = generateRandomString(32);

            let customerProfiles = {
                name,
                mobileNumber,
                email,
                gender,
                area,
                city,
                otp,
                isMobileVerified: false,
                verificationToken

            }

            let patientDataPayload = new patientModel(customerProfiles);
            await patientDataPayload.save();


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
        req.session.mobileNumbers = mobileNumber;
        const otp = generateOTP();
        const smsSent = await sendSms(
            mobileNumber,
            `Your OTP is: ${otp}. Please use this OTP to log in.`
        );

        if (!smsSent) {
            return res.status(500).json({
                message: 'Failed to send OTP',
                status: false,
            });
        }

        await patientModel.updateOne({ mobileNumber }, { otp });

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


router.post('/verifyOtpSignUp', async (req, res) => {
    try {
        const { userEnteredOtp } = req.body;

        const mobileNumber = req.session.mobile;

        if (!mobileNumber) {
            return res.status(400).json({
                message: 'Mobile number not found. Please try again.',
                status: false,
            });
        }

        const existingUser = await patientModel.findOne({ mobileNumber });

        if (!existingUser) {
            return res.status(400).json({
                message: 'User details not found. Please Register.',
                status: false,
            });
        }

        const isOtpValid = await verifyOtp(mobileNumber, userEnteredOtp);

        if (!isOtpValid) {
            return res.status(400).json({
                message: 'Invalid OTP. Please try again.',
                status: false,
            });
        }

        await patientModel.updateOne({ mobileNumber }, { isMobileVerified: true });

        res.status(200).json({
            message: 'Registration Successful!',
            status: true,
            userData: existingUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error. Please Try Again!',
            status: false,
        });
    }
});



// For sign-in verification
router.post(
    '/verifyOtpSignIn',
    async (req, res) => {
        try {
            const { userEnteredOtp } = req.body;

            const mobileNumber = req.session.mobileNumbers;

            if (!mobileNumber) {
                return res.status(400).json({
                    message: 'Mobile number not found. Please try again.',
                    status: false,
                });
            }
    

            const isOtpValid = await verifyOtp(mobileNumber, userEnteredOtp, false);

            if (!isOtpValid) {
                return res.status(400).json({
                    message: 'Invalid OTP. Please try again.',
                    status: false,
                });
            }

            const existingUser = await patientModel.findOne({ mobileNumber });

            if (existingUser) {

                const { _id } = existingUser;
                const payload = { mobileNumber, role: 'user', _id };
                const privateKey = 'codeforindia';
                const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });
                res.status(200).json({
                    message: 'Login Successful!',
                    status: true,
                    userData: existingUser,
                    token: token,
                });
            } else {
                
                res.status(404).json({
                    message: 'User not found. Please sign up.',
                    status: false,
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


// router.post(
//     '/verifyOtp',
//     async (req, res) => {
//         try {
//             const {
//                 userEnteredOtp,
//             } = req.body;
  
//             const tempUserData = req.session.tempUserData;
  
//             if (!tempUserData) {
//                 return res.status(400).json({
//                     message: 'User details not found. Please sign in again.',
//                     status: false,
//                 });
//             }
  
//             const { mobileNumber } = tempUserData;
  
//             const isOtpValid = await verifyOtp(mobileNumber, userEnteredOtp, tempUserData);
  
//             if (!isOtpValid) {
//                 return res.status(400).json({
//                     message: 'Invalid OTP. Please try again.',
//                     status: false,
//                 });
//             }
  
//             const existingUser = await patientModel.findOne({ mobileNumber });
  
//             if (existingUser) {
//                 // User exists, proceed with login
//                 res.status(200).json({
//                     message: 'Login Successful!',
//                     status: true,
//                     userData: existingUser, 
//                 });
//             } else {
//                 // User doesn't exist, proceed with registration
//                 let userDataPayload = new patientModel(tempUserData);
//                 await userDataPayload.save();
  
//                 res.status(200).json({
//                     message: 'Registration Successful!',
//                     status: true,
//                     userData: userDataPayload,
//                 });
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({
//                 message: 'Internal Server Error. Please Try Again!',
//                 status: false,
//             });
//         }
//     }
//   );
  





// router.post('/signIn', async (req, res) => {
//   try {
//       const { mobileNumber } = req.body;
//       const existingUser = await patientModel.findOne({ mobileNumber });

//       if (!existingUser) {
//           return res.status(404).json({
//               message: 'User not found. Please sign up.',
//               status: false,
//           });
//       }

//       const otp = generateOTP();
//       const smsSent = await sendSms(mobileNumber, `Your OTP is: ${otp}. Please use this OTP to log in.`);

//       if (!smsSent) {
//           return res.status(500).json({
//               message: 'Failed to send OTP',
//               status: false,
//           });
//       }

//       req.session.tempUserData = {
//           mobileNumber,
//           otp,
//       };

//       res.status(200).json({
//           message: 'OTP sent successfully. Please check your mobile for verification.',
//           status: true,
//       });

//   } catch (error) {
//       console.error(error);
//       res.status(500).json({
//           message: 'Internal Server Error. Please Try Again!',
//           status: false,
//       });
//   }
// });
