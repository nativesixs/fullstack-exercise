import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import ApiImage from '../../components/ApiImage';
import * as tokenStorage from '../../utils/tokenStorage';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../config', () => ({
  config: {
    USE_MOCKS: false,
    API_URL: 'https://mocked-api.com'
  }
}));

describe('ApiImage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    jest.spyOn(tokenStorage, 'getApiKey').mockReturnValue('test-api-key');
  });

  it('renders a loading state initially', () => {
    render(<ApiImage imageId="test-image-id" alt="Test image" />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the image when loaded successfully', async () => {
    mockedAxios.get.mockImplementation(() => 
      Promise.resolve({ 
        data: new Blob(['image data'], { type: 'image/jpeg' }),
        headers: { 'content-type': 'image/jpeg' }
      })
    );
    
    render(<ApiImage imageId="test-image-id" alt="Test image" />);
    
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', 'mock-blob-url');
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test image');
    });
    
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('test-image-id'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-API-KEY': 'test-api-key'
        }),
        responseType: 'blob'
      })
    );
  });

  it('shows fallback text when image fails to load', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Failed to load image'));
    
    render(<ApiImage imageId="test-image-id" alt="Test image" fallbackText="Image not available" />);
    
    await waitFor(() => {
      expect(screen.getByText('Image not available')).toBeInTheDocument();
    });
  });

  it('shows fallback text when imageId is not provided', () => {
    render(<ApiImage imageId={undefined} alt="Test image" fallbackText="No image" />);
    
    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('shows fallback text when API key is missing', async () => {
    jest.spyOn(tokenStorage, 'getApiKey').mockReturnValue(null);
    
    render(<ApiImage imageId="test-image-id" alt="Test image" fallbackText="Image unavailable" />);
    
    await waitFor(() => {
      expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    });
  });
});
