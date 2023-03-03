import logo from './logo.svg';
import './App.css';
import { useHttpClient } from './hook';
import { useState, useEffect} from "react";
import { Card, Input, List, Image, Button } from 'antd';
import moviePicture from "./pictures/moviePicture.png";

function App() {

  const { sendRequest } = useHttpClient();
  const[SolrData, setSolrData] = useState([]);
  const[SpellCheck, setSpellCheck] = useState('');
  const[searchInput, setSearchInput] = useState('');

  const fetchSolrData = async (searchTerm) => {

    let url = "http://localhost:8983/solr/movie_db/spell?indent=true&q.op=OR&rows=20&useParams=&q=body:(" + searchTerm + ")" //+ "%22"; //'//"body%3Atoys%20body%3Astory"
    
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
    //console.log(SpellCheck[3].collationQuery)
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
      
      <Image
      style={{paddingTop: 30, borderRadius: 40}}
      width={555}
      preview = {false}
      src={moviePicture}
      />

      <h1 style={{fontSize: 60}}>Movies</h1>
      <div > 
        <Search placeholder="input search text" style={{ width: 700, }} value={searchInput} onChange={onChange} onSearch={() => onSearch(searchInput)} enterButton />
      </div>
      <br/>
      <div > 
        <Button style={{width: 250}}> {(SolrData.numFound < 5) ?  (SpellCheck.length == 0 && searchInput != "") ? "Found what you were looking for?" : "Did you mean " + SpellCheck[1].collationQuery.slice(5, ).replace("(", "").replace(")", "") : "Found what you were looking for?"  }</Button> 
      </div>
      
      <List
        style={{ marginTop: 50, }}
        dataSource={SolrData.docs}
        renderItem={(item) => (
         <div > 
            <Card style={{width: 900, textAlign: "left", backgroundColor: '#000000', color: '#ffffff'}}>
              <div style={{display: 'flex', flexDirection: "column"}}> 
                <text> Movie name: {item.movie_name} </text>
                <text> Genres: {item.genre} </text>
                <text> Author: {item.author} </text>
              </div>
              <hr  style={{color: '#ffffff',backgroundColor: '#ffffff',  borderColor : '#ffffff'}}/>
              <p> {item.body} </p>
              <hr  style={{color: '#ffffff',backgroundColor: '#ffffff',  borderColor : '#ffffff'}}/>
              <div style={{display: 'flex', flexDirection: "row", gap: 10}}> 
                <text > Sentiment: </text>
                <text > {item.senticSubjectivity} </text>
                <text > {item.senticSentiment} </text>
              </div>
            </Card>
            <br/>
          </div>
        )}
      />

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