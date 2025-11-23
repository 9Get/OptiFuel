import { createContext, useContext, useState } from "react";
import { MantineProvider } from "@mantine/core";
import { theme as mainTheme } from "../theme";

const ColorSchemeContext = createContext(null);

export function ColorSchemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useState("dark");

  const toggleColorScheme = () => {
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <ColorSchemeContext.Provider value={{ toggleColorScheme }}>
      <MantineProvider
        theme={{ ...mainTheme, colorScheme }}
        toggleColorScheme={toggleColorScheme}
        withGlobalStyles
        withNormalizeCSS
      >
        {children}
      </MantineProvider>
    </ColorSchemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");
  }
  return context;
}
