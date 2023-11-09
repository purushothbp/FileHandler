import './Home.css';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faEdit, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const [datlist, setDataList] = useState([0]);

    const fileInputRef = React.createRef();
    const apiUrl = "http://localhost:3001";
    const nave = useNavigate()

    const fetchData = async () => {
        try {
          const response = await axios.get(`${apiUrl}/getUsers`);
          console.log(response.data)
          setDataList(response.data);
        } catch (error) {
          console.log(error);
        }
      };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const selectedFiles = e.target.files;
        console.log(selectedFiles[0]);
        console.log(typeof (selectedFiles))
        const selectedFile = e.target.files[0];
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            await axios.post(`${apiUrl}/upload`, formData);
            console.log('File uploaded successfully');
            fetchData();
          } catch (error) {
            console.log('Error uploading file', error);
          }

    };


    useEffect(() => {
        fetchData()
    }, [])




    const EditFile = () => {
        nave("/Edit")
    }






    return (
        <div >
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".doc, .docx, .pdf, .xlsx, .jpg, .jpeg, .png" onChange={handleFileChange} />
            <button type="button" onClick={handleButtonClick} class="btn btn-primary mx-5 mt-1"><FontAwesomeIcon icon={faUpload} />Upload</button>

{/* <p>{console.log(JSON.parse(datlist[0].file).originalname,"==>datalist")}</p> */}
            <table className='direct'>
                <thead>
                    <tr>
                        <th className='center'>S.No</th>
                        <th className='center'>List</th>
                        <th colSpan={3} className='center'>Action</th>


                    </tr>
                </thead>
                <tbody>
                    {datlist.map((val, index)=>(
                        <tr key={val._id}>
                        <td>{index + 1}</td>
                        <td>{val.file && JSON.parse(val.file)?.originalname}</td>
                        <td> <button className="btn btn-outline-success"> <FontAwesomeIcon icon={faEdit} onClick={() => EditFile()} />Edit</button></td>
                        <td><button button className="btn btn-outline-success mx-3"><FontAwesomeIcon icon={faDownload} />Download</button></td>
                        <td><button button className="btn btn-outline-danger"><FontAwesomeIcon icon={faTrash} />Delet</button></td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Home        