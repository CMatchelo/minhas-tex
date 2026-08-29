import IssueCollection from "../backend/db/issueCollection"
import IssueRepository from "../core/IssueRepository"
import Issue from "../core/Issue"
import { useState } from "react"
import useVisualization from "./useVisualization"
import useAuth from "../data/hook/useAuth"
import { useData } from "../data/context/DataContext"
import { storage } from "../firebase/config"
import { ref, deleteObject } from "firebase/storage"

export default function useIssues() {
    const { user } = useAuth()
    const { issues, loadingIssues, addOrUpdateIssue, removeIssue, refresh } = useData()

    const [issue, setIssue] = useState<Issue>(Issue.empty())
    const { formVisible, tableVisible, showForm, showTable } = useVisualization()
    const repo: IssueRepository = new IssueCollection(user?.uid)

    function getAll() {
        return refresh(true)
    }

    function selectIssue(issue: Issue) {
        setIssue(issue)
        showForm()
    }

    async function deleteIssue(issue: Issue) {
        await repo.delete(issue)
        removeIssue(issue)

        if (issue.coverURL) {
            try {
                const fileRef = ref(storage, issue.coverURL)
                await deleteObject(fileRef)
            } catch (error: any) {
                // Ignora quando o arquivo já não existe no Storage
                if (error?.code !== "storage/object-not-found") {
                    console.error("Erro ao deletar o arquivo:", error)
                }
            }
        }
    }

    async function saveIssue(issue: Issue): Promise<Issue> {
        const saved = await repo.save(issue)
        addOrUpdateIssue(saved)
        showTable()
        return saved
    }

    function newIssue() {
        setIssue(Issue.empty())
        showForm()
    }

    return {
        loading: loadingIssues,
        tableVisible,
        formVisible,
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
