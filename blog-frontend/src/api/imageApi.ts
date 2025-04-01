import apiClient from './apiClient';
import { getApiKey } from '../utils/tokenStorage';

interface ImageInfo {
  imageId: string;
  name?: string;
}

export const uploadImage = async (file: File): Promise<ImageInfo> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post<ImageInfo[]>('/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data[0];
};

export const deleteImage = async (imageId: string): Promise<void> => {
  await apiClient.delete(`/images/${imageId}`);
};

export const getImageUrl = (imageId: string): string => {
  const apiKey = getApiKey();
  const baseUrl = `https://fullstack.exercise.applifting.cz/images/${imageId}`;
  
  // Add API key as a URL parameter for direct image links
  return apiKey ? `${baseUrl}?apiKey=${encodeURIComponent(apiKey)}` : baseUrl;
};
