import React from 'react';
import { Heading, Text, Box } from '@chakra-ui/react';

const NewArticle: React.FC = () => {
  return (
    <Box>
      <Heading as="h1" mb={4}>Create New Article</Heading>
      <Text>New article form will be displayed here</Text>
    </Box>
  );
};

export default NewArticle;
