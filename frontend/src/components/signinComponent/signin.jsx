import './signin.css';
import React, { useState } from 'react';
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
import { useFormik } from 'formik';
import { singinValidation } from '../../validateion';
import axios from 'axios';




const Signin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const nave = useNavigate();
  const apiUrl = "http://localhost:3001";





  const handleLoginSuccess = (credentialResponse) => {
    var decode = jwtDecode(credentialResponse.credential);
    console.log(decode, "decode values")
    console.log('Hello', decode.name, 'welcome');
    const googleLogindetails = { firstname: decode.given_name, lastname: decode.family_name, email: decode.email, isGoogleLogin: true }

    axios.post(`${apiUrl}/login`, googleLogindetails)
      .then((res) => {
        console.log("success", res);
        nave("../");
      })
      .catch((error) => {
        console.log("error", error);

      });


    localStorage.setItem('userlogin', decode.email);
    console.log('Login success');


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
    nave('/Home');
  };

  const loginCredential = useFormik(
    {
      initialValues: {
        loginusername: '',
        loginpassword: '',
        firstname: '',
        lastName: ''

      },

      onSubmit: async (values) => {
        try {
          const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          const data = await response.json();

          if (response.ok) {
            // Login successful
            localStorage.setItem('userlogin', values.loginusername);
            console.log('Login success');
            nave('/Home');
          } else {
            // Login failed
            console.log('Login failed:', data.message);
          }
        } catch (error) {
          console.error('Error logging in:', error);
        }
      },
      validate: singinValidation
    })

  return (
    <div className="bg-light1 min-vh-100 d-flex flex-row align-items-center">
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
                      <CFormInput placeholder="UserName or Email" autoComplete="username"
                        name='loginusername' onChange={loginCredential.handleChange}
                        onBlur={loginCredential.handleBlur}
                        value={loginCredential.values.loginusername}
                        className={loginCredential.touched.loginusername && loginCredential.errors.loginusername ? 'is-invalid' : ''}
                      />
                      {loginCredential.touched.loginusername && loginCredential.errors.loginusername && (
                        <div className="invalid-feedback">{loginCredential.errors.loginusername}</div>
                      )}
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
                        onBlur={loginCredential.handleBlur}
                        value={loginCredential.values.loginpassword}
                        autoComplete="current-password"
                        className={loginCredential.touched.loginpassword && loginCredential.errors.loginpassword ? 'is-invalid' : ''}

                      />
                      {loginCredential.touched.loginpassword && loginCredential.errors.loginpassword && (
                        <div className="invalid-feedback">{loginCredential.errors.loginpassword}</div>
                      )}
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
                            <CButton color="primary" className="register">
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
                        <CButton color="link" className="registers">
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