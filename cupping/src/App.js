import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar';
import Registration from './Components/Registration';
import VerifyOtp from './Components/VerifyOtp';

function App() {
  return (
    <div>

      <Navbar/>

      <Routes>
        <Route path='/' element={<Registration/>} />
        <Route path='/verifyOtp' element={<VerifyOtp/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
