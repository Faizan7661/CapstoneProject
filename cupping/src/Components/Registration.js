import React from "react";
import { useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import Toast from "./Toast";


function Registration() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    gender: "",
    address: "",
  });

  const [toast, setToast] = useState(null);

  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(name, value);
    setUserData({ ...userData, [name]: value });
  };

  const showToast = (message, duration = 2000) => {
    setToast({ message });
    return new Promise((resolve) => {
      setTimeout(() => {
        setToast(null);
        resolve();
      }, 1000);
    });
  };

  const postData = async () => {
    try {
      const { name, mobileNumber, email, gender, address } = userData;

      const response = await axios.post("/api/user/signUp", { ...userData });
       if (response.status === 200) {
        await showToast("OTP sent successfully. Please check your mobile for verification");
        navigate("/verifyOtp");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    await postData();
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center h-screen">
        <div className="card">
        {toast && <Toast message={toast.message} onClose={toast.onClose} />}
          <form
            method="POST"
            className="flex flex-col gap-2.5 max-w-[350px] bg-white relative p-5 rounded-[20px]"
            onSubmit={handleSubmit}
          >
            <p className="text-[royalblue] text-[28px] font-semibold mb-2">
              Register
            </p>
            <p className="text-[rgba(88,87,87,0.822)] text-sm">
              Signup now and get full access to our app.
            </p>

            <label>
              <span>Name</span>
              <input
                required={true}
                placeholder="Enter Your Name"
                type="text"
                className="w-full border p-2 rounded-[10px] border-solid border-[rgba(105,105,105,0.397)]"
                name="name"
                id="name"
                autoComplete="off"
                value={userData.name}
                onChange={handleInput}
              />
            </label>

            <label>
              <span>Mobile Number</span>
              <input
                required={true}
                placeholder="Enter Mobile Number With country code"
                type="tel"
                className="w-full border p-2 rounded-[10px] border-solid border-[rgba(105,105,105,0.397)]"
                name="mobileNumber"
                id="mobileNumber"
                autoComplete="off"
                value={userData.mobileNumber}
                onChange={handleInput}
              />
            </label>

            <label>
              <span>Email</span>
              <input
                required={true}
                placeholder="Enter your Email"
                type="email"
                className="w-full border p-2 rounded-[10px] border-solid border-[rgba(105,105,105,0.397)]"
                name="email"
                id="email"
                autoComplete="off"
                value={userData.email}
                onChange={handleInput}
              />
            </label>

            <label className="relative">
              <span>Gender</span>
              <select
                required=""
                className="w-full border p-2 rounded-[10px] border-solid border-[rgba(105,105,105,0.397)]"
                name="gender"
                id="gender"
                autoComplete="off"
                value={userData.gender}
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

            <label>
              <span>Address</span>
              <input
                required=""
                placeholder="Enter Your Address"
                type="text"
                className="w-full border p-2 rounded-[10px] border-solid border-[rgba(105,105,105,0.397)]"
                name="address"
                id="address"
                autoComplete="off"
                value={userData.address}
                onChange={handleInput}
              />
            </label>

            <button className="bg-[royalblue] text-white text-base p-2.5 rounded-[10px] border-[none] hover:bg-[rgb(56,90,194)]">
              Submit
            </button>
            <p className="signin">
              Already have an account ? <a href="#">Signin</a>{" "}
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Registration;
