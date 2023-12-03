import './Home.css';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faEdit, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import Edit from '../editComponent/Edit';

const Home = () => {

    const [datlist, setDataList] = useState([0]);
    const fileInputRef = React.createRef();
    const apiUrl = "http://localhost:3001";
    const Navigate = useNavigate()


    const fetchData = async () => {
        const userId = localStorage.getItem('userlogin');
        try {
            // const response = await axios.get(`${apiUrl}/getUsers`);
            // console.log(response.data)
            console.log(userId,"user id")
            console.log(`${apiUrl}/files/${userId}`,"usergetlink")
            const responseFiles = await axios.get(`${apiUrl}/files/${userId}`)
            console.log(responseFiles,"particular files")
            setDataList(responseFiles.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const userId = localStorage.getItem('userlogin');
        const selectedFile = e.target.files;
        console.log(selectedFile[0], "==>2selectedfile")
        const formData = new FormData()
        formData.append('file', selectedFile[0]);
        formData.append('user', userId)
        console.log(formData)
        try {
            await axios.post(`${apiUrl}/upload`, formData);
            console.log('file uploaded successfully');
            fetchData();
        } catch (error) {
            console.log('Error uploading file', error);
        }

    };
    useEffect(() => {
        fetchData()
    }, [])

    const editFile = () => {
        Navigate('/Edit');

    }

    const deleteFile = async (id) => {
        try {
            await axios.delete(`${apiUrl}/deleteUser/${id}`);
            console.log('File deleted successfully');
            fetchData(); // Refresh the data after deletion
        } catch (error) {
            console.log('Error deleting file', error);
        }
    };

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
                    {datlist.map((val, index) => (
                        <tr key={val._id}>
                            {console.log(val,"val data")}
                            <td>{index + 1}</td>
                            <td>{val.filename}</td>
                            <td> <button className="btn btn-outline-success" onClick={() => editFile()}><FontAwesomeIcon icon={faEdit} /> Edit</button></td>
                            <td><button button className="btn btn-outline-success mx-3"><FontAwesomeIcon icon={faDownload} />Download</button></td>
                            <td><button button className="btn btn-outline-danger" onClick={() => deleteFile(val._id)}><FontAwesomeIcon icon={faTrash} />Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default Home        