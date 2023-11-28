    import React from "react";
    import { useState } from "react";
    import axios from "axios";
    import { useNavigate } from "react-router-dom";
    import Toast from "./Toast";

    function BookAppointMent() {
      const navigate = useNavigate();

      const [bookingData, setBookings] = useState({ 
        name : "",
        email : "",
        mobileNumber : "",
        dateOfBirth : "",
        gender : "",
        address : "",
        city : "",
        medicalConditions : "",
      });

      const [toast, setToast] = useState(null);

      const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(name, value);
        setBookings({ ...bookingData, [name]: value });
      };

      const showToast = (message, duration = 2000) => {
        setToast({ message });
        return new Promise((resolve) => {
          setTimeout(() => {
            setToast(null);
            resolve();
          }, 2000);
        });
      };

      const postData = async () => {
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
          } = bookingData;
      
          const value = localStorage.getItem('token');
          console.log(value);
          let authResponse = await axios.get('http://localhost:3000/api/auth/verify', {
            headers: {
                token: value,
            },
        });
      
          if (authResponse.status === 401) {
            navigate('/signIn');
          }
          
          const patientId = JSON.parse(localStorage.getItem('patientId'));
          if (!patientId) {
            showToast('Patient ID not available. Please log in.');
            return;
          }
          const response = await axios.post('/api/user/bookingAppointment', {
            patient_id: patientId,
            name,
            email,
            mobileNumber,
            dateOfBirth,
            gender,
            address,
            city,
            medicalConditions,
          });
      
          if (response.status === 200) {
            await showToast('Details Sent. Please Proceed to Payments');
            // navigate("/verifyOtpSignUp");
          } else {
            showToast('Something went wrong!');
          }
        } catch (error) {
          console.error(error);
      
          if (error.response && error.response.status === 400) {
            showToast('Details Not Sent');
          } else {
            showToast('Something went wrong!');
          }
        }
      };
      
      const handleSubmit = async (event) => {
        event.preventDefault();
        await postData();
      };

      return (
        <>
          <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
          {toast && <Toast message={toast.message} onClose={toast.onClose} />}
            <div className="container max-w-screen-lg mx-auto">
              <div>
                <h2 className="font-semibold text-xl text-gray-600">
                  Book An Appointment
                </h2>
                <br/>
                {/* <p className="text-gray-500 mb-6">add some text</p> */}
                <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                    <div className="text-gray-600">
                      <p className="font-medium text-lg">Booking Details</p>
                      <p>Please fill out all the fields.</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                        <div className="md:col-span-5">
                          <label htmlFor="full_name">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
                            value={bookingData.name}
                            onChange={handleInput}
                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                            placeholder="Enter Your Name Here"
                            defaultValue=""
                          />
                        </div>
                        <div className="md:col-span-5">
                          <label htmlFor="email">Email Address</label>
                          <input
                            type="text"
                            name="email"
                            id="email"
                            autoComplete="off"
                            value={bookingData.email}
                            onChange={handleInput}
                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                            defaultValue=""
                            placeholder="email@domain.com"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="zipcode">Mobile Number</label>
                          <input
                            type="text"
                            name="mobileNumber"
                            id="mobileNumber"
                            autoComplete="off"
                            value={bookingData.mobileNumber}
                            onChange={handleInput}
                            className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                            placeholder="Enter Mobile Number"
                            defaultValue=""
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="relative">
                            <span>Gender</span>
                            <select
                              required=""
                              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                              name="gender"
                              id="gender"
                              autoComplete="off"
                              value={bookingData.gender}
                              onChange={handleInput}
                            >
                              <option value="" disabled>
                                Select gender
                              </option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="not-specified">Rather not say</option>
                            </select>
                          </label>
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="dateOfBirth">Date Of Birth</label>
                          <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                            <input
                              type="date"
                              name="dateOfBirth"
                              id="dateOfBirth"
                              autoComplete="off"
                              value={bookingData.dateOfBirth}
                              onChange={handleInput}
                              className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-3">
                          <label htmlFor="address">Address / Street</label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            autoComplete="off"
                            value={bookingData.address}
                            onChange={handleInput}
                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                            defaultValue=""
                            placeholder=""
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="city">City</label>
                          <input
                            type="text"
                            name="city"
                            id="city"
                            autoComplete="off"
                            value={bookingData.city}
                            onChange={handleInput}
                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                            defaultValue=""
                            placeholder=""
                          />
                        </div>
                        <div className="md:col-span-5">
                          <label
                            htmlFor="medicalConditions"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Any Medical Conditions
                          </label>
                          <textarea
                            name="medicalConditions"
                            id="medicalConditions"
                            autoComplete="off"
                            value={bookingData.medicalConditions}
                            onChange={handleInput}
                            rows={4}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Describe your medical conditions..."
                            defaultValue={""}
                          />
                        </div>

                        <div className="md:col-span-5 text-right">
                          <div className="inline-flex items-end">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  onClick={handleSubmit}>
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    export default BookAppointMent;
