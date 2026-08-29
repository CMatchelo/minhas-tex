import { useEffect, useState, ReactNode } from "react"
import { createPortal } from "react-dom"
import { IconClose } from "../icons"

interface ModalProps {
    open: boolean
    onClose: () => void
    title?: string
    children: ReactNode
    footer?: ReactNode
    /** max width utility, e.g. "max-w-md" (default) or "max-w-2xl" */
    size?: string
}

export default function Modal(props: ModalProps) {
    const { open, onClose } = props
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (!open) return

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        document.addEventListener("keydown", onKey)

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", onKey)
            document.body.style.overflow = previousOverflow
        }
    }, [open, onClose])

    if (!mounted || !open) return null

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={props.title}
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
                onClick={props.onClose}
            />
            <div
                className={`
                    relative w-full ${props.size ?? "max-w-md"}
                    bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
                    rounded-lg shadow-2xl
                `}
            >
                <div className="flex items-start justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold">{props.title}</h2>
                    <button
                        onClick={props.onClose}
                        aria-label="Fechar"
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {IconClose(5)}
                    </button>
                </div>
                <div className="p-4">{props.children}</div>
                {props.footer && (
                    <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                        {props.footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}
