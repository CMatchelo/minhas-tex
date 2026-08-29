import IssuesGrid from "../src/components/template/IssuesGrid";
import Layout from "../src/components/template/Layout";
import React, { useEffect, useState } from "react";
import Button from "../src/components/template/Button";
import Input from "../src/components/template/Input";
import Select from "../src/components/template/Select";
import EmptyState from "../src/components/template/EmptyState";
import ConfirmDialog from "../src/components/template/ConfirmDialog";
import RegisterEditionForm from "../src/components/template/RegisterEditionForm";
import useIssues from "../src/hooks/useIssues";
import useCollections from "../src/hooks/useCollections";
import Issue from "../src/core/Issue";
import { IconPlus, IconSearch } from "../src/components/icons";

export default function Home() {

  const { tableVisible, showTable, issue, issues, newIssue, saveIssue, deleteIssue, selectIssue } = useIssues()
  const { collections } = useCollections()

  const [tempIssues, setTempIssues] = useState<Issue[]>([])
  const [sortedIssues, setSortedIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Issue | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Handle showing by collection
  const handleCollectionChange = (value: string) => {
    setCollectionFilter(value)
    if (value === 'all') {
      setTempIssues(issues);
    } else {
      setTempIssues(issues.filter(issue => issue.collection === value));
    }
  };

  // Handle showing by search term
  useEffect(() => {
    if (searchTerm === '') {
      setSortedIssues(tempIssues);
    } else {
      const term = searchTerm.toLowerCase()
      setSortedIssues(
        tempIssues.filter(item =>
          item.title.toLowerCase().includes(term) ||
          item.additionalStories?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, tempIssues]);

  useEffect(() => {
    const localCollection = window.localStorage.getItem('colToOpen');
    if (localCollection) {
      handleCollectionChange(localCollection);
      window.localStorage.removeItem('colToOpen');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (collectionFilter === 'all') {
      setTempIssues(issues)
    } else {
      setTempIssues(issues.filter(issue => issue.collection === collectionFilter))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issues])

  const sortedForDisplay = [...sortedIssues].sort((a, b) => a.edition - b.edition)

  const savingIssue = async (updatedIssue: Issue) => {
    await saveIssue(updatedIssue)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteIssue(deleteTarget)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const collectionOptions = [
    { label: "Mostrar todas", value: "all" },
    ...collections.map(c => ({ label: c.name, value: c.name })),
  ]

  return (
    <Layout sortedIssues={tableVisible ? sortedForDisplay : undefined} title="Minhas HQs" subtitle="">
      {tableVisible ? (
        <>
          <div className="w-full rounded-lg bg-gray-200 dark:bg-gray-900 p-4 mb-4 flex flex-col gap-3 md:flex-row md:items-end">
            <Select
              text="Coleção"
              value={collectionFilter}
              onChange={handleCollectionChange}
              options={collectionOptions}
              className="w-full md:w-56"
            />
            <Input
              text="Buscar"
              placeholder="Busque por história ou título"
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1"
            />
            <Button color="yellow" onClick={newIssue} className="w-full md:w-auto shrink-0 whitespace-nowrap">
              {IconPlus(5)} Nova edição
            </Button>
          </div>

          {sortedForDisplay.length > 0 ? (
            <IssuesGrid
              issues={sortedForDisplay}
              selectIssue={selectIssue}
              onRequestDelete={setDeleteTarget}
            />
          ) : (
            <EmptyState
              icon={IconSearch(12)}
              title="Nenhuma revista encontrada"
              message="Ajuste os filtros de coleção e busca, ou cadastre a sua primeira edição."
              action={
                <Button color="yellow" onClick={newIssue}>
                  {IconPlus(5)} Cadastrar nova edição
                </Button>
              }
            />
          )}

          <ConfirmDialog
            open={!!deleteTarget}
            danger
            title="Excluir edição"
            message={
              deleteTarget
                ? `Tem certeza que deseja excluir "${deleteTarget.title}" (#${deleteTarget.edition})? Esta ação não pode ser desfeita.`
                : ""
            }
            confirmLabel="Excluir"
            loading={deleting}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </>
      ) : (
        <RegisterEditionForm
          issue={issue}
          issueChanged={savingIssue}
          canceled={showTable} />
      )}
    </Layout>
  );
}
