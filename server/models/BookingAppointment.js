import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

  typeOfService: {
    type: String,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User_profiles', 
    required: true,
  },
  name :{
    type : String
  },
  email :{
    type : String
  },
  mobileNumber :{
    type : String
  },
  gender :{
    type : String
  },
  dob :{
    type : String
  },
  status: {
    type: String,
  },
  doctorsAssigned: {
    type: String,
  },

  address: {
    type: String,
  },
  city :{
    type : String
  },
  medicalConditions :{
    type : String
  },
  metaData : {
    type : String,
  },
  assignedTo : {
    type : Boolean,
  },
  paymentStatus:{
    type : String
  },
  paymentId: {
    type: String,
  },
  refferedBy :{
    type:String
  }
}, { timestamps: true });

const BookingAppointment = mongoose.model('Booking_Appointment', bookingSchema, 'booking_appointment');
export default BookingAppointment;
