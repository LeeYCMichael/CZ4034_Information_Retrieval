import logo from './logo.svg';
import './App.css';
import { useHttpClient } from './hook';
import { useState, useEffect } from "react";
import { Button, Input, List, Typography } from 'antd';

function App() {

  const { sendRequest } = useHttpClient();
  const[SolrData, setSolrData] = useState([]);
  const[searchInput, setSearchInput] = useState('');

  const fetchSolrData = async (searchTerm) => {

    let url = "http://localhost:8983/solr/movie_db/query?indent=true&q.op=OR&useParams=&q=body%3A" + searchTerm //+ "%22"; //'//"body%3Atoys%20body%3Astory"
    
    // const searchTermArray = searchTerm.split(" ");
    // let i = 0;
    // console.log(searchTermArray, searchTermArray.length)
    // while (i < searchTermArray.length) {
    //   url = url + ("body%3A" + searchTerm + "%20");
    //   console.log("ss", url)
    //   i++;
    // }
    
    const response = await sendRequest(url);
    return response;
}

const { Search } = Input;

const onSearch = (searchTerm) => {
  const solrData = fetchSolrData(searchTerm).then((data) => {
    console.log(data.response.docs);
    setSolrData(data.response)
    console.log(searchTerm)
  });
 }

 const onChange = (e) => {
  setSearchInput(e.target.value);
};

useEffect(() => {
  fetchSolrData();
}, []);

  return (
    <div className="App">

    <h1>Movies</h1>
    
    <Search placeholder="input search text" style={{ width: 304 }} value={searchInput} onChange={onChange} onSearch={() => onSearch(searchInput)} enterButton />
     <List

      bordered

      dataSource={SolrData.docs}
      renderItem={(item) => (
        <List.Item>
          <Typography.Text mark> </Typography.Text> {item.body}
        </List.Item>
      )}
      />
    </div>
  );
}

export default App;
