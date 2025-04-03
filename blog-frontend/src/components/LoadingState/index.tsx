import React, { ReactNode } from 'react';
import { Flex, Spinner, Text, Box } from '@chakra-ui/react';

interface LoadingStateProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullPage?: boolean;
  height?: string;
  children?: ReactNode;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  text = 'Loading...',
  size = 'xl',
  fullPage = false,
  height,
  children,
}) => {
  const content = (
    <Flex direction="column" align="center" justify="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size={size} />
      {text && !children && (
        <Text mt={4} color="gray.600">
          {text}
        </Text>
      )}
      {children && <Box mt={4}>{children}</Box>}
    </Flex>
  );

  if (fullPage) {
    return (
      <Flex height={height || 'calc(100vh - 200px)'} width="100%" align="center" justify="center">
        {content}
      </Flex>
    );
  }

  return (
    <Box py={10} width="100%" height={height}>
      {content}
    </Box>
  );
};

export default LoadingState;
