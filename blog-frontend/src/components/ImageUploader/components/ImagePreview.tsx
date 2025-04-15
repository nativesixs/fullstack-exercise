import React from 'react';
import { Box, HStack, Button } from '@chakra-ui/react';
import ApiImage from '../../ApiImage';

interface ImagePreviewProps {
  imageId: string;
  onRemove: () => Promise<void>;
  onUploadNew: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageId, onRemove, onUploadNew }) => {
  return (
    <Box>
      <Box position="relative" mb={4} height="200px" borderRadius="md" overflow="hidden">
        <ApiImage
          imageId={imageId}
          alt="Featured image"
          borderRadius="md"
          height="100%"
          width="100%"
          minHeight="0"
          objectFit="contain"
        />
      </Box>
      <HStack spacing={4}>
        <Button size="sm" variant="ghost" colorScheme="blue" onClick={onUploadNew}>
          Upload new
        </Button>
        <Button size="sm" colorScheme="red" variant="ghost" onClick={onRemove}>
          Delete
        </Button>
      </HStack>
    </Box>
  );
};

export default ImagePreview;
