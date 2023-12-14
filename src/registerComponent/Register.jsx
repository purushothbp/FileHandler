import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Register.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { registerformvalidateion } from '../validateion';


<CInputGroupText>
  <FontAwesomeIcon icon={faUser} />
  <FontAwesomeIcon icon={faLock} />
  <FontAwesomeIcon icon={faEnvelope} />
</CInputGroupText>

const Register = () => {
  const apiUrl = "http://localhost:3001";
  const redirect = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstname:"",
      laastname:"",
      username: "",
      email: "",
      password: "",
      reenterpassword: "",
    },
    onSubmit: (values) => {
      console.log(values);

      axios.post(`${apiUrl}/register`, values)
        .then((res) => {
          console.log("success", res);
          redirect("../");
        })
        .catch((error) => {
          console.log("error", error);

        });


    },
    validate: registerformvalidateion
  });

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={formik.handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3 rounded">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                      <FontAwesomeIcon icon={faUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="firstname"
                      autoComplete="firstname"
                      name="firstname"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstname}
                      className={formik.touched.firstname && formik.errors.firstname ? 'is-invalid' : ''}
                    />
                    {formik.touched.firstname && formik.errors.firstname && (
                      <div className="invalid-feedback">{formik.errors.firstname}</div>
                    )}
                    <div className="px-2"></div>
                    <CInputGroupText className='lastname'>
                      <CIcon icon={cilUser} />
                      <FontAwesomeIcon icon={faUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="lastname"
                      autoComplete="lastname"
                      name="lastname"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastname}
                      className={formik.touched.lastname && formik.errors.lastname ? 'is-invalid' : ''}
                    />
                    {formik.touched.lastname && formik.errors.lastname && (
                      <div className="invalid-feedback">{formik.errors.lastname}</div>
                    )}
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                      <FontAwesomeIcon icon={faUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      name="username"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      className={formik.touched.username && formik.errors.username ? 'is-invalid' : ''}
                    />
                    {formik.touched.username && formik.errors.username && (
                      <div className="invalid-feedback">{formik.errors.username}</div>
                    )}
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      name="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      className={formik.touched.email && formik.errors.email ? 'is-invalid' : ''}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="invalid-feedback">{formik.errors.email}</div>
                    )}
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                      <FontAwesomeIcon icon={faLock} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className={formik.touched.password && formik.errors.password ? 'is-invalid' : ''}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback">{formik.errors.password}</div>
                    )}
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                      <FontAwesomeIcon icon={faLock} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      name="reenterpassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.reenterpassword}
                      className={formik.touched.reenterpassword && formik.errors.reenterpassword ? 'is-invalid' : ''}
                    />
                    {formik.touched.reenterpassword && formik.errors.reenterpassword && (
                      <div className="invalid-feedback">{formik.errors.reenterpassword}</div>
                    )}
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="success">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;