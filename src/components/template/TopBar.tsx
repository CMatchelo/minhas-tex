import React, { useEffect } from "react";
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
        <div className={`flex bg-gray-200 dark:bg-gray-700 p-4`}>
            <div className=" flex flex-col md:flex-row">
                <Title title={props.title} subtitle={props.subtitle} />
                <div className="flex items-center text-md md:text-xl font-bold md:ml-5 dark:text-gray-200">
                    {props.sortedIssues && (
                        <div>
                            {props.sortedIssues?.length > 0 ? (
                                <span>{props.sortedIssues.length} edições encontradas </span>
                            ) : (
                                <span> Oops, não encontramos revistas para exibir </span>
                            )}
                        </div>
                    )}

                </div>
            </div>
            <div className={`flex flex-grow justify-end items-center`}>
                <BtnChangeTheme theme={theme} changeTheme={changeTheme} />
                <UserAvatar className="ml-2" />
            </div>
        </div>
    )
}