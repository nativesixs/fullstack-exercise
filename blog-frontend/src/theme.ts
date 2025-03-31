import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#E6F0FC",
      100: "#B3D0F7",
      500: "#2D66DD",
      600: "#2455B8",
      700: "#1B4493",
      800: "#13336F",
      900: "#0A224A",
    },
    gray: {
      50: "#F5F5F5",
      100: "#EBEBEB",
      200: "#DEDEDE",
      300: "#CCCCCC",
      400: "#B0B0B0",
      500: "#9C9C9C",
      600: "#6D6D6D",
      700: "#4F4F4F",
      800: "#373737",
      900: "#212121",
    },
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
});

export default theme;