import React from "react"

interface ContentProps {
    children?: any
}

export default function Content(props: ContentProps) {
    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden dark:text-gray-200">
            <div className="flex flex-col items-stretch w-full px-4 md:px-6 pt-6 pb-24 md:pb-8">
                {props.children}
            </div>
        </div>
    )
}
