import Layout from "../src/components/template/Layout";
import React, { useEffect, useState } from "react";
import useIssues from "../src/hooks/useIssues";
import useCollections from "../src/hooks/useCollections";
import Issue from "../src/core/Issue";
import Collection from "../src/core/collection";
import CurrencyFormatter from "../src/functions/formatCurrency";

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

  function StatCard({ header, value, unit, currency = false, subtitle }: {
    header: string
    value: any
    unit?: string
    currency?: boolean
    subtitle?: string
  }) {
    return (
      <div className="flex flex-col gap-1 rounded-lg bg-white dark:bg-gray-700 shadow p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {header}
        </h2>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {currency
            ? <CurrencyFormatter value={Number(value) || 0} />
            : <>{value ?? 0}{unit ? ` ${unit}` : ""}</>}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{subtitle}</p>
        )}
      </div>
    );
  }

  return (
    <Layout title="Informações" subtitle="Dados sobre suas coleções e revistas">
      <div className="w-full space-y-6">
        <section>
          <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-200">Revistas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard header="Revista com mais páginas" value={biggestIssue.pagesQty} unit="páginas"
              subtitle={`#${biggestIssue.edition} · ${biggestIssue.title} · ${biggestIssue.collection}`} />
            <StatCard header="Revista com menos páginas" value={smallestIssue.pagesQty} unit="páginas"
              subtitle={`#${smallestIssue.edition} · ${smallestIssue.title} · ${smallestIssue.collection}`} />
            <StatCard header="Revista mais cara" value={expenseIssue.price} currency
              subtitle={`#${expenseIssue.edition} · ${expenseIssue.title} · ${expenseIssue.collection}`} />
            <StatCard header="Revista mais barata" value={cheapestIssue.price} currency
              subtitle={`#${cheapestIssue.edition} · ${cheapestIssue.title} · ${cheapestIssue.collection}`} />
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-200">Coleções</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard header="Coleção com mais páginas" value={biggestCollection.qtyPages} unit="páginas"
              subtitle={biggestCollection.name} />
            <StatCard header="Coleção com menos páginas" value={smallestCollection.qtyPages} unit="páginas"
              subtitle={smallestCollection.name} />
            <StatCard header="Coleção mais cara" value={expenseCollection.totalPrice} currency
              subtitle={expenseCollection.name} />
            <StatCard header="Coleção mais barata" value={cheapestCollection.totalPrice} currency
              subtitle={cheapestCollection.name} />
            <StatCard header="Coleção com mais edições" value={mostEdCollection.qtyEditions} unit="edições"
              subtitle={mostEdCollection.name} />
            <StatCard header="Coleção com menos edições" value={minEdCollection.qtyEditions} unit="edições"
              subtitle={minEdCollection.name} />
          </div>
        </section>
      </div>
    </Layout>
  );
}
