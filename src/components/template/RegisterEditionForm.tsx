import { useState, ChangeEvent, use } from "react";
import Input from "./Input";
import Issue from "../../core/Issue";
import Button from "./Button";
import useCollections from "../../hooks/useCollections";
import { storage } from '../../firebase/config';
import useAuth from "../../data/hook/useAuth";

interface RegisterEditionFormProps {
    issue: Issue
    issueChanged?: (issue: Issue) => void
    canceled?: () => void
}

export default function RegisterEditionForm(props: RegisterEditionFormProps) {

    // Titulo, Ediçao, Paginas, COlecao, Capa, mes, ano, preço, escritor, artista, id
    const { user } = useAuth();
    const id = props.issue?.id ?? null
    const [title, setTitle] = useState(props.issue?.title ?? '')
    const [edition, setEdition] = useState(props.issue?.edition ?? 0)
    const [pagesQty, setPagesQty] = useState(props.issue?.pagesQty ?? 0)
    const [collection, setCollection] = useState(props.issue?.collection ?? '')
    const [coverURL, setCoverURL] = useState<File | null>(null);
    const [downloadURL, setDownloadURL] = useState(props.issue.coverURL ?? '')
    const [month, setMonth] = useState(props.issue?.month ?? '')
    const [year, setYear] = useState(props.issue?.year ?? 0)
    const [price, setPrice] = useState(props.issue?.price ?? 0)
    const [writer, setWriter] = useState(props.issue?.writer ?? '')
    const [artist, setArtist] = useState(props.issue?.artist ?? '')
    const { collections } = useCollections();

    const handleChange = (event) => {
        setCollection(event.target.value)
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverURL(e.target.files[0]);
        }
    };

    const generateRandomString = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const renameFile = (file) => {
        const randomString = generateRandomString();
        const extension = file.name.split('.').pop();
        const newName = `${randomString}.${extension}`;

        // Create a new file object with the new name
        const newFile = new File([file], newName, { type: file.type });
        return newFile;
    }

    const handleSubmitIssue = async () => {

        var newImage;
        if (!downloadURL && !coverURL) {
            alert("Por favor, selecione uma imagem para a capa.");
            return;
        }

        if (coverURL) {
            const renamedFile = renameFile(coverURL);
            const storageRef = storage.ref(`${user.uid}/capas/${coverURL.name}`);
            await storageRef.put(coverURL);
            newImage = await storageRef.getDownloadURL();
        } else {
            newImage = downloadURL
        }

        const newIssue = new Issue(title, +edition, +pagesQty, collection, newImage, month, year, price, writer, artist, id);
        props.issueChanged?.(newIssue);
    };
    // Titulo, Ediçao, Paginas, COlecao, Capa, mes, ano, preço, escritor, artista, id
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
            {!id ? (
                <input type="file" onChange={handleFileChange} required />
            ) : false}
            <Input text="Mês" value={month} onChange={setMonth} />
            <Input text="Ano" type="number" value={year} onChange={setYear} />
            <Input text="Preço" type="number" value={price} onChange={setPrice} />
            <Input text="Roteiro por:" value={writer} onChange={setWriter} />
            <Input text="Desenhos por:" value={artist} onChange={setArtist} />
            <div className="flex justify-end mt-7">
                <Button color="yellow" className="mr-2"
                    onClick={handleSubmitIssue}>
                    {id ? 'Alterar' : 'Salvar'}
                </Button>
                <Button onClick={props.canceled} color="gray">
                    Cancelar
                </Button>
            </div>
        </div>
    )
}