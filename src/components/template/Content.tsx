import React from "react"

interface ContentProps {
    children?: any
}

export default function Content(props: ContentProps) {
    return (
        <div className={`
            flex flex-col mt-7 overflow-y-auto overflow-x-hidden
            dark:text-gray-200 
        `}>
            {props.children}
        </div>
    )
}