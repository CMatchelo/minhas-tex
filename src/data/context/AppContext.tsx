import { createContext, useEffect, useState } from "react";

//type Theme = 'dark' | ''

interface AppContextProps {
    theme?: string
    changeTheme?: () => void
}

const AppContext = createContext<AppContextProps>({
    theme: null,
    changeTheme: null
})

export function AppProvider(props) {

    const [ theme, setTheme ] = useState('dark')

    function changeTheme() {
        const newTheme = theme === '' ? 'dark' : ''
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        setTheme(savedTheme)
    }, [])

    return (
        <AppContext.Provider value={{
            theme, changeTheme
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContext