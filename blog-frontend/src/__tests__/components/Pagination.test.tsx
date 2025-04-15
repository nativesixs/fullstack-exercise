import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import Pagination from '../../components/Pagination';

describe('Pagination Component', () => {
  const onPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page numbers correctly', () => {
    render(
      <ChakraProvider>
        <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
      </ChakraProvider>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should not render pagination when there is only one page', () => {
    render(
      <ChakraProvider>
        <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />
      </ChakraProvider>
    );

    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <ChakraProvider>
        <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
      </ChakraProvider>
    );

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('calls onPageChange with correct page when a page button is clicked', () => {
    render(
      <ChakraProvider>
        <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
