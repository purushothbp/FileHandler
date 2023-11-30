import './signin.css';
import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,

} from '@coreui/react';
import axios from 'axios';
import { useFormik } from 'formik';

<CInputGroupText>
  <FontAwesomeIcon icon={faUser} />
  <FontAwesomeIcon icon={faLock} />
</CInputGroupText>


const Signin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const nave = useNavigate();

  const [logindata, setLoginData] = useState({})


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

  const handleNextButtonClick = () => {
    nave('/home');
  };


  useEffect(() => {
    axios.get("http://localhost:3001/users").then((res) => {
      console.log(res)
      setLoginData(res.data)
    })
  }, [])

  const loginCredential = useFormik(
    {
      initialValues: {
        loginusername: '',
        loginpassword: ''

      },
      onSubmit: (values) => {
        console.log(values)
        const checkLoginCredential = logindata.find((res) => {
          console.log(res, "==>logindetails");
          return res.username === values.loginusername && res.password === values.loginpassword
        })

        if (checkLoginCredential) {
          console.log("success")
          nave("/Home")
        }



      }
    }
  )

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={loginCredential.handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <FontAwesomeIcon icon={faUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" name='loginusername' onChange={loginCredential.handleChange} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <FontAwesomeIcon icon={faLock} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        name='loginpassword'
                        onChange={loginCredential.handleChange}
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type='submit' className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol>
                        <div>
                          <Link to="/register">
                            <CButton color="primary" className="mt-3">
                              Register Now!
                            </CButton>
                          </Link>
                        </div>
                      </CCol>
                      <CCol xs={6} className="google">
                        <GoogleOAuthProvider clientId="469861634324-n725stcq8201f98u5bk3oq1deqvlg854.apps.googleusercontent.com">
                          <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginFailure}
                          />
                        </GoogleOAuthProvider>
                        {nextPageContent}
                        {isAuthenticated ? (
                          <button type="button" className="btn btn-outline-primary" onClick={() => handleNextButtonClick()}>Next</button>
                        ) : null}
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Signin;
