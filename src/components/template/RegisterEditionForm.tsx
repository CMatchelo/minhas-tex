import { useEffect, useMemo, useState, ChangeEvent } from "react";
import Input from "./Input";
import Select from "./Select";
import Issue from "../../core/Issue";
import Button from "./Button";
import useCollections from "../../hooks/useCollections";
import { storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useAuth from "../../data/hook/useAuth";
import { IconWarning } from "../icons";

interface RegisterEditionFormProps {
    issue: Issue
    issueChanged?: (issue: Issue) => void
    canceled?: () => void
}

const MONTHS = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

type FormErrors = Record<string, string>

export default function RegisterEditionForm(props: RegisterEditionFormProps) {

    const { user } = useAuth();
    const { collections } = useCollections();

    const id = props.issue?.id ?? null
    const [title, setTitle] = useState(props.issue?.title ?? '')
    const [edition, setEdition] = useState<number | string>(props.issue?.edition || '')
    const [pagesQty, setPagesQty] = useState<number | string>(props.issue?.pagesQty || '')
    const [collection, setCollection] = useState(props.issue?.collection ?? '')
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [downloadURL] = useState(props.issue?.coverURL ?? '')
    const [month, setMonth] = useState(props.issue?.month ?? '')
    const [year, setYear] = useState<number | string>(props.issue?.year || '')
    const [price, setPrice] = useState<number | string>(props.issue?.price || '')
    const [writer, setWriter] = useState(props.issue?.writer ?? '')
    const [artist, setArtist] = useState(props.issue?.artist ?? '')
    const [additionalStories, setAdditionalStories] = useState(props.issue?.additionalStories ?? '')

    const [errors, setErrors] = useState<FormErrors>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const previewUrl = useMemo(
        () => (coverFile ? URL.createObjectURL(coverFile) : ''),
        [coverFile]
    )
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    const currentCover = previewUrl || downloadURL

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverFile(e.target.files[0]);
            setErrors(prev => ({ ...prev, cover: '' }))
        }
    };

    const generateRandomString = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const renameFile = (file: File) => {
        const extension = file.name.split('.').pop();
        const newName = `${generateRandomString()}.${extension}`;
        return new File([file], newName, { type: file.type });
    }

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const img = new window.Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const maxWidth = 600;
                const scale = Math.min(1, maxWidth / img.width);
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(
                    (blob) => {
                        const name = file.name.replace(/\.[^.]+$/, '.webp');
                        resolve(new File([blob!], name, { type: 'image/webp' }));
                    },
                    'image/webp',
                    0.8
                );
            };
            img.src = url;
        });
    };

    const validate = (): FormErrors => {
        const e: FormErrors = {}
        if (!title.trim()) e.title = "Informe o título"
        if (!Number(edition)) e.edition = "Informe a edição"
        if (!Number(pagesQty)) e.pagesQty = "Informe o número de páginas"
        if (!collection) e.collection = "Escolha uma coleção"
        if (!month) e.month = "Escolha o mês"
        if (!Number(year)) e.year = "Informe o ano"
        if (!downloadURL && !coverFile) e.cover = "Selecione uma imagem para a capa"
        return e
    }

    const handleSubmitIssue = async () => {
        setSubmitError('')
        const found = validate()
        setErrors(found)
        if (Object.keys(found).length > 0) return

        setSubmitting(true)
        try {
            let newImage = downloadURL
            if (coverFile) {
                const compressed = await compressImage(coverFile);
                const renamedFile = renameFile(compressed);
                const storageRef = ref(storage, `${user.uid}/capas/${renamedFile.name}`);
                await uploadBytes(storageRef, renamedFile);
                newImage = await getDownloadURL(storageRef);
            }

            const newIssue = new Issue(
                title.trim(), +edition, +pagesQty, collection, newImage,
                month, +year, price === '' ? null : +price,
                writer || null, artist || null, additionalStories || null, id
            );
            props.issueChanged?.(newIssue);
        } catch (err: any) {
            console.error(err)
            setSubmitError("Não foi possível salvar a edição. Tente novamente.")
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <div className="flex flex-col w-full max-w-3xl mx-auto my-8 text-black dark:text-white">

            <h2 className="text-xl font-bold mb-6">
                {id ? "Alterar edição" : "Cadastrar nova edição"}
            </h2>

            {submitError && (
                <div className="flex items-center bg-red-500 text-white py-3 px-4 mb-4 rounded-lg text-sm">
                    {IconWarning(5)}
                    <span className="ml-2">{submitError}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {id && (
                    <Input readOnly text="Código" value={id} className="md:col-span-2" />
                )}

                <Input text="Título *" placeholder="Ex: Tex no velho oeste" value={title}
                    onChange={setTitle} error={errors.title} className="md:col-span-2" />

                <Input text="Edição *" placeholder="Ex: 153" type="number" value={edition}
                    onChange={setEdition} error={errors.edition} />

                <Input text="Páginas *" placeholder="Ex: 198" type="number" value={pagesQty}
                    onChange={setPagesQty} error={errors.pagesQty} />

                <Select
                    text="Coleção *"
                    value={collection}
                    onChange={setCollection}
                    placeholder="Escolha uma coleção"
                    options={collections.map(c => ({ label: c.name, value: c.name }))}
                    error={errors.collection}
                />

                <Select
                    text="Mês de lançamento *"
                    value={month}
                    onChange={setMonth}
                    placeholder="Escolha um mês"
                    options={MONTHS.map(m => ({ label: m, value: m }))}
                    error={errors.month}
                />

                <Input text="Ano de lançamento *" placeholder="Ex: 2021" type="number" value={year}
                    onChange={setYear} error={errors.year} />

                <Input text="Preço" placeholder="Ex: 29.90" type="number" value={price}
                    onChange={setPrice} />

                <Input text="Roteiro por:" value={writer} onChange={setWriter} />
                <Input text="Desenhos por:" value={artist} onChange={setArtist} />

                <Input text="Histórias adicionais:" value={additionalStories}
                    onChange={setAdditionalStories} className="md:col-span-2" />

                <div className="md:col-span-2 flex flex-col">
                    <label className="mb-2 text-sm font-medium">Capa {id ? "" : "*"}</label>
                    <div className="flex items-center gap-4">
                        {currentCover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={currentCover} alt="Prévia da capa"
                                className="h-28 w-20 object-cover rounded-md border border-gray-300 dark:border-gray-700" />
                        ) : (
                            <div className="h-28 w-20 rounded-md border border-dashed border-gray-400 flex items-center justify-center text-xs text-gray-400">
                                Sem capa
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleFileChange}
                            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-yellow-500 file:px-3 file:py-2 file:text-white file:cursor-pointer" />
                    </div>
                    {errors.cover && <span className="mt-1 text-xs text-red-500">{errors.cover}</span>}
                    {id && <span className="mt-1 text-xs text-gray-500">Deixe em branco para manter a capa atual.</span>}
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-8">
                <Button onClick={props.canceled} color="gray">Cancelar</Button>
                <Button color="yellow" loading={submitting} onClick={handleSubmitIssue}>
                    {id ? "Alterar" : "Salvar"}
                </Button>
            </div>
        </div>
    )
}
