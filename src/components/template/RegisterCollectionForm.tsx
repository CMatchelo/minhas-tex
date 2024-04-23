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

    return (
        <div>
            {id ? (
                <Input readOnly text="ID" value={id} />
            ) : false}
            <Input onChange={setName} text="Nome da coleçao" value={name} type="text" />
            <div className="mt-7 flex justify-end">
                <Button className="mr-2" color="blue" onClick={() => props.collectionChanged?.(new Collection(id, name))}>
                    {id ? 'Alterar' : 'Salvar'}
                </Button>
                <Button onClick={props.cancelled} color="gray">
                    Cancelar
                </Button>
            </div>
        </div>
    )
}