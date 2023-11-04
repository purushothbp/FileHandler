import './App.css';
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import {useNavigate} from 'react-router-dom'



function Login() {
  const navigate = useNavigate();
 
  const handleGoogleLogin = (credentialResponse) => {
    const decode = jwtDecode(credentialResponse.credential);
    console.log("Hello", decode.name, "welcome");
    
    navigate('/HomePage');
  }

  return (
    <div className="App">
      
      <GoogleOAuthProvider clientId="469861634324-n725stcq8201f98u5bk3oq1deqvlg854.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        </GoogleOAuthProvider>

    </div>
  );
}

export default Login;

