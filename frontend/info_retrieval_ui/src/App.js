import logo from './logo.svg';
import './App.css';
import { useHttpClient } from './hook';
import { useState, useEffect } from "react";
import { Input, Space } from 'antd';

function App() {

  const { sendRequest } = useHttpClient();
  const[SolrData, setSolrData] = useState('');

  const fetchSolrData = async () => {
    let url = "http://localhost:8983/solr/movie_db/query?indent=true&q.op=OR&q=body%3Abatman&useParams=";

    const response = await sendRequest(url);
    console.log(response);
    // console.log(response);
    setSolrData(response.jobs);
}

const { Search } = Input;


const onSearch = (value) => fetchSolrData();;

// useEffect(() => {
//   fetchJobs();
// }, []);
  
  return (
    <div className="App">

    <Search placeholder="input search text" style={{ width: 304 }} onSearch={onSearch} enterButton />


    </div>
  );
}

export default App;
