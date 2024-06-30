import Layout from "../src/components/template/Layout";
import React, { useEffect, useState } from "react";
import useIssues from "../src/hooks/useIssues";
import useCollections from "../src/hooks/useCollections";
import Issue from "../src/core/Issue";
import Collection from "../src/core/collection";

export default function Settings() {

  const { issues } = useIssues();
  const { collections } = useCollections()

  const [biggestIssue, setBiggestIssue] = useState<Issue>(Issue.empty())
  const [smallestIssue, setSmallestIssue] = useState<Issue>(Issue.empty())
  const [expenseIssue, setExpenseIssue] = useState<Issue>(Issue.empty())
  const [cheapestIssue, setCheapestIssue] = useState<Issue>(Issue.empty())

  const [biggestCollection, setBiggestCollection] = useState<Collection>(Collection.empty())
  const [smallestCollection, setSmallestCollection] = useState<Collection>(Collection.empty())
  const [expenseCollection, setExpenseCollection] = useState<Collection>(Collection.empty())
  const [cheapestCollection, setCheapestCollection] = useState<Collection>(Collection.empty())
  const [mostEdCollection, setMostEdCollection] = useState<Collection>(Collection.empty())
  const [minEdCollection, setMinEdCollection] = useState<Collection>(Collection.empty())

  console.log("sorted", issues, collections)

  useEffect(() => {
    if (issues && issues.length > 0) {
      const biggestIssue = issues.reduce((max, issue) => issue.pagesQty > max.pagesQty ? issue : max, issues[0]);
      setBiggestIssue(biggestIssue);

      const smallestIssue = issues.reduce((min, issue) => issue.pagesQty < min.pagesQty ? issue : min, issues[0]);
      setSmallestIssue(smallestIssue);

      const expenseIssue = issues.reduce((max, issue) => issue.price > max.price ? issue : max, issues[0]);
      setExpenseIssue(expenseIssue);

      const cheapestIssue = issues.reduce((min, issue) => issue.price < min.price ? issue : min, issues[0]);
      setCheapestIssue(cheapestIssue);
      console.log(biggestIssue, smallestIssue, expenseIssue, cheapestIssue)
    }
  }, [issues]);

  useEffect(() => {
    if (collections && collections.length > 0) {
      const biggestCollection = collections.reduce((max, collection) => collection.qtyPages > max.qtyPages ? collection : max, collections[0]);
      setBiggestCollection(biggestCollection);

      const smallestCollection = collections.reduce((min, collection) => collection.qtyPages < min.qtyPages ? collection : min, collections[0]);
      setSmallestCollection(smallestCollection);

      const expenseCollection = collections.reduce((max, collection) => collection.totalPrice > max.totalPrice ? collection : max, collections[0]);
      setExpenseCollection(expenseCollection);

      const cheapestCollection = collections.reduce((min, collection) => collection.totalPrice < min.totalPrice ? collection : min, collections[0]);
      setCheapestCollection(cheapestCollection);

      const mostEdCollection = collections.reduce((max, collection) => collection.qtyEditions > max.qtyEditions ? collection : max, collections[0]);
      setMostEdCollection(mostEdCollection);

      const minEdCollection = collections.reduce((min, collection) => collection.qtyEditions < min.qtyEditions ? collection : min, collections[0]);
      setMinEdCollection(minEdCollection);
    }
  }, [collections]);

  function RenderIssue({ header, info, textInfo, edition, title, collection }) {
    return (
      <div className="p-3 bg-gray-200 bg-opacity-5 mb-5 shadow-lg">
        <h2 className="text-lg">{header}</h2>
        <h3>{info} {textInfo}</h3>
        <h3>#{edition} - {title} - {collection}</h3>
      </div>
    )
  }

  function RenderCollection({ header, info, textInfo, title }) {
    return (
      <div className="p-3 bg-gray-200 bg-opacity-5 mb-5 shadow-lg">
        <h2 className="text-lg">{header}</h2>
        <h3>{info} {textInfo}</h3>
        <h3>{title}</h3>
      </div>
    )
  }

  return (
    <Layout title="Informações" subtitle="Dados sobre suas coleções e revistas">
      <div className="flex flex-col w-full p-4 ">
        <RenderIssue header='Revista com mais páginass' info={biggestIssue.pagesQty} textInfo='páginas' edition={biggestIssue.edition} title={biggestIssue.title} collection={biggestIssue.collection} />
        <RenderIssue header='Revista com menos páginas' info={smallestIssue.pagesQty} textInfo='páginas' edition={smallestIssue.edition} title={smallestIssue.title} collection={smallestIssue.collection} />
        <RenderIssue header='Revista mais cara' info={expenseIssue.price} textInfo='reais' edition={expenseIssue.edition} title={expenseIssue.title} collection={expenseIssue.collection} />
        <RenderIssue header='Revista mais barata' info={cheapestIssue.price} textInfo='reais' edition={cheapestIssue.edition} title={cheapestIssue.title} collection={cheapestIssue.collection} />

        <RenderCollection header='Coleção com mais páginas' info={biggestCollection.qtyPages} textInfo='páginas' title={biggestCollection.name}  />
        <RenderCollection header='Coleção com menos páginas' info={smallestCollection.qtyPages} textInfo='páginas' title={smallestCollection.name}  />
        <RenderCollection header='Coleção mais cara' info={expenseCollection.totalPrice} textInfo='reais' title={expenseCollection.name}  />
        <RenderCollection header='Coleção mais barata' info={cheapestCollection.totalPrice} textInfo='reais' title={cheapestCollection.name}  />
        <RenderCollection header='Coleção com mais edições' info={mostEdCollection.qtyEditions} textInfo='edições' title={mostEdCollection.name}  />
        <RenderCollection header='Coleção com menos edições' info={minEdCollection.qtyEditions} textInfo='edições' title={minEdCollection.name}  />
      </div>
    </Layout>
  );
}