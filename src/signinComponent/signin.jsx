import './signin.css';
import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


export const Signin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const nave =useNavigate()

  const handleLoginSuccess = (credentialResponse) => {
    var decode = jwtDecode(credentialResponse.credential);
    console.log('Hello', decode.name, 'welcome');
    setIsAuthenticated(true);
  };

  const handleLoginFailure = () => {
    console.log('Login Failed');
  };

  const nextPageContent = isAuthenticated ? (
    <div>
      <h1>Welcome to Home Page</h1>
    </div>
  ) : null;

  const handleNextButtonClick =()=>{
    nave("/home")

  }

  return (
    <div className="box">
      <GoogleOAuthProvider
        clientId="469861634324-n725stcq8201f98u5bk3oq1deqvlg854.apps.googleusercontent.com"
      >
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </GoogleOAuthProvider>

      {nextPageContent}

      {isAuthenticated ? (
        <button type="button" className="btn btn-outline-primary" onClick={()=>handleNextButtonClick()}>Next</button>
      ) : null}
    </div>
  );
};

export default Signin