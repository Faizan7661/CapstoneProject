import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },

  area: {
    type: String,
  },
  city : {
    type : String,
  },
  isMobileVerified : {
    type : Boolean,
  },
  otp: {
    type: String,
  },
}, { timestamps: true });

const patientModel = mongoose.model('User_profiles', patientSchema, 'user_profiles');
export default patientModel;
