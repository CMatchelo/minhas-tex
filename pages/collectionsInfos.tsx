import Layout from "../src/components/template/Layout";
import React, { useState } from "react";
import useAppData from "../src/data/hook/useAppData";
import Collection from "../src/core/collection";
import CollectionGrid from "../src/components/template/CollectionGrid";
import useCollections from "../src/hooks/useCollections";
import Button from "../src/components/template/Button";
import RegisterCollecttionForm from "../src/components/template/RegisterCollectionForm";



export default function collectionsInfos() {

  const { tableVisible, showTable, collection, collections, newCollection, saveCollection, deleteCollection, selectCollection } = useCollections()

  return (
    <Layout title="Minhas coleções" subtitle="Gerencia suas coleções aqui">
      {tableVisible ? (
        <>
          <Button className="mb-4" color="yellow" onClick={newCollection}> Nova coleção </Button>
          <div className="flex justify-start">
            <CollectionGrid
              collections={collections}
              selectedCollection={selectCollection}
              deleteCollection={deleteCollection}
            />
          </div>
        </>
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