import Collection from "../../core/collection";
import CurrencyFormatter from "../../functions/formatCurrency";
import { useMemo, useState } from "react";
import useIssues from "../../hooks/useIssues";
import Select from "./Select";
import ConfirmDialog from "./ConfirmDialog";
import { IconDelete, IconEdit } from "../icons";

interface CollectionGridProps {
  collections: Collection[];
  selectedCollection?: (collection: Collection) => void;
  deleteCollection?: (collection: Collection) => void;
}

type orderByType = "name" | "edicoes" | "price" | "pages";

interface Stats {
  qtyEditions: number;
  qtyPages: number;
  totalPrice: number;
}

export default function CollectionGrid(props: CollectionGridProps) {
  const { issues } = useIssues();

  const [orderBy, setOrderBy] = useState<orderByType>("name");
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);

  const totalPrice = issues.reduce((acc, issue) => acc + Number(issue.price), 0);
  const totalIssues = issues.length;
  const totalPages = issues.reduce((acc, issue) => acc + Number(issue.pagesQty), 0);

  const statsFor = (name: string): Stats =>
    issues.reduce<Stats>(
      (acc, issue) => {
        if (issue.collection === name) {
          acc.qtyEditions++;
          acc.qtyPages += Number(issue.pagesQty || 0);
          acc.totalPrice += Number(issue.price || 0);
        }
        return acc;
      },
      { qtyEditions: 0, qtyPages: 0, totalPrice: 0 }
    );

  const sortedCollections = useMemo(() => {
    return [...props.collections].sort((a, b) => {
      const sa = statsFor(a.name);
      const sb = statsFor(b.name);
      switch (orderBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "edicoes":
          return sb.qtyEditions - sa.qtyEditions;
        case "pages":
          return sb.qtyPages - sa.qtyPages;
        case "price":
          return sb.totalPrice - sa.totalPrice;
        default:
          return 0;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.collections, issues, orderBy]);

  const showActions = props.selectedCollection || props.deleteCollection;

  return (
    <div className="w-full flex flex-col">
      <div className="mb-3 flex items-center gap-3">
        <Select
          text="Ordenar por"
          value={orderBy}
          onChange={(v) => setOrderBy(v as orderByType)}
          options={[
            { label: "Nome", value: "name" },
            { label: "Quantidade de edições", value: "edicoes" },
            { label: "Quantidade de páginas", value: "pages" },
            { label: "Valor", value: "price" },
          ]}
          className="w-56"
        />
      </div>

      {/* Header (desktop) */}
      <div className="hidden md:flex border-b border-gray-400 dark:border-gray-600 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        <span className="flex-1 p-3">Nome da coleção</span>
        <span className="flex-1 p-3 text-center">Edições</span>
        <span className="flex-1 p-3 text-center">Páginas</span>
        <span className="flex-1 p-3 text-center">Valor</span>
        {showActions && <span className="w-24 p-3 text-center">Ações</span>}
      </div>

      <div className="divide-y divide-gray-300 dark:divide-gray-700">
        {sortedCollections.map((collection) => {
          const stats = statsFor(collection.name);
          const hasIssues = stats.qtyEditions > 0;
          return (
            <div
              key={collection.id}
              className="flex flex-col md:flex-row md:items-center hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1 p-3 flex justify-between md:block">
                <span className="md:hidden text-gray-500 dark:text-gray-400">Coleção:</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{collection.name}</span>
              </div>
              <div className="flex-1 p-3 flex justify-between md:justify-center">
                <span className="md:hidden text-gray-500 dark:text-gray-400">Edições:</span>
                <span className="text-gray-800 dark:text-gray-200">{stats.qtyEditions}</span>
              </div>
              <div className="flex-1 p-3 flex justify-between md:justify-center">
                <span className="md:hidden text-gray-500 dark:text-gray-400">Páginas:</span>
                <span className="text-gray-800 dark:text-gray-200">{Number(stats.qtyPages).toFixed(0)}</span>
              </div>
              <div className="flex-1 p-3 flex justify-between md:justify-center">
                <span className="md:hidden text-gray-500 dark:text-gray-400">Valor:</span>
                <span className="text-gray-800 dark:text-gray-200">
                  <CurrencyFormatter value={stats.totalPrice} />
                </span>
              </div>
              {showActions && (
                <div className="w-full md:w-24 p-3 flex md:justify-center gap-2">
                  {props.selectedCollection && (
                    <button
                      aria-label={`Editar coleção ${collection.name}`}
                      onClick={() => props.selectedCollection?.(collection)}
                      className="rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-yellow-500 hover:text-white transition-colors"
                    >
                      {IconEdit}
                    </button>
                  )}
                  {props.deleteCollection && (
                    <button
                      aria-label={`Excluir coleção ${collection.name}`}
                      disabled={hasIssues}
                      onClick={() => { if (!hasIssues) setDeleteTarget(collection); }}
                      title={hasIssues ? "Só é possível excluir coleções sem edições" : undefined}
                      className="rounded-full p-2 text-gray-600 dark:text-gray-300 transition-colors hover:bg-red-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 dark:disabled:hover:text-gray-300"
                    >
                      {IconDelete}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="flex flex-col md:flex-row md:justify-evenly border-t-2 border-gray-400 dark:border-gray-600 font-semibold">
        <span className="flex-1 p-3 text-center text-gray-800 dark:text-gray-200">Total</span>
        <span className="flex-1 p-3 text-center text-gray-800 dark:text-gray-200">Edições: {totalIssues}</span>
        <span className="flex-1 p-3 text-center text-gray-800 dark:text-gray-200">Páginas: {totalPages}</span>
        <span className="flex-1 p-3 text-center text-gray-800 dark:text-gray-200">
          Valor total: <CurrencyFormatter value={totalPrice} />
        </span>
        {showActions && <span className="hidden md:block w-24 p-3" />}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        danger
        title="Excluir coleção"
        message={
          deleteTarget
            ? `Excluir a coleção "${deleteTarget.name}"? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        onConfirm={() => {
          if (deleteTarget && statsFor(deleteTarget.name).qtyEditions === 0) {
            props.deleteCollection?.(deleteTarget);
          }
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
