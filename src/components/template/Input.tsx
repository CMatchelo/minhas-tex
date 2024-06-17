interface InputProps {
    text: string
    type?: 'text' | 'number'
    value?: any
    readOnly?: boolean
    onChange?: (value: any) => void
    className?: string
    placeholder?: string
}

export default function Input(props: InputProps) {
    return (
        <div className={` flex flex-col ${props.className}`}>
            <label className="mb-2">
                {props.text}
            </label>
            <input
                type={props.type ?? 'text'}
                value={props.value}
                readOnly={props.readOnly}
                onChange={e => props.onChange?.(e.target.value)}
                placeholder={props.placeholder}
                className={`
                    bg-gray-700 border-b border-yellow-500 rounded-lg
                    focus: outline-none px-4 py-2 text-black
                `}
            />
        </div>
    )
}