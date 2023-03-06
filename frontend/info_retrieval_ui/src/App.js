import logo from './logo.svg';
import './App.css';
import { useHttpClient } from './hook';
import { useState, useEffect} from "react";
import { Card, Input, List, Image, Button, Select } from 'antd';
import moviePicture from "./pictures/moviePicture.png";

function App() {

  const { sendRequest } = useHttpClient();
  const[SolrData, setSolrData] = useState([]);
  const[SpellCheck, setSpellCheck] = useState('');
  const[searchInput, setSearchInput] = useState('');
  const[MovieList, setMovieList]  = useState('');
  const[MovieNameInput, setMovieNameInput] = useState("*");
  const[ShowAdvancedSearch, setShowAdvancedSearch] = useState(0);
  const { Search } = Input;
  
  // fetches reddit comments based on users search
  const fetchSolrData = async (searchTerm, movieName) => {

    let url = "http://localhost:8983/solr/movie_db/spell?indent=true&q.op=AND&rows=20&useParams=&q=body:(" + searchTerm + ")movie_name:(" + movieName + ")" //+ "%22"; //'//"body%3Atoys%20body%3Astory"
    console.log(url);
    const response = await sendRequest(url);
    console.log(response);
    return response;
  }

  // fetches all movie titles in database
  const fetchMovieData = async () => {

    let url = "http://localhost:8983/solr/movie_db/query?indent=true&q.op=AND&rows=3000&useParams=&q=*:*&fl=movie_name" //+ "%22"; //'//"body%3Atoys%20body%3Astory"

    const response = await sendRequest(url);
    console.log(response);

    const options = new Set();
    const movies = [{
      value:"*",
      label: "None",}]
    for (let i = 0; i < response.response.docs.length; i++){
      if (options.has(response.response.docs[i].movie_name[0])) {
          continue;
      }
      else{
        options.add(response.response.docs[i].movie_name[0])
        movies.push({
          value: response.response.docs[i].movie_name[0],
          label: response.response.docs[i].movie_name[0],})
      }
    }

    setMovieList(movies);
    return response;
  }

  // calls fetching of reddit comments upon clicking search icon
  const onSearch = (searchTerm, movieName) => {
    const solrData = fetchSolrData(searchTerm, movieName).then((data) => {
      setSolrData(data.response);
      setSpellCheck(data.spellcheck.collations);
      console.log(data.response.docs);
      console.log("Spellcheck", SpellCheck);
    });
  }

  // updates search bar 
  const onChange = (e) => {
    setSearchInput(e.target.value);
  };

  // button to toggle advanced search (by movie name so far)
  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!ShowAdvancedSearch);
    fetchMovieData();
    setMovieNameInput("*");
    //console.log("Advanced search:", ShowAdvancedSearch);
  };

  // updates advanced search:movie_name 
  const handleChange = (value) => {
    if (value) {
      setSearchInput("*");
      setMovieNameInput(value);
    }
    else{
      setMovieNameInput("*");
      setSearchInput("");
    }
    console.log(`Selected: ${value}`);
  };

  useEffect(() => {
    fetchSolrData();
    fetchMovieData();
  }, []);

  return (
    <div className="App">
      
      <Image
      style={{paddingTop: 30, borderRadius: 40}}
      width={555}
      preview = {false}
      src={moviePicture}
      />

      <h1 style={{fontSize: 60}}>Movies</h1>

      <Search placeholder="input search text" style={{ width: 500, }} value={searchInput} onChange={onChange} onSearch={() => onSearch(searchInput, MovieNameInput)} enterButton />

      <text style={{width: 250, padding: 10}}> {(SolrData.numFound < 5) ?  (SpellCheck.length == 0 ) ? "" : "Did you mean " + SpellCheck[1].collationQuery.slice(5, ).replace("(", "").replace(")", "").split('movie_name')[0]: ""  }</text> 
   
      <Button style={{marginBottom: 10}} onClick = {() => toggleAdvancedSearch()}> Advanced search </Button>
      
      {(ShowAdvancedSearch) ?
          <Select
            style={{width: 200}}
            showSearch 
            bordered
            allowClear
            placeholder="Movie name"
            value={MovieNameInput}
            onClear = {() => setMovieNameInput("*")}
            onChange={handleChange}
            options={MovieList} 
          /> 
          : 
          <></>
      }
  
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