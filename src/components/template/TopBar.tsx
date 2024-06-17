import React from "react";
import Title from "./Title";
import BtnChangeTheme from "./BtnChangeTheme";
import useAppData from "../../data/hook/useAppData";
import UserAvatar from "./UserAvatar";

interface TopBarProps {
    title: string
    subtitle: string
}

export default function TopBar(props: TopBarProps) {

    const { theme, changeTheme } = useAppData()

    return (
        <div className={`flex bg-gray-200 dark:bg-gray-700 p-4`}>
            <Title title={props.title} subtitle={props.subtitle} />
            <div className={`flex flex-grow justify-end items-center`}>
                <BtnChangeTheme theme={theme}changeTheme={changeTheme} />
                <UserAvatar className="ml-2" />
            </div>
        </div>
    )
}