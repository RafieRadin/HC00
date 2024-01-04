import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Header from '../components/Header/Header';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Recovery from '../pages/Auth/Recovery';
import Password from '../pages/Auth/Password';
import PageNotFound from '../pages/Auth/PageNotFound';
import Reset from '../pages/Auth/Reset';
import Profile from '../pages/Auth/Profile';
import Dashboard from '../pages/Dashboard/Dashboard';
import Report from '../pages/Dashboard/Report';


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
        <Route path="/profile" element={<Profile/>} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/*" element={<PageNotFound/>} />
        
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Report />} />

        
      </Routes>
      </div>
    </div>

  );
}

export default Routing;
