import { useState } from "react"
import React from "react";
const Home = () => {
    const [files, setFiles] = useState([]);
    const fileInputRef = React.createRef();

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };
    const handleFileSelect = (event) => {
        const newFiles = [...event.target.files];
        setFiles(newFiles);
    };

    

    return (
        <div>
            <table >
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>uplode</th>
                        <th>list</th>
                        <th>edit</th>
                        <th>download</th>
                        <th>delete</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        files.map((values, index) => (
                            <tr key={values._id}>
                                <td>{index + 1}</td>
                                <td><button onClick={handleUploadClick}>uplode</button></td>
                                <input type="file" accept=".docx, .xlsx, .pdf, .doc, .jpeg, .jpg, .png" multiple style={{ display: 'none' }} onChange={handleFileSelect} ref={fileInputRef} />
                                <td>{values.list}</td>
                                <td><button>edit</button></td>
                                <td><button>download</button></td>
                                <td><button>delete</button></td>
                            </tr>

                        ))

                    }

                </tbody>
            </table>
        </div>
    )
}

export default Home