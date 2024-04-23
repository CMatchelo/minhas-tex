import { useState } from "react";
import Input from "./Input";
import Issue from "../../core/Issue";
import Button from "./Button";
import useCollections from "../../hooks/useCollections";

interface RegisterEditionFormProps {
    issue: Issue
    issueChanged?: (issue: Issue) => void
    canceled?: () => void
}

export default function RegisterEditionForm(props: RegisterEditionFormProps) {

    const id = props.issue?.id ?? null
    const [title, setTitle] = useState(props.issue?.title ?? '')
    const [edition, setEdition] = useState(props.issue?.edition ?? 0)
    const [pagesQty, setPagesQty] = useState(props.issue?.pagesQty ?? 0)
    const [collection, setCollection] = useState(props.issue?.collection ?? '')
    const { collections } = useCollections();

    const handleChange = (event) => {
        setCollection(event.target.value)
    };

    return (
        <div>
            {id ? (
                <Input readOnly text="Codigo" value={id} className="mb-4" />
            ) : false}
            <Input text="Titulo" value={title} onChange={setTitle} className="mb-4" />
            <Input text="Edição" type="number" value={edition} onChange={setEdition} className="mb-4" />
            <Input text="Páginas" type="number" value={pagesQty} onChange={setPagesQty} />
            <select id="collections" onChange={handleChange}>
                <option value="">Select a Collection</option>
                {collections.map(collection => (
                    <option key={collection.id} value={collection.name}>
                        {collection.name}
                    </option>
                ))}
            </select>
            <div className="flex justify-end mt-7">
                <Button color="yellow" className="mr-2" 
                    onClick={() => props.issueChanged?.(new Issue(title, +edition, +pagesQty, collection, id))}>
                    {id ? 'Alterar' : 'Salvar'}
                </Button>
                <Button onClick={props.canceled} color="gray">
                    Cancelar
                </Button>
            </div>
        </div>
    )
}