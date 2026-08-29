type ButtonColor = "green" | "blue" | "yellow" | "gray" | "red"

interface ButtonProps {
    color?: ButtonColor
    className?: string
    children: any
    type?: "button" | "submit" | "reset"
    disabled?: boolean
    loading?: boolean
    onClick?: () => void
}

const COLOR_CLASSES: Record<ButtonColor, string> = {
    yellow: "bg-yellow-500 hover:bg-yellow-600 focus-visible:ring-yellow-400",
    gray: "bg-gray-500 hover:bg-gray-600 focus-visible:ring-gray-400",
    blue: "bg-blue-500 hover:bg-blue-600 focus-visible:ring-blue-400",
    green: "bg-green-500 hover:bg-green-600 focus-visible:ring-green-400",
    red: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-400",
}

export default function Button(props: ButtonProps) {

    const color = props.color ?? "yellow"
    const isDisabled = props.disabled || props.loading

    return (
        <button
            type={props.type ?? "button"}
            onClick={props.onClick}
            disabled={isDisabled}
            aria-busy={props.loading || undefined}
            className={`
                inline-flex items-center justify-center gap-2
                ${COLOR_CLASSES[color]}
                text-white px-4 py-2 rounded-md font-medium
                transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                focus-visible:ring-offset-transparent
                active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
                ${props.className ?? ""}
            `}
        >
            {props.loading && (
                <span
                    className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                    aria-hidden="true"
                />
            )}
            {props.children}
        </button>
    )
}
