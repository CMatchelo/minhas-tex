import { createContext, useEffect, useState } from "react";

type Theme = "dark" | "";

interface AppContextProps {
    theme?: Theme
    changeTheme?: () => void
}

const AppContext = createContext<AppContextProps>({
    theme: "dark",
    changeTheme: null
})

function resolveInitialTheme(): Theme {
    if (typeof window === "undefined") return "dark"
    const saved = window.localStorage.getItem("theme")
    if (saved === "dark" || saved === "") return saved
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches
    return prefersLight ? "" : "dark"
}

export function AppProvider(props) {

    const [theme, setTheme] = useState<Theme>("dark")

    function changeTheme() {
        const newTheme: Theme = theme === "" ? "dark" : ""
        setTheme(newTheme)
        try {
            localStorage.setItem("theme", newTheme)
        } catch {
            // localStorage indisponível (modo privado, etc.)
        }
    }

    useEffect(() => {
        setTheme(resolveInitialTheme())
    }, [])

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark")
    }, [theme])

    return (
        <AppContext.Provider value={{
            theme, changeTheme
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContext
