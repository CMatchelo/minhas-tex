import Collection from "../../core/collection"
import CurrencyFormatter from "../../functions/formatCurrency"
import collectionImg from "../../../public/collectionGeneric.png"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router';


interface CollectionGridProps {
    collections: Collection[]
    selectedCollection?: (collection: Collection) => void
    deleteCollection?: (collection: Collection) => void
}

export default function CollectionGrid(props: CollectionGridProps) {

    const router = useRouter();
    const totalPrice = props.collections.reduce((acc, collection) => acc + collection.totalPrice, 0);
    const totalIssues = props.collections.reduce((acc, collection) => acc + collection.qtyEditions, 0);
    const totalPages = props.collections.reduce((acc, collection) => acc + collection.qtyPages, 0);

    const goToCol = (col) => {
        window.localStorage.setItem('colToOpen', col);
        router.push('/');
    }

    function renderData() {
        return props.collections?.map((collection, i) => {
            return (
                <div key={collection.id} className={`
                    w-full border-b border-gray-700 dark:border-gray-200
                `}>
                    <div className="flex flex-col md:flex-row w-full justify-evenly">
                        <div className="flex md:justify-center p-3 flex-1">
                            <span className="flex md:hidden text-gray-800 dark:text-gray-200">Coleção: </span>
                            <span className="text-gray-800 dark:text-gray-200"> {collection.name}</span>
                        </div>
                        <div className="flex md:justify-center p-3 flex-1">
                            <span className="flex md:hidden text-gray-800 dark:text-gray-200">Edições: </span>
                            <span className="text-gray-800 dark:text-gray-200"> {collection.qtyEditions}</span>
                        </div>
                        <div className="flex md:justify-center p-3 flex-1">
                            <span className="flex md:hidden text-gray-800 dark:text-gray-200">Páginas: </span>
                            <span className="text-gray-800 dark:text-gray-200"> {collection.qtyPages}</span>
                        </div>
                        <div className="flex md:justify-center p-3 flex-1">
                            <span className="flex md:hidden text-gray-800 dark:text-gray-200">Valor: </span>
                            <span className="text-gray-800 dark:text-gray-200"><CurrencyFormatter value={collection.totalPrice} /></span>
                        </div>
                        <div className="flex md:justify-center p-3 flex-1">
                            <span className="text-gray-800 dark:text-gray-200" onClick={() => goToCol(collection.name)}>Ver coleção</span>
                        </div>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={`
            w-full flex flex-col
        `}>
            <div className={`
                    w-full border-b border-gray-700 dark:border-gray-200 ustify-evenly
                `}>
                <div className="hidden flex-col md:flex-row md:flex">
                    <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200 ">Nome da coleção</span>
                    <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">Edições</span>
                    <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">Paginas</span>
                    <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">Valor da coleção</span>
                    <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">Ações</span>
                </div>
            </div>
            {renderData()}
            <div className={`
                    w-full border-b border-gray-700 dark:border-gray-200
                `}>
                <div className="flex flex-col md:flex-row w-full justify-evenly">
                    <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">Total</span>
                    <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">Edições: {totalIssues}</span>
                    <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">Paginas: {totalPages}</span>
                    <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">Valor total: <CurrencyFormatter value={totalPrice} /></span>
                    <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">------</span>
                </div>
            </div>
        </div>
    )
}