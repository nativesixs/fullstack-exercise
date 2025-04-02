import React from 'react';
import { Flex, Text, Spinner } from '@chakra-ui/react';

interface UploadDropzoneProps {
  isUploading: boolean;
  onClick: () => void;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ 
  isUploading, 
  onClick 
}) => {
  return (
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
      onClick={onClick}
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
  );
};

export default UploadDropzone;
