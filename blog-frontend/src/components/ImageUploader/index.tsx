import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { uploadImage, deleteImage } from '../../api/imageApi';
import ImagePreview from './components/ImagePreview';
import UploadDropzone from './components/UploadDropzone';

interface ImageUploaderProps {
  initialImageId?: string;
  onImageUploaded: (imageId: string) => void;
  onImageRemoved: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImageId,
  onImageUploaded,
  onImageRemoved,
}) => {
  const [imageId, setImageId] = useState<string | undefined>(initialImageId);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    setImageId(initialImageId);
  }, [initialImageId]);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (jpeg, png, etc.)');
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return false;
    }
    
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      if (imageId) {
        await deleteImage(imageId);
      }

      const uploadedImage = await uploadImage(file);
      setImageId(uploadedImage.imageId);
      onImageUploaded(uploadedImage.imageId);

      toast({
        title: 'Image uploaded',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
      
      toast({
        title: 'Upload failed',
        description: 'There was a problem uploading your image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!imageId) return;

    try {
      await deleteImage(imageId);
      setImageId(undefined);
      onImageRemoved();

      toast({
        title: 'Image removed',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Delete error:', error);
      
      toast({
        title: 'Error',
        description: 'Failed to remove image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel>Featured Image</FormLabel>
        
        {imageId ? (
          <ImagePreview 
            imageId={imageId} 
            onRemove={handleRemoveImage}
            onUploadNew={() => fileInputRef.current?.click()}
          />
        ) : (
          <UploadDropzone 
            isUploading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          />
        )}
        
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          display="none"
        />
        
        {error && (
          <Text color="red.500" fontSize="sm" mt={2}>
            {error}
          </Text>
        )}
      </FormControl>
    </Box>
  );
};

export default ImageUploader;
