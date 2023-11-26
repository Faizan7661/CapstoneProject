import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar';
import Registration from './Components/Registration';
import VerifySignUpOtp from './Components/VerifySignUp'
import VerifySignInOtp from './Components/VerifySignIn'
import SignIn from './Components/SignIn';

function App() {
  return (
    <div>

      <Navbar/>

      <Routes>
        <Route path='/signUp' element={<Registration/>} />
        <Route path='/verifyOtpSignUp' element={<VerifySignUpOtp/>}/>
        <Route path ='/signIn' element={<SignIn/>}/>
        <Route path='/verifyOtpSignIn' element={<VerifySignInOtp/>}/>

      </Routes>
      
    </div>
  );
}

export default App;
