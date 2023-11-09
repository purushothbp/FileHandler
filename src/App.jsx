// import './App.css';
// import React from 'react';
// import {  useState } from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";
// import axios from 'axios';
// // import {useNavigate} from 'react-router-dom'



// function App() {
//   const [file, setFile] = useState();
//   // const navigate = useNavigate();
//   const handleUpload = (e)=>{
//     const formData = new FormData()
//     formData.append('file', file)
//     console.log(formData);
//     axios.post('http://localhost:3001/upload', formData)
//     .then(res => {console.log(res.data)})
//     .catch(err => console.log(err))
//   }

//   return (
//     <div className="App">
//       <div>
//               <input type="file" onChange={e=>{setFile(e.target.files[0])}}/>
//               <button onClick={handleUpload}>UPLOAD</button>
//             </div>
//       <GoogleOAuthProvider clientId="469861634324-n725stcq8201f98u5bk3oq1deqvlg854.apps.googleusercontent.com">
//         <GoogleLogin
//           onSuccess={credentialResponse => {
//             var decode = jwtDecode(credentialResponse.credential)
//             console.log("Hello",decode.name, "welcome");
//           }}
//           onError={() => {
//             console.log('Login Failed');
//           }}
//         />
//         </GoogleOAuthProvider>

//     </div>
//   );
// }

// export default App;

import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import signin from './signinComponent/signin';
import Home from './homeComponent/Home';
import Edit from './editComponent/Edit';

function App() {
  return (
    <div>
     <Router>
        <Routes>
          <Route path='/' Component={signin}/>
          <Route path='/Home' Component={Home}/>
          <Route path='/Edit' Component={Edit}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
