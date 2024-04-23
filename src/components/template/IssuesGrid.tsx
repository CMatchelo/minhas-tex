import Issue from "../../core/Issue"

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

    function renderData() {
        return props.issues?.map((issue, i) => {
            return (
                <tr key={issue.id}>
                    <td>{issue.title}</td>
                    <td>{issue.edition}</td>
                    <td>{issue.pagesQty}</td>
                    {displayActions ? renderActions(issue) : false}
                </tr>
            )
        })
    }

    function renderActions(issue: Issue) {
        return (
            <td>
                {props.selectIssue ? (
                    <button onClick={() => props.selectIssue?.(issue)}>Edit</button>
                ) : false }
                {props.deleteIssue ? (
                    <button onClick={() => props.deleteIssue?.(issue)}>Remove</button>
                ) : false }
            </td>
        )
    }

    return (
        <table>
            <thead>
                {renderHeader()}
            </thead>
            <tbody>
                {renderData()}
            </tbody>
        </table>
    )
}