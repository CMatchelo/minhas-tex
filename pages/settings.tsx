import Layout from "../src/components/template/Layout";
import React, { useEffect, useState } from "react";
import useIssues from "../src/hooks/useIssues";
import useCollections from "../src/hooks/useCollections";
import Issue from "../src/core/Issue";
import Collection from "../src/core/collection";

export default function Settings() {
  const { issues } = useIssues();
  const { collections } = useCollections();

  const [biggestIssue, setBiggestIssue] = useState<Issue>(Issue.empty());
  const [smallestIssue, setSmallestIssue] = useState<Issue>(Issue.empty());
  const [expenseIssue, setExpenseIssue] = useState<Issue>(Issue.empty());
  const [cheapestIssue, setCheapestIssue] = useState<Issue>(Issue.empty());

  const [biggestCollection, setBiggestCollection] = useState<Collection>(
    Collection.empty()
  );
  const [smallestCollection, setSmallestCollection] = useState<Collection>(
    Collection.empty()
  );
  const [expenseCollection, setExpenseCollection] = useState<Collection>(
    Collection.empty()
  );
  const [cheapestCollection, setCheapestCollection] = useState<Collection>(
    Collection.empty()
  );
  const [mostEdCollection, setMostEdCollection] = useState<Collection>(
    Collection.empty()
  );
  const [minEdCollection, setMinEdCollection] = useState<Collection>(
    Collection.empty()
  );

  useEffect(() => {
    if (!issues || issues.length === 0) return;

    const stats = issues.reduce(
      (acc, issue) => {
        // Maior pagesQty
        if (issue.pagesQty > acc.biggest.pagesQty) acc.biggest = issue;

        // Menor pagesQty
        if (issue.pagesQty < acc.smallest.pagesQty) acc.smallest = issue;

        // Maior price
        if (issue.price > acc.expensive.price) acc.expensive = issue;

        // Menor price
        if (issue.price < acc.cheapest.price) acc.cheapest = issue;

        return acc;
      },
      {
        biggest: issues[0],
        smallest: issues[0],
        expensive: issues[0],
        cheapest: issues[0],
      }
    );

    setBiggestIssue(stats.biggest);
    setSmallestIssue(stats.smallest);
    setExpenseIssue(stats.expensive);
    setCheapestIssue(stats.cheapest);
  }, [issues]);

  useEffect(() => {
    if (
      !issues ||
      issues.length === 0 ||
      !collections ||
      collections.length === 0
    )
      return;

    // 1. Agrupar dados das issues por coleção
    const stats = issues.reduce((acc, issue) => {
      const col = issue.collection;

      if (!acc[col]) {
        acc[col] = {
          count: 0,
          totalPrice: 0,
          qtyPages: 0,
          qtyEditions: 0,
        };
      }

      acc[col].count++;
      acc[col].totalPrice += Number(issue.price);
      acc[col].qtyPages += Number(issue.pagesQty);
      acc[col].qtyEditions += 1;
      console.log(
        col,
        acc[col].count,
        acc[col].totalPrice,
        acc[col].qtyPages,
        acc[col].qtyEditions
      );
      return acc;
    }, {});

    const pickCollection = (compareFn) => {
      const result = collections.reduce((best, col) => {
        if (!stats[col.name] || stats[col.name].count === 0) {
          return best;
        }
        const a = {
          name: col.name,
          count: stats[col.name]?.count ?? 0,
          totalPrice: stats[col.name]?.totalPrice ?? 0,
          qtyPages: stats[col.name]?.qtyPages ?? 0,
          qtyEditions: stats[col.name]?.qtyEditions ?? 0,
        };

        const b = {
          name: best.name,
          count: stats[best.name]?.count ?? 0,
          totalPrice: stats[best.name]?.totalPrice ?? 0,
          qtyPages: stats[best.name]?.qtyPages ?? 0,
          qtyEditions: stats[best.name]?.qtyEditions ?? 0,
        };

        return compareFn(a, b) ? col : best;
      }, collections[0]);

      console.log(stats[result.name]);
      return {
        name: result.name,
        ...stats[result.name],
      };
    };

    // --- 2. Aplicando as regras ---

    // Maior quantidade de issues
    setBiggestCollection(pickCollection((a, b) => a.qtyPages > b.qtyPages));

    // Menor quantidade de issues
    setSmallestCollection(pickCollection((a, b) => a.qtyPages < b.qtyPages));

    // Maior gasto total
    setExpenseCollection(pickCollection((a, b) => a.totalPrice > b.totalPrice));

    // Menor gasto total
    setCheapestCollection(
      pickCollection((a, b) => a.totalPrice < b.totalPrice)
    );

    // Maior número de edições diferentes
    setMostEdCollection(pickCollection((a, b) => a.qtyEditions > b.qtyEditions));

    // Menor número de edições diferentes
    setMinEdCollection(pickCollection((a, b) => a.qtyEditions < b.qtyEditions));
  }, [issues, collections]);

  useEffect(() => {
    console.log(biggestCollection, smallestCollection, expenseCollection, cheapestCollection, mostEdCollection, minEdCollection)
  }, [biggestCollection, smallestCollection, expenseCollection, cheapestCollection, mostEdCollection, minEdCollection])

  function RenderIssue({ header, info, textInfo, edition, title, collection }) {
    return (
      <div className="p-3 bg-gray-200 bg-opacity-5 shadow-lg">
        <h2 className="text-lg">{header}</h2>
        <h3>
          {info} {textInfo}
        </h3>
        <h3>
          #{edition} - {title} - {collection}
        </h3>
      </div>
    );
  }

  function RenderCollection({ header, info, textInfo, title }) {
    return (
      <div className="p-3 bg-gray-200 bg-opacity-5 shadow-lg">
        <h2 className="text-lg">{header}</h2>
        <h3>
          {info} {textInfo}
        </h3>
        <h3>{title}</h3>
      </div>
    );
  }

  return (
    <Layout title="Informações" subtitle="Dados sobre suas coleções e revistas">
      <div className="grid grid-cols-2 gap-4 w-full p-4 ">
        <RenderIssue
          header="Revista com mais páginass"
          info={biggestIssue.pagesQty}
          textInfo="páginas"
          edition={biggestIssue.edition}
          title={biggestIssue.title}
          collection={biggestIssue.collection}
        />
        <RenderIssue
          header="Revista com menos páginas"
          info={smallestIssue.pagesQty}
          textInfo="páginas"
          edition={smallestIssue.edition}
          title={smallestIssue.title}
          collection={smallestIssue.collection}
        />
        <RenderIssue
          header="Revista mais cara"
          info={expenseIssue.price}
          textInfo="reais"
          edition={expenseIssue.edition}
          title={expenseIssue.title}
          collection={expenseIssue.collection}
        />
        <RenderIssue
          header="Revista mais barata"
          info={cheapestIssue.price}
          textInfo="reais"
          edition={cheapestIssue.edition}
          title={cheapestIssue.title}
          collection={cheapestIssue.collection}
        />

        <RenderCollection
          header="Coleção com mais páginas"
          info={biggestCollection.qtyPages}
          textInfo="páginas"
          title={biggestCollection.name}
        />
        <RenderCollection
          header="Coleção com menos páginas"
          info={smallestCollection.qtyPages}
          textInfo="páginas"
          title={smallestCollection.name}
        />
        <RenderCollection
          header="Coleção mais cara"
          info={expenseCollection.totalPrice}
          textInfo="reais"
          title={expenseCollection.name}
        />
        <RenderCollection
          header="Coleção mais barata"
          info={cheapestCollection.totalPrice}
          textInfo="reais"
          title={cheapestCollection.name}
        />
        <RenderCollection
          header="Coleção com mais edições"
          info={mostEdCollection.qtyEditions}
          textInfo="edições"
          title={mostEdCollection.name}
        />
        <RenderCollection
          header="Coleção com menos edições"
          info={minEdCollection.qtyEditions}
          textInfo="edições"
          title={minEdCollection.name}
        />
      </div>
    </Layout>
  );
}
