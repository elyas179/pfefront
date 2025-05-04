import api from './api';

export const requestAccess = async (resourceId, message = '') => {
  const response = await api.post(`resources/${resourceId}/request-access/`, { message });
  return response.data;
};
