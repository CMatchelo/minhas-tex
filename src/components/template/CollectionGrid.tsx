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
                    ${i % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
                    flex-grow w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5
                    md:max-w-1/3 lg:max-w-1/4 xl:max-w-1/5
                    m-2 mb-4 relative h-32
                `}>
                    <div className="absolute inset-0">
                        <img src={collection.cover || collectionImg.src} className={`
                            w-full h-full ${collection.cover ? 'object-cover object-top brightness-50' : 'object-contain'}
                        `} />
                    </div>
                    <div className="z-100 opacity-100 hover:opacity-0">
                        <span className="text-center p-3 text-black ">{collection.name}</span>
                    </div>
                    <div className="flex items-end justify-center relative w-full h-full z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <span className="text-left p-3 text-black dark:text-white">{collection.qtyEditions}</span>
                        <span className="text-left p-3 text-black dark:text-white">{collection.qtyPages}</span>
                        <span className="text-left p-3 text-black dark:text-white"><CurrencyFormatter value={collection.totalPrice} /></span>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={`
            flex flex-wrap justify-center
        `}>
            {renderData()}
        </div>
    )
}

/*
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
