// import React from 'react';
// import {  useState } from 'react';
// import axios from 'axios';

// function HomePage() {

//   const [file, setFile] = useState();
//   const handleUpload = (e)=>{
//     const formData = new FormData()
//     formData.append('file', file)
//     console.log(formData);
//     axios.post('http://localhost:3001/upload', formData)
//     .then(res => {console.log(res.data)})
//     .catch(err => console.log(err))
//   }
//   return (
//     <div>
//       <h2>Welcome to the HomePage</h2>
//       <h2>handleUpload</h2>
      
//       <div>
//               <input type="file" onChange={e=>{setFile(e.target.files[0])}}/>
//               <button onClick={handleUpload}>UPLOAD</button>
//             </div>
//     </div>
//   );
// }

// export default HomePage;
