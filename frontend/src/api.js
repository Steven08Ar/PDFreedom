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

export const splitPDF = async (file, indices) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageIndices', JSON.stringify(indices));
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
};

export const organizePDF = async (file, pagesConfig) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pagesConfig', JSON.stringify(pagesConfig));
    const response = await axios.post(`${API_URL}/organize`, formData, {
        responseType: 'blob',
    });
    return response.data;
};

export const addWatermark = async (file, text, options) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', text);
    formData.append('options', JSON.stringify(options));
    const response = await axios.post(`${API_URL}/watermark`, formData, {
        responseType: 'blob',
    });
    return response.data;
};

export const editPDF = async (file, operations) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('operations', operations);
    const response = await axios.post(`${API_URL}/edit`, formData, {
        responseType: 'blob',
    });
    return response.data;
};
