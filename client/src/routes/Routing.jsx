import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Header from '../components/Header/Header';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Password from '../pages/Auth/Password';
import PageNotFound from '../pages/PageNotFound';
import Profile from '../pages/Auth/Profile';
import Dashboard from '../pages/Dashboard/Dashboard';
import Report from '../pages/Report/Report';
import Settings from '../pages/User/modelsettings';
import Temp from '../pages/Predictions/Temp';
import DO from '../pages/Predictions/DO';
import PH from '../pages/Predictions/pH';


function Routing() {
  return (
    <div>
      <Header/>
      <div>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password" element={<Password />} />
        <Route path="/*" element={<PageNotFound/>} />
        
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Report />} />

        {/* Predictions */}
        <Route path="/temp-sensor" element={<Temp />} />
        <Route path="/do-sensor" element={<DO />} />
        <Route path='/ph-sensor' element={<PH />} />

        {/* User */}
        <Route path="/profile" element={<Profile/>} />
        <Route path="/modelsettings" element={<Settings />} />

      </Routes>
      </div>
    </div>

  );
}

export default Routing;
