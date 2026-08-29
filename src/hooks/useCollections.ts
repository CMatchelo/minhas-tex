import { useState } from "react";
import Collection from "../core/collection";
import CollectionRepository from "../core/collectionRepository";
import CollectionCol from "../backend/db/collectionCol";
import useVisualization from "./useVisualization";
import useAuth from "../data/hook/useAuth"
import { useData } from "../data/context/DataContext"

export default function useCollections() {

    const { user } = useAuth()
    const { collections, loadingCollections, addOrUpdateCollection, removeCollection, refresh } = useData()
    const repo: CollectionRepository = new CollectionCol(user?.uid)

    const [collection, setCollection] = useState<Collection>(Collection.empty())
    const { formVisible, tableVisible, showForm, showTable } = useVisualization()

    function getAll() {
        return refresh(true)
    }

    function selectCollection(collection: Collection) {
        setCollection(collection)
        showForm()
    }

    async function deleteCollection(collection: Collection) {
        await repo.delete(collection)
        removeCollection(collection)
    }

    async function saveCollection(collection: Collection) {
        const saved = await repo.save(collection)
        addOrUpdateCollection(saved)
        showTable()
    }

    function newCollection() {
        setCollection(Collection.empty())
        showForm()
    }

    return {
        loading: loadingCollections,
        tableVisible,
        formVisible,
        showTable,
        collection,
        collections,
        newCollection,
        saveCollection,
        deleteCollection,
        selectCollection,
        getAll,
    }
}
