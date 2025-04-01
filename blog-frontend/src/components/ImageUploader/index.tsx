import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Flex,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { uploadImage, deleteImage } from '../../api/imageApi';
import ApiImage from '../ApiImage';

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (jpeg, png, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
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
          <Box position="relative" mb={4}>
            <ApiImage 
              imageId={imageId} 
              alt="Featured image" 
              borderRadius="md"
              maxHeight="200px"
              mb={2}
            />
            <Button 
              size="sm" 
              colorScheme="red" 
              onClick={handleRemoveImage}
              position="absolute"
              top="5px"
              right="5px"
            >
              Remove
            </Button>
          </Box>
        ) : (
          <Flex
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="md"
            p={6}
            direction="column"
            align="center"
            justify="center"
            textAlign="center"
            mb={4}
            cursor="pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Spinner size="lg" mb={2} />
            ) : (
              <>
                <Text mb={2}>Drag and drop an image or click to browse</Text>
                <Text fontSize="sm" color="gray.500">
                  JPG, PNG or GIF • Max size 2MB
                </Text>
              </>
            )}
          </Flex>
        )}
        
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          display="none"
        />
        
        {!imageId && (
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            isDisabled={isUploading}
          >
            Select Image
          </Button>
        )}
        
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
