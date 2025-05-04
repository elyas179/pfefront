import api from './api';

export const getChaptersByModule = async (moduleId) => {
  const response = await api.get(`modules/${moduleId}/chapters/`);
  return response.data;
};
