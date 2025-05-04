import api from './api';

const token = localStorage.getItem("accessToken");

export const getResourcesByChapter = async (chapterId) => {
  const response = await api.get(`chapters/${chapterId}/resources/`);
  return response.data;
};

export const addRessource = async (courseData) => {
    const response = await api.post(`courses/resources/`,courseData,
        {
            headers: { Authorization: `Bearer ${token}` },
            'Content-Type': 'application/json'
        }
    );
    return response.data;
};
  
