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

    // Titulo, Ediçao, Paginas, COlecao, Capa, mes, ano, preço, escritor, artista, mais hitorias, id
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
    const [additionalStories, setAdditionalStories] = useState(props.issue?.additionalStories ?? '')
    const { collections } = useCollections();
    // 
    const handleChange = (event) => {
        setCollection(event.target.value)
    };

    const handleMonth = (event) => {
        setMonth(event.target.value)
    }

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

        if (!title || !edition || edition === 0 || !pagesQty || pagesQty === 0 || !collection || !month || !year || year === 0) {
            alert("Preencha todos os dados obrigatórios")
            return
        }
        if (coverURL) {
            const renamedFile = renameFile(coverURL);
            const storageRef = storage.ref(`${user.uid}/capas/${renamedFile.name}`);
            await storageRef.put(renamedFile);
            newImage = await storageRef.getDownloadURL();
        } else {
            newImage = downloadURL
        }

        const newIssue = new Issue(title, +edition, +pagesQty, collection, newImage, month, year, price, writer, artist, additionalStories, id);
        props.issueChanged?.(newIssue);
    };
    // Titulo, Ediçao, Paginas, COlecao, Capa, mes, ano, preço, escritor, artista, id
    return (
        <div className="flex flex-col md:mx-40 lg:mx-80 my-10 text-black dark:text-white">

            {id ? (
                <Input readOnly text="Codigo" value={id} className="mb-4" />
            ) : false}
            <Input text="Titulo *" placeholder="Ex: Tex no velho oeste" value={title} onChange={setTitle} className="mb-4" />
            <Input text="Edição *" placeholder="Ex: 153" type="number" value={edition} onChange={setEdition} className="mb-4" />
            <Input text="Páginas *" placeholder="Ex: 198" type="number" value={pagesQty} onChange={setPagesQty} className="mb-4" />
            <label className="mb-2">Coleção *</label>
            <select
                className={`
                    bg-gray-200 dark:bg-gray-700 border-b border-yellow-500 rounded-lg
                    focus: outline-none px-4 py-2 text-gray-700 dark:text-gray-200
                `}
                id="collections" onChange={handleChange}>
                <option value="">Escolha uma coleção</option>
                {collections.map(collection => (
                    <option key={collection.id} value={collection.name}>
                        {collection.name}
                    </option>
                ))}
            </select>

            {!id ? (
                <div className="flex flex-col my-4">
                    <label className="mb-2">Capa *</label>
                    <input type="file" onChange={handleFileChange} required />
                </div>
            ) : false}

            <label className="mb-2">Mês de lançamento *</label>
            <select
                className={`
                    bg-gray-200 dark:bg-gray-700 border-b border-yellow-500 rounded-lg
                    focus: outline-none px-4 py-2 text-gray-700 dark:text-gray-200
                `}
                id="month" value={month} onChange={handleMonth}>
                <option value="">Escolha um mês</option>
                <option value="Janeiro">Janeiro</option>
                <option value="Fevereiro">Fevereiro</option>
                <option value="Março">Março</option>
                <option value="Abril">Abril</option>
                <option value="Maio">Maio</option>
                <option value="Junho">Junho</option>
                <option value="Julho">Julho</option>
                <option value="Agosto">Agosto</option>
                <option value="Setembro">Setembro</option>
                <option value="Outubro">Outubro</option>
                <option value="Novembro">Novembro</option>
                <option value="Dezembro">Dezembro</option>
            </select>
            <Input text="Ano de lançamento *" type="number" value={year} onChange={setYear} className="mb-4" />
            <Input text="Preço" type="number" value={price} onChange={setPrice} className="mb-4" />
            <Input text="Roteiro por:" value={writer} onChange={setWriter} className="mb-4" />
            <Input text="Desenhos por:" value={artist} onChange={setArtist} className="mb-4" />
            <Input text="Histórias adicionais:" value={additionalStories} onChange={setAdditionalStories} className="mb-4" />
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