export const registerformvalidateion = (values) => {

    const errors = {};
  
    if (!values.username) {
      errors.username = "user name is required"
    }
  
    if (!values.email) {
      errors.email = "password is required"
    }
    if (!values.password) {
      errors.password = "password is required"
    }
    if (!values.reenterpassword) {
      errors.reenterpassword = "pls Re enter the password is required"
    }
    return errors
  }


  export const singinValidation = (values) => {
    const errors = {};

    if(!values.loginusername){
        errors.loginusername = "required"
    }

    if(!values.loginpassword){
        errors.loginpassword = "required"
    }

    return errors
  }

  