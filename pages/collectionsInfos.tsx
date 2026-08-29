import Layout from "../src/components/template/Layout";
import React, { useState } from "react";
import useAppData from "../src/data/hook/useAppData";
import Collection from "../src/core/collection";
import CollectionGrid from "../src/components/template/CollectionGrid";
import useCollections from "../src/hooks/useCollections";
import Button from "../src/components/template/Button";
import RegisterCollecttionForm from "../src/components/template/RegisterCollectionForm";



export default function CollectionsInfos() {

  const { tableVisible, showTable, collection, collections, newCollection, saveCollection, deleteCollection, selectCollection } = useCollections()

  return (
    <Layout title="Minhas coleções" subtitle="Gerencie suas coleções aqui">
      {tableVisible ? (
        <div className="w-full">
          <div className="rounded-lg bg-gray-200 dark:bg-gray-900 p-4">
            <CollectionGrid
              collections={collections}
              selectedCollection={selectCollection}
              deleteCollection={deleteCollection}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button color="yellow" onClick={newCollection}>Nova coleção</Button>
          </div>
        </div>
      ) : (
        <RegisterCollecttionForm
          collection={collection}
          collectionChanged={saveCollection}
          cancelled={showTable}
        />
      )}
    </Layout>
  );
}