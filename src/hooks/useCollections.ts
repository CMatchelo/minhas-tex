import { useEffect, useState } from "react";
import Collection from "../core/collection";
import CollectionRepository from "../core/collectionRepository";
import CollectionCol from "../backend/db/collectionCol";
import useVisualization from "./useVisualization";

export default function useCollections() {

    const repo: CollectionRepository = new CollectionCol()

    const [ collection, setCollection ] = useState<Collection>(Collection.empty())
    const [ collections, setCollections] = useState<Collection[]>([])
    const {formVisible, tableVisible, showForm, showTable} = useVisualization()

    useEffect(() => {
        getAll()
    }, [])

    function getAll() {
        repo.getAll().then(collections => {
            setCollections(collections)
            showTable()            
        })
    }

    function selectCollection(collection: Collection) {
        setCollection(collection)
        showForm()
    }

    async function deleteCollection(collection: Collection) {
        await repo.delete(collection)
        getAll()
    }

    async function saveCollection(collection: Collection) {
        await repo.save(collection)
        getAll()
    }

    function newCollection() {
        setCollection(Collection.empty())
        showForm()
    }

    return {
        tableVisible,
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