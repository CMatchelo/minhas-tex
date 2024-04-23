import { useEffect, useState } from "react"
import IssueCollection from "../backend/db/issueCollection"
import IssueRepository from "../core/IssueRepository"
import Issue from "../core/Issue"
import useVisualization from "./useVisualization"

export default function useIssues() {
    const repo: IssueRepository = new IssueCollection()

    const [issue, setIssue] = useState<Issue>(Issue.empty())
    const [issues, setIssues] = useState<Issue[]>([])
    const {formVisible, tableVisible, showForm, showTable} = useVisualization()

    useEffect(() => {
        getAll()
    }, [])

    function getAll() {
        repo.getAll().then(issues => {
            setIssues(issues)
            showTable()
        })
    }

    function selectIssue(issue: Issue) {
        setIssue(issue)
        showForm()
    }

    async function deleteIssue(issue: Issue) {
        await repo.delete(issue)
        getAll()
    }

    async function saveIssue(issue: Issue) {
        await repo.save(issue)
        getAll()
    }

    function newIssue() {
        setIssue(Issue.empty())
        showForm()
    }

    return {
        tableVisible,
        showTable,
        issue,
        issues,
        newIssue,
        saveIssue,
        deleteIssue,
        selectIssue,
        getAll,
    }
}