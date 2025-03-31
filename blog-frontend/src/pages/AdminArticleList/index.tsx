import React from 'react';
import { Heading, Text, Box } from '@chakra-ui/react';

const AdminArticleList: React.FC = () => {
  return (
    <Box>
      <Heading as="h1" mb={4}>My Articles</Heading>
      <Text>Admin article list will be displayed here</Text>
    </Box>
  );
};

export default AdminArticleList;
