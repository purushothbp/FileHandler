import './Home.css';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faEdit, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { deleteFile,  fetchFiles, updateFile, uploadFile } from '../services';

const Home = () => {

    const [dataList, setDataList] = useState([]);
    const [editingFile, setEditingFile] = useState(null);
    const fileInputRef = React.createRef();

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            if (editingFile) {
                await updateFile(editingFile._id, selectedFile);
                setEditingFile(null);
            } else {
                await uploadFile(selectedFile);
            }
            console.log('File operation completed successfully');
            fetchData();
        } catch (error) {
            console.log('Error during file operation', error);
        }
    };

    const fetchData = async () => {
        try {
            const data = await fetchFiles();
            setDataList(data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const editFile = (file) => {
        setEditingFile(file);
        fileInputRef.current.click();
    };

    const deleteFileHandler = async (id) => {
        try {
            await deleteFile(id);
            console.log('File deleted successfully');
            fetchData();
        } catch (error) {
            console.log('Error deleting file', error);
        }
    };

    return (
        <div className='bg-colour' >
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
                    {dataList.map((val, index) => (
                        <tr key={val._id}>
                            {/* {console.log(val,"val data")} */}
                            <td>{index + 1}</td>
                            <td>{val.filename}</td>
                            <td> <button className="btn btn-outline-success" onClick={() => editFile(val)}><FontAwesomeIcon icon={faEdit} /> Edit</button></td>
                            <td> <a href={`http://localhost:3001/download/${val._id}`} className="btn btn-outline-success mx-3" target="_blank" rel="noopener noreferrer" ><FontAwesomeIcon icon={faDownload} /> Download</a> </td>
                            <td><button button className="btn btn-outline-danger" onClick={() => deleteFileHandler(val._id)}><FontAwesomeIcon icon={faTrash} />Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default Home        