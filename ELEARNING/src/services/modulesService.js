import api from './api';

export const getModules = async () => {
  const response = await api.get('modules/');
  return response.data;
};
