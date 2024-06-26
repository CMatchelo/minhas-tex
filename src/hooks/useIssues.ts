import { useEffect, useState } from "react"
import IssueCollection from "../backend/db/issueCollection"
import IssueRepository from "../core/IssueRepository"
import Issue from "../core/Issue"
import useVisualization from "./useVisualization"
import useAuth from "../data/hook/useAuth"
import { storage } from "../firebase/config"
import useCollections from "./useCollections"
import Collection from "../core/collection"

export default function useIssues() {
    const { user } = useAuth()
    const { collections, saveCollection } = useCollections();

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
        const id = issue.id
        setIssues((prevIssues) => {
            const index = prevIssues.findIndex(issue => issue.id === id);
            if (index !== -1) {
                const newIssues = [...prevIssues];
                newIssues.splice(index, 1);
                return newIssues;
            }
            return prevIssues;
        });
        const tempCol = collections.find(col => col.name === issue.collection)
        var newQtyEditions = tempCol.qtyEditions - 1
        var newQtyPages = tempCol.qtyPages - issue.pagesQty
        var newPrice = Number(tempCol.totalPrice) - Number(issue.price)
        const newCol = new Collection(tempCol.id, tempCol.name, tempCol.cover, newQtyEditions, newQtyPages, newPrice)
        saveCollection(newCol)
        await repo.delete(issue)
        try {
            const fileRef = storage.refFromURL(issue.coverURL);
            await fileRef.delete();
        } catch (error) {
            console.error("Erro ao deletar o arquivo:", error);
        }
        //getAll()
    }

    async function saveIssue(issue: Issue) {
        const tempCol = collections.find(col => col.name === issue.collection)
        var newQtyEditions = tempCol.qtyEditions + 1
        var newQtyPages = tempCol.qtyPages + issue.pagesQty
        var newPrice = Number(tempCol.totalPrice) + Number(issue.price)
        const newCol = new Collection(tempCol.id, tempCol.name, tempCol.cover, newQtyEditions, newQtyPages, newPrice)
        saveCollection(newCol)
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