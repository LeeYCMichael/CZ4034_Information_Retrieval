import logo from './logo.svg';
import './App.css';
import { useHttpClient } from './hook';
import { useState, useEffect} from "react";
import { Card, Button, Input, List, Typography, Row, Image } from 'antd';
import moviePicture from "./pictures/moviePicture.png";

function App() {

  const { sendRequest } = useHttpClient();
  const[SolrData, setSolrData] = useState([]);
  const[SpellCheck, setSpellCheck] = useState('');
  const[searchInput, setSearchInput] = useState('');

  const fetchSolrData = async (searchTerm) => {

    let url = "http://localhost:8983/solr/movie_db/spell?indent=true&q.op=OR&rows=20&useParams=&q=body:" + searchTerm //+ "%22"; //'//"body%3Atoys%20body%3Astory"
    
    // const searchTermArray = searchTerm.split(" ");
    // let i = 0;
    // console.log(searchTermArray, searchTermArray.length)
    // while (i < searchTermArray.length) {
    //   url = url + ("body%3A" + searchTerm + "%20");
    //   console.log("ss", url)
    //   i++;
    // }
    
    const response = await sendRequest(url);
    console.log(response);
    return response;
}

const { Search } = Input;

const onSearch = (searchTerm) => {
  const solrData = fetchSolrData(searchTerm).then((data) => {
    setSolrData(data.response);
    setSpellCheck(data.spellcheck.collations);
    console.log(data.response.docs);
    console.log(SpellCheck[3].collationQuery)
  });
 }

 const onChange = (e) => {
  setSearchInput(e.target.value);
};

useEffect(() => {
  fetchSolrData();
}, []);

  return (
    <div className="App" >

      <h1>Movies</h1>
      
      <Image
      width={500}
      preview = {false}
      src={moviePicture}
      />

      <div style={{paddingTop: 25}}> 
        <Search placeholder="input search text" style={{ width: 304 }} value={searchInput} onChange={onChange} onSearch={() => onSearch(searchInput)} enterButton />
      </div>

      <br/>

      <div > 
      <text> {(SpellCheck == '') ? ' ' : "Did you mean " + SpellCheck[3].collationQuery.slice(5, )  } </text>
      </div>

      <br/>

      <div > 
        <List
          dataSource={SolrData.docs}
          renderItem={(item) => (
            <Card style={{width: "50%"}}>

              <div style={{flexDirection: "column"}}> 
                <text> Movie name: {item.movie_name} </text>
                <text> Genres: {item.genre} </text>
                <text> Author: {item.author} </text>
              </div>
            
                <p> {item.body} </p>

                <div style={{flexDirection: "column"}}> 
                  <text> {item.senticSubjectivity} </text>
                  <text> {item.senticSentiment} </text>
                </div>
            </Card>
          )}
          />
        </div>
    </div>
  );
}

export default App;


// <List 
// dataSource={SpellCheck}
// renderItem={(item) => (
//   <List.Item style={{color: "red", width: '10%'}}>
//     <Typography.Text mark> </Typography.Text> {item.collationQuery}
//   </List.Item>

// )}
// />