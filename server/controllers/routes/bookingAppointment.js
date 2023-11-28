import express from 'express';
import mongoose from 'mongoose';
import BookingAppointment from '../../models/BookingAppointment.js';
const router = express.Router();

router.post('/bookingAppointment', async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      dateOfBirth,
      gender,
      address,
      city,
      medicalConditions,
    } = req.body;

    const patientId = req.body.patient_id; 

    let bookings = {
      patient_id: patientId,
      typeOfService: 'Detox',
      name,
      email,
      mobileNumber,
      gender,
      dateOfBirth,
      status: 'In process',
      doctorsAssigned: null,
      address,
      city,
      medicalConditions,
      metaData: null,
      assignedTo: null,
      paymentId: null,
      paymentStatus: false,
      refferedBy: null,
    };

    let bookingPayload = new BookingAppointment(bookings);
    await bookingPayload.save();

    res.status(200).json({
      message: 'Details Sent. Proceed to payments.',
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

export default router;



// import express from 'express';
// import BookingAppointment from '../../models/BookingAppointment.js'
// const router = express.Router();

// router.post('/bookingAppointment', async (req, res) => {

//         try {
//             console.log(req.body);
//             let {
//                 name,
//                 email,
//                 mobileNumber,
//                 dateOfBirth,
//                 gender,
//                 address,
//                 city,
//                 medicalConditions
//             } = req.body;


//             let bookings = {
//                 typeOfService : "Detox",
//                 name,
//                 email,
//                 mobileNumber,
//                 gender,
//                 dateOfBirth,
//                 Status : "In process",
//                 doctorsAssigned: null,
//                 address,
//                 city,
//                 medicalConditions,
//                 metaData :null,
//                 assignedTo : null,
//                 paymentId : null,
//                 paymentStatus : false,
//                 refferedBy : null

//             }

//             let bookingPayload = new BookingAppointment(bookings);
//             await bookingPayload.save();


//             res.status(200).json({
//                 message: 'Details Sent. Proceed to payments.',
//                 status: true,
//             });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({
//                 message: 'Internal Server Error Please Try Again!',
//                 status: false,
//             });
//         }
//     }
// );


// export default router;