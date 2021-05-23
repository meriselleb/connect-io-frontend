import { theme } from "@chakra-ui/core";

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: {
      100: "#fc037b",
      200: "#fc037b",
      300: "#fc037b",
      400: "#fc037b",
      500: "#0390fc",
      600: "#fc037b",
      700: "#0390fc",
      800: "#0390fc",
      900: "#fc037b"
    }
  }
};

export default customTheme;