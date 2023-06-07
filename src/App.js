import './App.css';
import Admin from './components/admin/admin';
import AdminHome from './components/adminHome/adminHome';
import UserHome from './components/userHome/userHome';
import Login from './components/login/login';
import Signup from './components/signup/signup';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="login" />} />
          <Route path="login" element={<Login />}/>
          <Route path="signup" element={<Signup />} />
          <Route path="admin" element={<Admin />} />
          <Route path="userhome" element={<UserHome />} />
          <Route path="adminhome" element={<AdminHome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
