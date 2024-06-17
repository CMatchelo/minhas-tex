interface ButtonProps {
    color?: 'green' | 'blue' | 'yellow' | 'gray' 
    className?: string
    children: any
    onClick?: () => void
}

export default function Button(props: ButtonProps) {

    const color = props.color ?? 'yellow'
    const hoverBgColor = `hover:bg-${color}-900`;

    return (
        <button onClick={props.onClick} className={`
        bg-${color}-500 ${hoverBgColor}
        text-white px-4 py-2 rounded-md 
        ${props.className}
      `}>
            {props.children}
        </button>
    )
}