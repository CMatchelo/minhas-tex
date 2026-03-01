import Collection from "../../core/collection";
import CurrencyFormatter from "../../functions/formatCurrency";
import collectionImg from "../../../public/collectionGeneric.png";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useIssues from "../../hooks/useIssues";

interface CollectionGridProps {
  collections: Collection[];
  selectedCollection?: (collection: Collection) => void;
  deleteCollection?: (collection: Collection) => void;
}

type orderByType = "name" | "edicoes" | "price" | "pages";

export default function CollectionGrid(props: CollectionGridProps) {
  const router = useRouter();
  const { issues } = useIssues();
  const totalPrice = issues.reduce((acc, issue) => {
    acc += Number(issue.price);
    return acc;
  }, 0);
  const totalIssues = issues.length;
  const totalPages = issues.reduce(
    (acc, issue) => acc + Number(issue.pagesQty),
    0,
  );

  const [orderBy, setOrderBy] = useState<orderByType>("name");
  const sortedCollections = useMemo(() => {
    return [...props.collections].sort((a, b) => {
      const statsA = issues.reduce(
        (acc, issue) => {
          if (issue.collection === a.name) {
            acc.qtyEditions++;
            acc.qtyPages += Number(issue.pagesQty || 0);
            acc.totalPrice += Number(issue.price || 0);
          }
          return acc;
        },
        { qtyEditions: 0, qtyPages: 0, totalPrice: 0 },
      );

      const statsB = issues.reduce(
        (acc, issue) => {
          if (issue.collection === b.name) {
            acc.qtyEditions++;
            acc.qtyPages += Number(issue.pagesQty || 0);
            acc.totalPrice += Number(issue.price || 0);
          }
          return acc;
        },
        { qtyEditions: 0, qtyPages: 0, totalPrice: 0 },
      );

      switch (orderBy) {
        case "name":
          return a.name.localeCompare(b.name);

        case "edicoes":
          return statsB.qtyEditions - statsA.qtyEditions;

        case "pages":
          return statsB.qtyPages - statsA.qtyPages;

        case "price":
          return statsB.totalPrice - statsA.totalPrice;

        default:
          return 0;
      }
    });
  }, [props.collections, issues, orderBy]);

  /* const goToCol = (col) => {
    window.localStorage.setItem("colToOpen", col);
    router.push("/");
  }; */

  function renderData() {
    return sortedCollections?.map((collection, i) => {
      const stats = issues?.reduce(
        (acc, issue) => {
          if (issue.collection === collection.name) {
            acc.qtyEditions++;
            acc.qtyPages += Number(issue.pagesQty || 0);
            acc.totalPrice += Number(issue.price || 0);
          }
          return acc;
        },
        {
          qtyEditions: 0,
          qtyPages: 0,
          totalPrice: 0,
        },
      );

      return (
        <div
          key={collection.id}
          className={`
                    w-full border-b border-gray-700 dark:border-gray-200
                `}
        >
          <div className="flex flex-col md:flex-row w-full justify-evenly">
            <div className="flex md:justify-center p-3 flex-1">
              <span className="flex md:hidden text-gray-800 dark:text-gray-200">
                Coleção:{" "}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {" "}
                {collection.name}
              </span>
            </div>
            <div className="flex md:justify-center p-3 flex-1">
              <span className="flex md:hidden text-gray-800 dark:text-gray-200">
                Edições:{" "}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {" "}
                {stats.qtyEditions}
              </span>
            </div>
            <div className="flex md:justify-center p-3 flex-1">
              <span className="flex md:hidden text-gray-800 dark:text-gray-200">
                Páginas:{" "}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {" "}
                {Number(stats.qtyPages).toFixed(0)}{" "}
              </span>
            </div>
            <div className="flex md:justify-center p-3 flex-1">
              <span className="flex md:hidden text-gray-800 dark:text-gray-200">
                Valor:{" "}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                <CurrencyFormatter value={stats.totalPrice} />
              </span>
            </div>
            {/* <div className="flex md:justify-center p-3 flex-1">
              <span
                className="text-gray-800 dark:text-gray-200"
                onClick={() => goToCol(collection.name)}
              >
                Ver coleção
              </span>
            </div> */}
          </div>
        </div>
      );
    });
  }

  return (
    <div
      className={`
            w-full flex flex-col
        `}
    >
      <div
        className={`
                    w-full border-b border-gray-700 dark:border-gray-200 ustify-evenly
                `}
      >
        <div className="flex gap-4">
          <span className="p-2">Ordenar por</span>
          <select className="p-2 text-gray-800 rounded-md" onChange={(e) => setOrderBy(e.target.value as orderByType)}>
            <option value="name">Nome</option>
            <option value="edicoes">Quantidade de edições</option>
            <option value="pages">Quantidade de páginas</option>
            <option value="price">Valor</option>
          </select>
        </div>
        <div className="hidden flex-col md:flex-row md:flex">
          <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200 ">
            Nome da coleção
          </span>
          <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">
            Edições
          </span>
          <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">
            Paginas
          </span>
          <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">
            Valor da coleção
          </span>
          {/* <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">
            Ações
          </span> */}
        </div>
      </div>
      {renderData()}
      <div
        className={`
                    w-full border-b border-gray-700 dark:border-gray-200
                `}
      >
        <div className="flex flex-col md:flex-row w-full justify-evenly">
          <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">
            Total
          </span>
          <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">
            Edições: {totalIssues}
          </span>
          <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">
            Paginas: {totalPages}
          </span>
          <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">
            Valor total: <CurrencyFormatter value={totalPrice} />
          </span>
          {/* <span className="text-center p-3 text-gray-800 flex-1 dark:text-gray-200">
            ------
          </span> */}
        </div>
      </div>
    </div>
  );
}
