import { useState } from "react";
import Input from "./Input";
import Collection from "../../core/collection";
import Button from "./Button";

interface RegisterCollecttionFormProps {
    collection: Collection
    collectionChanged?: (collection: Collection) => void
    cancelled?: () => void
}

export default function RegisterCollecttionForm(props: RegisterCollecttionFormProps) {

    const id = props.collection?.id ?? null
    const [name, setName] = useState(props.collection?.name ?? '')
    const [error, setError] = useState('')

    const submit = () => {
        if (!name.trim()) {
            setError("Informe o nome da coleção")
            return
        }
        props.collectionChanged?.(new Collection(id, name.trim()))
    }

    return (
        <div className="w-full max-w-lg mx-auto my-8">
            <h2 className="text-xl font-bold mb-6">
                {id ? "Alterar coleção" : "Nova coleção"}
            </h2>

            <div className="flex flex-col gap-4">
                {id && <Input readOnly text="ID" value={id} />}
                <Input
                    text="Nome da coleção"
                    placeholder="Ex: Tex Coleção"
                    value={name}
                    onChange={(v) => { setName(v); setError('') }}
                    error={error}
                />
            </div>

            <div className="mt-8 flex justify-end gap-2">
                <Button onClick={props.cancelled} color="gray">Cancelar</Button>
                <Button color="blue" onClick={submit}>
                    {id ? "Alterar" : "Salvar"}
                </Button>
            </div>
        </div>
    )
}
