import './signin.css';
import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { fetchUserData } from '../../services';

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

<CInputGroupText>
  <FontAwesomeIcon icon={faUser} />
  <FontAwesomeIcon icon={faLock} />
</CInputGroupText>


const Signin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const nave = useNavigate();
  const apiUrl = "http://localhost:3001";


  const [logindata, setLoginData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData();
        setLoginData(userData);
      } catch (error) {
        console.error('Error setting user data:', error);
      }
    };

    fetchData();
  }, []);


  const handleLoginSuccess = (credentialResponse) => {
    var decode = jwtDecode(credentialResponse.credential);
    console.log(decode, "decode values")
    console.log('Hello', decode.name, 'welcome');
    const googleLogindetails = { firstname: decode.given_name, lastname: decode.family_name, email: decode.email}

    axios.post(`${apiUrl}/Register`, googleLogindetails)
      .then((res) => {
        console.log("success", res);
        nave("../");
      })
      .catch((error) => {
        console.log("error", error);

      });

    localStorage.setItem('userlogin', decode.email);
    console.log('Login success');
    
    // Extracting first name and last name
    const firstName = decode.given_name;
    const lastName = decode.family_name;

    // Update loginCredential values with first name and last name
    loginCredential.setValues({
        ...loginCredential.values,
        firstname: firstName,
        lastname: lastName
    });

    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            loginusername: decode.email,
            isGoogleLogin: true,
            firstname: firstName,
            lastname: lastName
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server Response:', data);
    })
    .catch(error => {
        console.error('Error logging in:', error);
    });

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
        firstname:'',
        lastName:''

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
            // You can handle the error message display or other actions here
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