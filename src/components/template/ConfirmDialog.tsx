import Modal from "./Modal"
import Button from "./Button"

interface ConfirmDialogProps {
    open: boolean
    title?: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
    return (
        <Modal
            open={props.open}
            onClose={props.onCancel}
            title={props.title ?? "Confirmar ação"}
            footer={
                <>
                    <Button color="gray" onClick={props.onCancel}>
                        {props.cancelLabel ?? "Cancelar"}
                    </Button>
                    <Button
                        color={props.danger ? "red" : "yellow"}
                        loading={props.loading}
                        onClick={props.onConfirm}
                    >
                        {props.confirmLabel ?? "Confirmar"}
                    </Button>
                </>
            }
        >
            <p className="text-sm text-gray-600 dark:text-gray-300">{props.message}</p>
        </Modal>
    )
}
