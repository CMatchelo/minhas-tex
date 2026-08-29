import React from "react"
import Link from "next/link"

interface MenuItemProps {
    url?: string
    text: string
    icon: any
    active?: boolean
    className?: string
    onClick?: (event: any) => void
}

export default function MenuItem(props: MenuItemProps) {

    const base = `
        flex flex-col justify-center items-center gap-1
        h-20 w-20 dark:text-gray-200 transition-colors
        ${props.className ?? ""}
    `

    const content = (
        <>
            {props.icon}
            <span className="text-xs font-light sm:block hidden">
                {props.text}
            </span>
        </>
    )

    return (
        <li
            onClick={props.onClick}
            className={`
                cursor-pointer transition-colors
                ${props.active
                    ? "bg-yellow-200 dark:bg-yellow-800 border-l-4 border-yellow-500"
                    : "hover:bg-yellow-100 dark:hover:bg-yellow-900 border-l-4 border-transparent"}
            `}
        >
            {props.url ? (
                <Link href={props.url} className={base}>
                    {content}
                </Link>
            ) : (
                <a className={base}>{content}</a>
            )}
        </li>
    )
}
