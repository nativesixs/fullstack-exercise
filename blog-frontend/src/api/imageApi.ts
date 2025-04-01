import apiClient from './apiClient';

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

  // TODO - doesnt need to be array
  return response.data[0];
};

export const deleteImage = async (imageId: string): Promise<void> => {
  await apiClient.delete(`/images/${imageId}`);
};

export const getImageUrl = (imageId: string): string => {
  return `https://fullstack.exercise.applifting.cz/images/${imageId}`;
};
