import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

function SignIn() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    mobileNumber: "",
  });

  const [toast, setToast] = useState(null);

  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setLoginData({ ...loginData, [name]: value });
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
      const { mobileNumber } = loginData;

      const response = await axios.post("/api/user/signIn", { ...loginData });
      if (response.status === 200) {
        await showToast(
          "OTP sent successfully. Please check your mobile for verification"
        );
        navigate("/verifyOtpSignIn");
      } else {
        showToast("Something went wrong!");
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 400) {
        showToast("Invalid Registration");
      } else {
        showToast("Something went wrong!");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await postData();
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-semibold text-[royalblue] mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="mobileNumber"
              className="text-sm font-medium text-gray-600"
            >
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Enter Mobile Number With country code"
              className="w-full mt-1 p-3 rounded-md border border-gray-300"
              autoComplete="off"
              required
              value={loginData.mobileNumber}
              onChange={handleInput}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white text-base p-3 rounded-md hover:bg-blue-600"
          >
            Get OTP
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signUp" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
      {toast && <Toast message={toast.message} onClose={toast.onClose} />}
    </div>
  );
}

export default SignIn;

// import React from "react";
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Toast from "./Toast";

// function SignIn() {
//   const navigate = useNavigate();

//   const [loginData, setLoginData] = useState({
//     mobileNumber: "",
//   });

//   const [toast, setToast] = useState(null);

//   const handleInput = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     console.log(name, value);
//     setLoginData({ ...loginData, [name]: value });
//   };

//   const showToast = (message, duration = 2000) => {
//     setToast({ message });
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         setToast(null);
//         resolve();
//       }, 1000);
//     });
//   };

//   const postData = async () => {
//     try {
//       const { mobileNumber } = loginData;

//       const response = await axios.post("/api/user/signIn", { ...loginData });
//       if (response.status === 200) {
//         await showToast(
//           "OTP sent successfully. Please check your mobile for verification"
//         );
//         navigate("/verifyOtpSignUp");
//       } else {
//         showToast("Something went wrong!");
//       }
//     } catch (error) {
//       console.error(error);

//       if (error.response && error.response.status === 400) {
//         showToast("Invalid Registration");
//       } else {
//         showToast("Something went wrong!");
//       }
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     await postData();
//   };
//   return (
//     <>
//       <div className="bg-gray-100 flex items-center justify-center h-screen">
//         <div className="card">
//           {toast && <Toast message={toast.message} onClose={toast.onClose} />}
//           <form
//             method="POST"
//             className="flex flex-col gap-2.5 max-w-[350px] bg-white relative p-5 rounded-[20px]"
//             onSubmit={handleSubmit}
//           >
//             <p className="text-[royalblue] text-[28px] font-semibold mb-2">
//               Login
//             </p>

//             <label>
//               <span>Mobile Number</span>
//               <input
//                 required={true}
//                 placeholder="Enter Mobile Number With country code"
//                 type="tel"
//                 className="w-full border p-2 rounded-[10px] border-solid border-[rgba(105,105,105,0.397)]"
//                 name="mobileNumber"
//                 id="mobileNumber"
//                 autoComplete="off"
//                 value={loginData.mobileNumber}
//                 onChange={handleInput}
//               />
//             </label>

//             <button className="bg-[royalblue] text-white text-base p-2.5 rounded-[10px] border-[none] hover:bg-[rgb(56,90,194)]">
//               Get OTP
//             </button>
//             <p className="signin">
//               Don't have an account ? <a href="/signUp">Register</a>
//             </p>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default SignIn;
