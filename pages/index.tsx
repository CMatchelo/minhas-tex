import IssuesGrid from "../src/components/template/IssuesGrid";
import Layout from "../src/components/template/Layout";
import React, { useEffect, useState } from "react";
import Button from "../src/components/template/Button";
import RegisterEditionForm from "../src/components/template/RegisterEditionForm";
import useIssues from "../src/hooks/useIssues";
import useCollections from "../src/hooks/useCollections";

export default function Home() {

  const { tableVisible, showTable, issue, issues, newIssue, saveIssue, deleteIssue, selectIssue } = useIssues()
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

  return (
    <Layout title="Tex" subtitle="Em contruçao">
      {tableVisible ? (
        <>
          <div>
            <select id="collections" onChange={handleCollectionChange}>
              <option value="all">Mostrar todos</option>
              {collections.map(collection => (
                <option key={collection.id} value={collection.name}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end mb-5 ">
            <Button color="yellow" onClick={newIssue}>Cadastrar edição</Button>
          </div>
          <IssuesGrid issues={tempIssues} selectIssue={selectIssue} deleteIssue={deleteIssue}></IssuesGrid>
        </>
      ) : (
        <RegisterEditionForm
          issue={issue}
          issueChanged={saveIssue}
          canceled={showTable} />
      )}
    </Layout>
  );
}
