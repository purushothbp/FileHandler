export const registerformvalidateion = (values) => {

    const errors = {};

   if (!values.firstname) {
      errors.firstname = "firstname name is required"
    }
    if (!values.lastname) {
        errors.lastname = "lastname name is required"
      }
    
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
        errors.loginusername = "userName or email is required"
    }

    if(!values.loginpassword){
        errors.loginpassword = "password is required"
    }

    return errors
  }

  