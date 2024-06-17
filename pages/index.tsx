import IssuesGrid from "../src/components/template/IssuesGrid";
import Layout from "../src/components/template/Layout";
import React, { useEffect, useState } from "react";
import Button from "../src/components/template/Button";
import RegisterEditionForm from "../src/components/template/RegisterEditionForm";
import useIssues from "../src/hooks/useIssues";
import useCollections from "../src/hooks/useCollections";

export default function Home() {

  const { tableVisible, showTable, issue, issues, newIssue, saveIssue, setIssues, deleteIssue, selectIssue } = useIssues()
  const { collections } = useCollections()

  const [tempIssues, setTempIssues] = useState([])

  const handleCollectionChange = (event) => {
    const localCollection = event.target.value;
    if (localCollection == 'all') {
      setTempIssues(issues);
    } else {
      const filteredIssues = issues.filter(issue => issue.collection === localCollection);
      setTempIssues(filteredIssues);
    }
  };

  useEffect(() => {
    setTempIssues(issues)
  }, [issues])

  const savingIssue = (updatedIssue) => {
    saveIssue(updatedIssue)
    setIssues([...issues, updatedIssue]);
  }

  return (
    <Layout title="Tex" subtitle="Em contruçao">
      {tableVisible ? (
        <>
          <div className="flex justify-between">
            <div className="ml-4">
              <select id="collections" onChange={handleCollectionChange} className="text-black dark:text-white bg-gray-200 dark:bg-gray-800 border-none back px-2 py-1">
                <option value="all">Mostrar todas</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.name}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input placeholder="Buscar por nome"></input>
            </div>
            <div className="flex justify-end mb-5 mr-4 ">
              <Button color="yellow" onClick={newIssue}>Cadastrar nova edição</Button>
            </div>
          </div>
          <IssuesGrid issues={tempIssues} selectIssue={selectIssue} deleteIssue={deleteIssue}></IssuesGrid>
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
