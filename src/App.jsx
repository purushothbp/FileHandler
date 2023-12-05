
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import signin from './signinComponent/signin';
import Home from './homeComponent/Home';
import Register from './registerComponent/Register';
import { useEffect, useState } from 'react';

function App() {
  const [isLoggedIn, setLogin] = useState(false);

  const checkLogin = () => {
    const data = localStorage.getItem('userlogin');
    console.log(data,"userdata")
    if (data !== null || data !== '') {
      setLogin(true);
    }
  }

  useEffect(() => {
    checkLogin();
  }, [])

  return (
    <div>

      <BrowserRouter>
      <Routes>
              <Route path='/' Component={signin} />
              <Route path='Register' Component={Register} />
              <Route path='/Home' Component={Home} />
            </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
