import Collection from "../../core/collection"
import CurrencyFormatter from "../../functions/formatCurrency"
import collectionImg from "../../../public/collectionGeneric.png"
import { useEffect, useState } from "react"

interface CollectionGridProps {
    collections: Collection[]
    selectedCollection?: (collection: Collection) => void
    deleteCollection?: (collection: Collection) => void
}

export default function CollectionGrid(props: CollectionGridProps) {

    function renderData() {
        return props.collections?.map((collection, i) => {
            return (
                <div key={collection.id} className={`
                    flex flex-grow border-b border-gray-700 dark:border-gray-200
                `}>
                    <div className="flex">
                        <span className="text-center w-40 p-3 text-gray-800 dark:text-gray-200">{collection.name}</span>
                        <span className="text-center w-40 p-3 text-gray-800 dark:text-gray-200">#{collection.qtyEditions}</span>
                        <span className="text-center w-40 p-3 text-gray-800 dark:text-gray-200">#{collection.qtyPages}</span>
                        <span className="text-center w-40 p-3 text-gray-800 dark:text-gray-200"><CurrencyFormatter value={collection.totalPrice} /></span>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={`
            flex flex-wrap flex-col w-1/2 justify-center mx-4 align-middle
        `}>
            <div className={`
                    flex flex-grow border-b border-gray-700 dark:border-gray-200
                `}>
                <div className="flex">
                    <span className="text-center w-40 p-3 text-gray-800 dark:text-gray-200 ">Nome da coleção</span>
                    <span className="text-center w-40 p-3 text-gray-800 dark:text-gray-200">Edições</span>
                    <span className="text-center w-40 p-3 text-gray-800 dark:text-gray-200">Paginas</span>
                    <span className="text-center w-40 p-3 text-gray-800 dark:text-gray-200">Valor da coleção</span>
                </div>
            </div>
            {renderData()}
        </div>
    )
}

/*

{/* <div className="flex items-end justify-center relative w-full h-full z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"> 
{ <table className={`w-full rounded-xl overflow-hidden`}>
            <thead className={`
                bg-gradient-to-r from-gray-500 bg-gray-600 to-gray-500 text-gray-100
                `}>
                <tr>
                    <th className="px-3 py-4 text-left text-black">Titulo</th>
                    <th className="px-3 py-4 text-left text-black">Revistas</th>
                    <th className="px-3 py-4 text-left text-black">Páginas</th>
                    <th className="px-3 py-4 text-left text-black">Valor total</th>
                    <th className="px-3 py-4 text-left text-black">Ações</th>
                </tr>
            </thead>
            <tbody>
                {renderData()}
            </tbody>
        </table> } */
