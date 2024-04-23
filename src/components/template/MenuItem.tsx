import React from "react"
import Link from "next/link"

interface MenuItemProps {
    url?: string
    text: string
    icon: any
    className?: string
    onClick?: (event: any) => void
}

export default function MenuItem(props: MenuItemProps) {

    function renderContent() {
        return (
            <a className={`
                    flex flex-col justify-center items-center
                    dark:text-gray-200
                    h-20 w-20 ${props.className}
                `}>
                {props.icon}
                <span className={`
                        text-xs font-light
                    `}>
                    {props.text}
                </span>
            </a>
        )
    }

    return (
        <li onClick={props.onClick} className={`
            hover:bg-yellow-200 dark:hover:bg-yellow-800 cursor-pointer
        `}>
            {props.url ? (
                <Link legacyBehavior href={props.url}>
                    {renderContent()}
                </Link>
            ) : (
                renderContent()
            )}
        </li>
    )
}