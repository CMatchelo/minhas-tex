import { useId } from "react"

interface SelectOption {
    label: string
    value: string
}

interface SelectProps {
    text?: string
    value?: string
    onChange?: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    className?: string
    error?: string
    id?: string
}

export default function Select(props: SelectProps) {
    const generatedId = useId()
    const id = props.id ?? generatedId

    return (
        <div className={`flex flex-col ${props.className ?? ""}`}>
            {props.text && (
                <label htmlFor={id} className="mb-2 text-sm font-medium">
                    {props.text}
                </label>
            )}
            <select
                id={id}
                value={props.value}
                onChange={e => props.onChange?.(e.target.value)}
                aria-invalid={props.error ? true : undefined}
                className={`
                    bg-gray-200 dark:bg-gray-700 rounded-lg
                    border ${props.error ? "border-red-500" : "border-transparent border-b-yellow-500"}
                    px-4 py-2 text-gray-700 dark:text-gray-200
                    transition-shadow cursor-pointer
                    focus:outline-none focus:ring-2
                    ${props.error ? "focus:ring-red-500" : "focus:ring-yellow-500"}
                `}
            >
                {props.placeholder && <option value="">{props.placeholder}</option>}
                {props.options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {props.error && (
                <span className="mt-1 text-xs text-red-500">{props.error}</span>
            )}
        </div>
    )
}
