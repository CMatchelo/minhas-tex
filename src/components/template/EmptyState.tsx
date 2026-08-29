import { ReactNode } from "react"

interface EmptyStateProps {
    icon?: ReactNode
    title: string
    message?: string
    action?: ReactNode
}

export default function EmptyState(props: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center gap-3 py-16 px-4 w-full text-gray-500 dark:text-gray-400">
            {props.icon && (
                <div className="text-gray-400 dark:text-gray-500 [&_svg]:h-12 [&_svg]:w-12">
                    {props.icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {props.title}
            </h3>
            {props.message && <p className="text-sm max-w-sm">{props.message}</p>}
            {props.action && <div className="mt-2">{props.action}</div>}
        </div>
    )
}
