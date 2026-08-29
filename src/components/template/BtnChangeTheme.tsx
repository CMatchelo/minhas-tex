import { IconMoon, IconSun } from "../icons"
import React from "react";

interface BtnChangeThemeProps {
    theme: string
    changeTheme: () => void
}

export default function BtnChangeTheme(props: BtnChangeThemeProps) {

    const isDark = props.theme === "dark"

    return (
        <button
            type="button"
            onClick={props.changeTheme}
            role="switch"
            aria-checked={isDark}
            aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-full"
        >
            {/* Compact icon-only toggle on small screens */}
            <span className="sm:hidden flex items-center justify-center h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-800 text-yellow-500">
                {isDark ? IconSun(5) : IconMoon(5)}
            </span>

            {/* Full pill on >= sm */}
            {isDark ? (
                <span className="hidden sm:flex items-center bg-gradient-to-r from-yellow-300 to-yellow-600 w-14 lg:w-24 h-8 p-1 rounded-full">
                    <span className="flex items-center justify-center bg-white text-yellow-600 w-6 h-6 rounded-full">
                        {IconSun(6)}
                    </span>
                    <span className="hidden lg:flex items-center ml-3 text-white">
                        <span className="text-sm">Claro</span>
                    </span>
                </span>
            ) : (
                <span className="hidden sm:flex items-center justify-end bg-gradient-to-r from-gray-500 to-gray-900 w-14 lg:w-24 h-8 p-1 rounded-full">
                    <span className="hidden lg:flex items-center mr-2 text-gray-300">
                        <span className="text-sm">Escuro</span>
                    </span>
                    <span className="flex items-center justify-center bg-black text-yellow-300 w-6 h-6 rounded-full">
                        {IconMoon(6)}
                    </span>
                </span>
            )}
        </button>
    )
}
