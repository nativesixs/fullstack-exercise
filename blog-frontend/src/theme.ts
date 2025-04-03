import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F0FC',
      100: '#B3D0F7',
      500: '#2D66DD',
      600: '#2455B8',
      700: '#1B4493',
      800: '#13336F',
      900: '#0A224A',
    },
    gray: {
      50: '#F9F9F9',
      100: '#EBEBEB',
      200: '#DEDEDE',
      300: '#CCCCCC',
      400: '#B0B0B0',
      500: '#9C9C9C',
      600: '#6D6D6D',
      700: '#4F4F4F',
      800: '#373737',
      900: '#212121',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: '4px',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          color: 'brand.500',
          borderColor: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Link: {
      baseStyle: {
        fontWeight: '500',
        _hover: {
          textDecoration: 'none',
          color: 'brand.600',
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '600',
        color: 'gray.800',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
    },
    Table: {
      variants: {
        simple: {
          th: {
            borderBottom: '1px',
            borderColor: 'gray.200',
            padding: '1rem',
            fontWeight: '600',
            fontSize: 'sm',
            color: 'gray.700',
          },
          td: {
            borderBottom: '1px',
            borderColor: 'gray.100',
            padding: '1rem',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

export default theme;
