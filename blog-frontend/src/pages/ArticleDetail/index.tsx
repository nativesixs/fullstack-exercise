import React from 'react';
import { Heading, Text, Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const ArticleDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  
  return (
    <Box>
      <Heading as="h1" mb={4}>Article Detail</Heading>
      <Text>Viewing article with ID: {articleId}</Text>
    </Box>
  );
};

export default ArticleDetail;
