import { useEffect, useState } from "react"
import IssueCollection from "../backend/db/issueCollection"
import IssueRepository from "../core/IssueRepository"
import Issue from "../core/Issue"
import useVisualization from "./useVisualization"
import useAuth from "../data/hook/useAuth"
import { storage } from "../firebase/config"

export default function useIssues() {
    const { user } = useAuth()

    const [issue, setIssue] = useState<Issue>(Issue.empty())
    const [issues, setIssues] = useState<Issue[]>([])
    const { formVisible, tableVisible, showForm, showTable } = useVisualization()
    const repo: IssueRepository = new IssueCollection(user?.uid)

    useEffect(() => {
        getAll()
    }, [user]);

    function getAll() {
        console.log("Getting all")
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
        /*const id = issue.id
        setIssues((prevIssues) => {
            const index = prevIssues.findIndex(issue => issue.id === id);
            if (index !== -1) {
                const newIssues = [...prevIssues];
                newIssues.splice(index, 1);
                return newIssues;
            }
            return prevIssues;
        });
        await repo.delete(issue)*/
        try {
            const filePath = decodeURIComponent(new URL(issue.coverURL).pathname);
            console.log("1", issue.coverURL)
            const fileRef = storage.ref(issue.coverURL);
            console.log("2", fileRef)
            await fileRef.delete();
          } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
          }
        //getAll()
    }

    async function saveIssue(issue: Issue) {
        await repo.save(issue)
        showTable()
        //getAll()
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
        setIssues,
        newIssue,
        saveIssue,
        deleteIssue,
        selectIssue,
        getAll,
    }
}