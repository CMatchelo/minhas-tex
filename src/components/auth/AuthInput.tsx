interface AuthInputProps {
    label: string
    value: any
    type?: 'text' | 'email' | 'password'
    required?: boolean
    valueChanged: (newValue: any) => void
    doNotRenderWhen?: boolean
}

export default function AuthInput(props: AuthInputProps) {
    return props.doNotRenderWhen ? null : (
        <div className={`
            flex flex-col mt-4
        `}>
            <label>{props.label}</label>
            <input
                type={props.type ?? 'text'}
                value={props.value}
                onChange={e => props.valueChanged?.(e.target.value)}
                required={props.required}
                className={`
                    px-4 py-4 rounded-lg bg-gray-200
                    border focus:border-yellow-500
                    focus:outline-none focus:bg-white
                `}
            />
        </div>
    )
}