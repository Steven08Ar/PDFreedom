import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pdf';

export const mergePDFs = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const response = await axios.post(`${API_URL}/merge`, formData, {
        responseType: 'blob',
    });
    return response.data;
};

export const splitPDF = async (file, pageIndices) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageIndices', JSON.stringify(pageIndices));
    const response = await axios.post(`${API_URL}/split`, formData, {
        responseType: 'blob',
    });
    return response.data;
};

export const clonePDF = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/clone`, formData, {
        responseType: 'blob',
    });
    return response.data;
}
