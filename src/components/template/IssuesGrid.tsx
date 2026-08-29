import Image from "next/image"
import Issue from "../../core/Issue"
import CurrencyFormatter from "../../functions/formatCurrency"
import { IconDelete, IconEdit } from "../icons"

const FALLBACK_COVER = "/collectionGeneric.png"

interface IssueGridProps {
    issues: Issue[]
    selectIssue?: (issue: Issue) => void
    onRequestDelete?: (issue: Issue) => void
}

export default function IssuesGrid(props: IssueGridProps) {

    const displayActions = props.onRequestDelete || props.selectIssue

    function renderActions(issue: Issue) {
        return (
            <div className="mt-2 pt-2 flex justify-center gap-2 border-t border-gray-200 dark:border-gray-700">
                {props.selectIssue && (
                    <button
                        aria-label={`Editar ${issue.title}`}
                        className="rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-yellow-500 hover:text-white transition-colors"
                        onClick={() => props.selectIssue?.(issue)}
                    >
                        {IconEdit}
                    </button>
                )}
                {props.onRequestDelete && (
                    <button
                        aria-label={`Excluir ${issue.title}`}
                        className="rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-red-700 hover:text-white transition-colors"
                        onClick={() => props.onRequestDelete?.(issue)}
                    >
                        {IconDelete}
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,19rem),1fr))] gap-4 mb-4 w-full">
            {props.issues?.map((issue) => (
                <div
                    key={issue.id}
                    className="flex flex-col rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-shadow p-3 text-gray-700 dark:text-gray-300"
                >
                    <div className="flex flex-row justify-between text-sm mb-2">
                        <span className="font-semibold">#{issue.edition}</span>
                        <span>{issue.month} / {issue.year}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative mx-auto sm:mx-0 w-28 h-40 shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <Image
                                src={issue.coverURL || FALLBACK_COVER}
                                alt={issue.title}
                                fill
                                className="object-contain"
                                loading="lazy"
                                sizes="112px"
                            />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                            <div className="text-lg font-bold text-center sm:text-left pb-1 mb-1 border-b border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 break-words">
                                {issue.title}
                            </div>
                            <div className="text-sm space-y-0.5 break-words">
                                <p>Escrito por: {issue.writer || "Não informado"}</p>
                                <p>Arte por: {issue.artist || "Não informado"}</p>
                                <p>
                                    Preço:{" "}
                                    {issue.price
                                        ? <CurrencyFormatter value={Number(issue.price)} />
                                        : "Não informado"}
                                </p>
                                <p>Páginas: {issue.pagesQty}</p>
                                <p>Coleção: {issue.collection || "Não informado"}</p>
                                {issue.additionalStories && (
                                    <p>Histórias adicionais: {issue.additionalStories}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {displayActions && renderActions(issue)}
                </div>
            ))}
        </div>
    )
}
