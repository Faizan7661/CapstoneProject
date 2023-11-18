import React, { useState, useRef } from 'react';
import axios from 'axios';
import Toast from './Toast';
function VerifyOtp() {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [toast, setToast] = useState(null);

  const handleOtpChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      if (value !== '' && index < otpValues.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && index > 0) {
      if (otpValues[index] === '') {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleKeyUp = (index, event) => {
    if (event.key === 'Backspace' && index === otpValues.length - 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = '';
      setOtpValues(newOtpValues);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userEnteredOtp = otpValues.join('');
      const response = await axios.post('/api/user/verifyOtp', { userEnteredOtp });

      if (response.status === 200) {
        setToast({
          message: "OTP Verified!",
          onClose: () => {
            setToast(null);
          },
        });
      } else {
        setToast({ message: "Something went wrong!" });
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 400) {
        setToast({ message: "Invalid Registration" });
      } else {
        setToast({ message: "Something went wrong!" });
      }
    }
  };

  return (
    <>
   
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
        <center> {toast && <Toast message={toast.message} onClose={toast.onClose} />}</center>
        <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>OTP Verification</p>
              </div>
            </div>

            <div>
              <form action="" method="post" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-16">
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-sm space-x-2">
                    {otpValues.map((value, index) => (
                      <div key={index} className="w-16 h-16">
                        <input
                          ref={(element) => inputRefs.current[index] = element}
                          className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                          type="text"
                          name={`otp${index + 1}`}
                          id={`otp${index + 1}`}
                          value={value}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onKeyUp={(e) => handleKeyUp(index, e)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-5">
                    <div>
                      <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                        Verify Account
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                      <p>Didn't receive code?</p>{' '}
                      <a className="flex flex-row items-center text-blue-600" href="http://" target="_blank" rel="noopener noreferrer">
                        Resend
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyOtp;
