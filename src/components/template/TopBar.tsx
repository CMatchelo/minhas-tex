import React from "react";
import Title from "./Title";
import BtnChangeTheme from "./BtnChangeTheme";
import useAppData from "../../data/hook/useAppData";
import UserAvatar from "./UserAvatar";

interface TopBarProps {
    title: string
    subtitle: string
    sortedIssues?: any[]
}

export default function TopBar(props: TopBarProps) {

    const { theme, changeTheme } = useAppData()

    return (
        <header className="flex items-center gap-3 bg-gray-200 dark:bg-gray-700 px-4 py-3 md:px-6 md:py-4">
            <div className="flex flex-col min-w-0 md:flex-row md:items-center md:gap-4">
                <Title title={props.title} subtitle={props.subtitle} />
                {props.sortedIssues && (
                    <span className="mt-1 md:mt-0 inline-flex w-fit items-center rounded-full bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 px-3 py-1 text-xs md:text-sm font-semibold">
                        {props.sortedIssues.length > 0
                            ? `${props.sortedIssues.length} edições encontradas`
                            : "Nenhuma revista para exibir"}
                    </span>
                )}
            </div>
            <div className="flex flex-grow justify-end items-center gap-2">
                <BtnChangeTheme theme={theme} changeTheme={changeTheme} />
                <UserAvatar />
            </div>
        </header>
    )
}
