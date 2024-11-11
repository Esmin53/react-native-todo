import { createContext, ReactNode, useState } from "react";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";

interface IProps {
    children: React.ReactNode;
  }

export const ThemeContext = createContext<{
    colorScheme: "light" | "dark" | null | undefined
    setColorScheme: React.Dispatch<React.SetStateAction<"light" | "dark" | null | undefined>>
    theme: {
        text: string,
        background: string,
        secondaryBackground: string,
        button: string,
        green: string,
        red: string
    } | null
}>({
    colorScheme: null,
    theme: null,
    setColorScheme: () => null
})

export const ThemeProvider = ({children}: IProps) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme())
    
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light

    return (
        <ThemeContext.Provider value={{colorScheme, setColorScheme, theme}}>
            {children}
        </ThemeContext.Provider>
    )
}