import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

const App = () => {
  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App