// SignIn.js

import React, { useEffect } from 'react';
import axios from 'axios';

const SignIn = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://otpless.com/auth.js';
    script.setAttribute('cid', '009LGJ3DCXDBTS2L0072PCX4I33460Z0');

    document.head.appendChild(script);

    window.otpless = (otplessUser) => {
      console.log('OTPless User:', otplessUser);

  
      if (otplessUser.token) {
        const userProfile = {
          token: otplessUser.token,
          timestamp: otplessUser.timestamp,
          timezone: otplessUser.timezone,
          mobile: {
            name: otplessUser.mobile.name,
            number: otplessUser.mobile.number,
          },
          email: {
            name: otplessUser.email.name,
            email: otplessUser.email.email,
          },
        };

        registerUser(userProfile);
      } else {
        console.error('Sign-in failed:', otplessUser);
      }
    };
  }, []);

  const registerUser = async (userProfile) => {
    try {
      const response = await axios.post('/api/user/signIn', userProfile);

      console.log('User registered successfully:', response.data);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div id="otpless-login-page">
      
    </div>
  );
};

export default SignIn;
