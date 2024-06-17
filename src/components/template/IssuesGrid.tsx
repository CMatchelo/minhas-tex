import Issue from "../../core/Issue"
import CurrencyFormatter from "../../functions/formatCurrency"
import { IconDelete, IconEdit } from "../icons"

interface IssueGridProps {
    issues: Issue[]
    selectIssue?: (issue: Issue) => void
    deleteIssue?: (issue: Issue) => void
}

export default function IssuesGrid(props: IssueGridProps) {

    const displayActions = props.deleteIssue || props.selectIssue

    function renderHeader() {
        return (
            <tr>
                <th>Title</th>
                <th>Edition</th>
                <th>Pages</th>
                {displayActions ? <th>Ações</th> : false}
            </tr>
        )
    }

    /* <div key={issue.id}>
                    <td>{issue.title}</td>
                    <td>{issue.edition}</td>
                    <td>{issue.pagesQty}</td>
                    {displayActions ? renderActions(issue) : false}
                </div> 
                */

    function renderData() {
        return props.issues?.map((issue, i) => {
            return (
                <div key={issue.id} className="flex flex-col flex-grow w-full md:w-1/2 lg:w-1/3 xl:w-1/4 border border-gray-700 p-2 m-2 text-gray-700 dark:text-gray-300">
                    <div className="flex flex-row justify-between mb-2">
                        <span>#{issue.edition}</span>
                        <span>{issue.month} / {issue.year}</span>
                    </div>
                    <div className="flex flex-row h-48">
                        <div className='w-1/3 mr-2 h-full'>
                            <img src={issue.coverURL} className="h-full w-full object-contain"/>
                        </div>
                        <div className='w-2/3 h-full flex flex-col'>
                            <div className='text-xl font-bold flex justify-center mb-1 border-b border-gray-700'>
                                {issue.title}
                            </div>
                            <div className="flex grow flex-col justify-center">
                                <span>Escrito por: {issue.writer} </span>
                                <span>Arte por: {issue.artist} </span>
                                <span>Preço: <CurrencyFormatter value={issue.price} /></span>
                                <span>Páginas: {issue.pagesQty} </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        {displayActions ? renderActions(issue) : false}
                    </div>
                </div>
            )
        })
    }

    function renderActions(issue: Issue) {
        return (
            <td className="mt-4">
                {props.selectIssue ? (
                    <button className="mr-2" onClick={() => props.selectIssue?.(issue)}>{IconEdit}</button>
                ) : false}
                {props.deleteIssue ? (
                    <button className="ml-2" onClick={() => props.deleteIssue?.(issue)}>{IconDelete}</button>
                ) : false}
            </td>
        )
    }

    return (
        <div className="flex flex-wrap justify-center m-2 mb-4 p-1">
            {renderData()}
        </div>
    )
}