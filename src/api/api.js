import axios from 'axios';

const API_URL = 'http://localhost/aptime/api.php?endpoint='; // Replace with your API URL

export const fetchDataTime = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw new Error('Failed to fetch data.');
  }
};

export const createDataTime = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating data at ${endpoint}:`, error);
    throw new Error('Failed to create data.');
  }
};

export const updateDataTime = async (endpoint, id, data) => {
  try {
    data.id = id;
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data with ID ${id} at ${endpoint}:`, error);
    throw new Error('Failed to update data.');
  }
};

export const deleteDataTime = async (endpoint, id) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}&timeid=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data with ID ${id} at ${endpoint}:`, error);
    throw new Error('Failed to delete data.');
  }
};


export const fetchDataSection = async (endpoint) => {
    try {
        const response = await axios.get(`${API_URL}${endpoint}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        throw new Error('Failed to fetch data.');
    }
};

export const createDataSection = async (endpoint, data) => {
    try {
        const response = await axios.post(`${API_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error creating data at ${endpoint}:`, error);
        throw new Error('Failed to create data.');
    }
};

export const updateDataSection = async (endpoint, id, data) => {
    try {
        data.sid = id;
        const response = await axios.put(`${API_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating data with ID ${id} at ${endpoint}:`, error);
        throw new Error('Failed to update data.');
    }
};

export const deleteDataSection = async (endpoint, id) => {
    try {
        const response = await axios.delete(`${API_URL}${endpoint}&sid=${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting data with ID ${id} at ${endpoint}:`, error);
        throw new Error('Failed to delete data.');
    }
};


export const fetchDataCourse = async (endpoint) => {
    try {
        const response = await axios.get(`${API_URL}${endpoint}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const createDataCourse = async (endpoint, data) => {
    try {
        const response = await axios.post(`${API_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating data:', error);
        throw error;
    }
};

export const updateDataCourse = async (endpoint, cid, data) => {
    try {
        const response = await axios.put(`${API_URL}${endpoint}&cid=${cid}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

export const deleteDataCourse = async (endpoint, cid) => {
    try {
        const response = await axios.delete(`${API_URL}${endpoint}&cid=${cid}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};







export const fetchDataFaculty = async (endpoint) => {
    try {
        const response = await axios.get(`${API_URL}${endpoint}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const createDataFaculty = async (endpoint, data) => {
    try {
        const response = await axios.post(`${API_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating data:', error);
        throw error;
    }
};

export const updateDataFaculty = async (endpoint, fid, data) => {
    try {
        const response = await axios.put(`${API_URL}${endpoint}&fid=${fid}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

export const deleteDataFaculty = async (endpoint, fid) => {
    try {
        const response = await axios.delete(`${API_URL}${endpoint}&fid=${fid}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};








export const fetchDataProgram = async (endpoint) => {
    try {
        const response = await axios.get(`${API_URL}${endpoint}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const createDataProgram = async (endpoint, data) => {
    try {
        const response = await axios.post(`${API_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating data:', error);
        throw error;
    }
};

export const updateDataProgram = async (endpoint, pid, data) => {
    try {
        const response = await axios.put(`${API_URL}${endpoint}&pid=${pid}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

export const deleteDataProgram = async (endpoint, pid) => {
    try {
        const response = await axios.delete(`${API_URL}${endpoint}&pid=${pid}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};

