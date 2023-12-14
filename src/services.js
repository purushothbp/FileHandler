import axios from "axios";

const apiUrl = process.env.REACT_APP_BASE_API_URL;


export const fetchFiles = async () => {
    const userId = localStorage.getItem('userlogin');
    try {
        const responseFiles = await axios.get(`${apiUrl}/files/${userId}`);
        return responseFiles.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const uploadFile = async (file) => {
    const userId = localStorage.getItem('userlogin');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', userId);

    try {
        await axios.post(`${apiUrl}/upload`, formData);
        console.log('File uploaded successfully');
    } catch (error) {
        console.log('Error uploading file', error);
        throw error;
    }
};

export const updateFile = async (fileId, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        await axios.put(`${apiUrl}/updateUser/${fileId}`, formData);
        console.log('File updated successfully');
    } catch (error) {
        console.log('Error updating file', error);
        throw error;
    }
};

export const deleteFile = async (fileId) => {
    try {
        await axios.delete(`${apiUrl}/deleteUser/${fileId}`);
        console.log('File deleted successfully');
    } catch (error) {
        console.log('Error deleting file', error);
        throw error;
    }
};

export const downloadFile = (fileId) => {
    return `${apiUrl}/download/${fileId}`;
};


export const fetchUserData = async () => {
    try {
        const response = await axios.get(`${apiUrl}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};