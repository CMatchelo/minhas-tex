import IssuesGrid from "../src/components/template/IssuesGrid";
import Layout from "../src/components/template/Layout";
import React, { useEffect, useState, useCallback } from "react";
import Button from "../src/components/template/Button";
import RegisterEditionForm from "../src/components/template/RegisterEditionForm";
import useIssues from "../src/hooks/useIssues";
import useCollections from "../src/hooks/useCollections";
import Input from "../src/components/template/Input";

export default function Home() {

  const { tableVisible, showTable, issue, issues, newIssue, saveIssue, setIssues, deleteIssue, selectIssue } = useIssues()
  const { collections } = useCollections()

  const [tempIssues, setTempIssues] = useState([])
  const [sortedIssues, setSortedIssues] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIssues, setFiltereseIssues] = useState(sortedIssues)

  const handleCollectionChange = (event) => {
    const localCollection = event.target ? event.target.value : event;
    console.log("Filtering: ", localCollection)
    if (localCollection == 'all') {
      setTempIssues(issues);
    } else {
      const filteredIssues = issues.filter(issue => issue.collection === localCollection);
      setTempIssues(filteredIssues);
    }
  };

  useEffect(() => {
    const filterData = () => {
      if (searchTerm === '') {
        setSortedIssues(issues);
      } else {
        const filtered = issues.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.additionalStories?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSortedIssues(filtered);
      }
    };

    filterData();
  }, [searchTerm, issues]);


  useEffect(() => {
    const sorted = [...tempIssues].sort((a, b) => a.edition - b.edition);
    setSortedIssues(sorted);
  }, [tempIssues])

  useEffect(() => {
    const localCollection = window.localStorage.getItem('colToOpen');
    console.log("Use effect executed", localCollection)
    if (localCollection) {
      handleCollectionChange(localCollection);
      window.localStorage.removeItem('collection');
    }
  }, [])

  useEffect(() => {
    setTempIssues(issues)
  }, [issues])

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const savingIssue = (updatedIssue) => {
    saveIssue(updatedIssue)
    setIssues([...issues, updatedIssue]);
  }

  return (
    <Layout title="Tex" subtitle="Em contruçao">
      {tableVisible ? (
        <>
          <div className="flex flex-col items-center md:flex-row md:justify-between w-full px-4 m-4">
            <div className="w-full md:w-[20%]">
              <select id="collections" onChange={handleCollectionChange} className="w-full text-black dark:text-white bg-gray-200 dark:bg-gray-800 border-none mb-2 md:mb-0 px-2 py-1">
                <option value="all">Mostrar todas</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.name}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-[50%] md:mb-0">
              <Input placeholder="Busque por história" value={searchTerm} onChange={setSearchTerm} className="w-[100%]" />
            </div>
            <div className="flex justify-end w-full md:w-[20%]">
              <Button color="yellow" onClick={newIssue}>Cadastrar nova edição</Button>
            </div>
          </div>
          <IssuesGrid issues={sortedIssues} selectIssue={selectIssue} deleteIssue={deleteIssue}></IssuesGrid>
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
