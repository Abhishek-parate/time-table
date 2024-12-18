import axios from "axios";

const API_URL = "http://localhost/aptime/api.php?endpoint="; // Replace with your API URL

export const fetchDataTime = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const createDataTime = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const updateDataTime = async (endpoint, timeid, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const deleteDataTime = async (endpoint, timeid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { timeid },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error deleting data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchelectivedata = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchCourseCategory = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchCourseDuration = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDataCourse = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // If the server responds with an error
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      // If no response is received
      console.error("No response received:", error.request);
    } else {
      // General error (e.g., request setup)
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error; // Re-throw the error for further handling
  }
};

export const createDataCourse = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // If the server responds with an error
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      // If no response is received
      console.error("No response received:", error.request);
    } else {
      // General error (e.g., request setup)
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const updateDataCourse = async (endpoint, cid, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // If the server responds with an error
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      // If no response is received
      console.error("No response received:", error.request);
    } else {
      // General error (e.g., request setup)
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const deleteDataCourse = async (endpoint, cid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { cid }, // Send rid in the request body
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // If the server responds with an error
      console.error("Error deleting data:", error.response.data);
    } else if (error.request) {
      // If no response is received
      console.error("No response received:", error.request);
    } else {
      // General error (e.g., request setup)
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDataFaculty = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const createDataFaculty = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const updateDataFaculty = async (endpoint, fid, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const deleteDataFaculty = async (endpoint, fid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { fid },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error deleting data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDataGaps = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDataTimeTable = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const createDataTimeTable = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const updateDataTimeTable = async (endpoint, tid, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const deleteDataTimeTable = async (endpoint, tid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { tid },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error deleting data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDataTimeTablebyTID = async (endpoint, tid) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, {
      tid: tid.toString(),
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDatafacultybyID = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchCourseDataAllotment = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const createCourseDataAllotment = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const updateCourseDataAllotment = async (endpoint, caid, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const deleteCourseDataAllotment = async (endpoint, caid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { caid },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error deleting data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDataProgram = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const createDataProgram = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const updateDataProgram = async (endpoint, pid, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const deleteDataProgram = async (endpoint, pid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { pid },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error deleting data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDataDepartment = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const createDataDepartment = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const updateDataDepartment = async (endpoint, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const deleteDataDepartment = async (endpoint, did) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { did },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error deleting data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchClassRoomstype = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchFloors = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDatacourseandfaculty = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw new Error("Failed to fetch data.");
  }
};

export const fetchDataClassroom = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw new Error("Failed to fetch data.");
  }
};

export const createDataClassroom = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating data at ${endpoint}:`, error);
    throw new Error("Failed to create data.");
  }
};

export const updateDataClassroom = async (endpoint, id, data) => {
  try {
    data.rid = id;
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data with ID ${id} at ${endpoint}:`, error);
    throw new Error("Failed to update data.");
  }
};

export const deleteDataClassroom = async (endpoint, rid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { rid }, // Send rid in the request body
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting data with ID ${rid} at ${endpoint}:`, error);
    throw new Error("Failed to delete data.");
  }
};

export const fetchDataAllotment = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw new Error("Failed to fetch data.");
  }
};

export const createDataAllotment = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating data at ${endpoint}:`, error);
    throw new Error("Failed to create data.");
  }
};

export const updateDataAllotment = async (endpoint, id, data) => {
  try {
    data.aid = id;
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data with ID ${id} at ${endpoint}:`, error);
    throw new Error("Failed to update data.");
  }
};

export const deleteDataAllotment = async (endpoint, aid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { aid },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting data with ID ${aid} at ${endpoint}:`, error);
    throw new Error("Failed to delete data.");
  }
};

export const fetchDataYear = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const createDataYear = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const updateDataYear = async (endpoint, yid, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const deleteDataYear = async (endpoint, yid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { yid },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error deleting data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDataSemester = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const createDataSemester = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const updateDataSemester = async (endpoint, semid, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const deleteDataSemester = async (endpoint, semid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { semid },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error deleting data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDataSectionFields = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const fetchDataSection = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const createDataSection = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const updateDataSection = async (endpoint, sid, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const deleteDataSection = async (endpoint, sid) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      data: { sid },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error deleting data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

// ************Admin Login Code *************************

export const adminLogin = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};

export const adminUpdatePassword = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
    }
    throw error;
  }
};

export const register = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error creating data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
      alert(`Error: ${error.message}`);
    }
    throw error;
  }
};
