import React, { useState, useEffect } from 'react';
import { Box, Image, Text, Spinner } from '@chakra-ui/react';
import { getApiKey, getAccessToken } from '../../utils/tokenStorage';
import axios from 'axios';

interface ApiImageProps {
  imageId?: string;
  alt?: string;
  fallbackText?: string;
  minHeight?: string;
  maxHeight?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: string;
  mb?: number;
}

const ApiImage: React.FC<ApiImageProps> = ({
  imageId,
  alt = 'Image',
  fallbackText = 'Image unavailable',
  minHeight = '200px',
  maxHeight = 'auto',
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  borderRadius,
  mb,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!imageId) return;

    const fetchImage = async () => {
      const apiKey = getApiKey();
      const accessToken = getAccessToken();

      if (!apiKey) {
        console.error('API Key is missing');
        setError(true);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const response = await axios.get(
          `https://fullstack.exercise.applifting.cz/images/${imageId}`,
          {
            responseType: 'blob',
            headers: {
              'X-API-KEY': apiKey,
              ...(accessToken && { Authorization: accessToken }),
            },
          }
        );

        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        console.error('Error fetching image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageId]);

  if (loading) {
    return (
      <Box
        bg="gray.50"
        width={width}
        minHeight={minHeight}
        maxHeight={maxHeight}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius={borderRadius}
        mb={mb}
      >
        <Spinner size="lg" color="blue.500" />
      </Box>
    );
  }

  if (!imageId || error || !imageUrl) {
    return (
      <Box
        bg="gray.100"
        width={width}
        minHeight={minHeight}
        maxHeight={maxHeight}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius={borderRadius}
        mb={mb}
      >
        <Text color="gray.400">{fallbackText}</Text>
      </Box>
    );
  }

  return (
    <Box
      width={width}
      height={height}
      minHeight={minHeight}
      maxHeight={maxHeight}
      mb={mb}
      position="relative"
      overflow="hidden"
      borderRadius={borderRadius}
    >
      <Image
        src={imageUrl}
        alt={alt}
        width="100%"
        height="100%"
        objectFit={objectFit}
        position={height !== 'auto' ? 'absolute' : 'static'}
        top="0"
        left="0"
        onError={() => setError(true)}
      />
    </Box>
  );
};

export default ApiImage;
