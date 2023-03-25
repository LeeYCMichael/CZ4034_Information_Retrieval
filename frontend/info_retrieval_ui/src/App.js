import logo from "./logo.svg";
import "./App.css";
import { useHttpClient } from "./hook";
import { useState, useEffect } from "react";
import {
  Card,
  Input,
  List,
  Image,
  Button,
  Select,
  Tag,
  Typography,
  Space,
} from "antd";
import moviePicture from "./pictures/moviePicture.png";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const { sendRequest } = useHttpClient();
  const [SolrData, setSolrData] = useState([]); // reddit comments
  const [SpellCheck, setSpellCheck] = useState(""); // spellcheck suggesitions, ranked by levestein distance
  const [FacetFields, setFacetFields] = useState([]); // statistics of sentiments and polarity
  const [QueryTime, setQueryTime] = useState(-1); // time from query to return
  const [MovieList, setMovieList] = useState(""); // list of movies in database
  const [ResultCount, setResultCount] = useState(0);
  const [searchInput, setSearchInput] = useState(""); // search bar input
  const [MovieNameInput, setMovieNameInput] = useState("*"); // movie name selection (for advanced search)
  const [ShowAdvancedSearch, setShowAdvancedSearch] = useState(0); // flag for showing advanced search
  const [PushshiftData, setPushshiftData] = useState([]); // list of data from pushshift api
  const [ApiMovieSearch, setApiMovieSearch] = useState(""); // movie name search input (for crawling data from pushshift api)
  const [ShowPushshiftSearch, setShowPushshiftSearch] = useState(0); // flag for showing pushshift search
  const [ApiMovieName, setApiMovieName] = useState(""); // movie name search input (for crawling data from pushshift api)
  const [isApiLoading, setIsApiLoading] = useState(false); //  isApiLoading state for search bar
  const [ShowSentimentFilter, setShowSentimentFilter] = useState(0); // flag for showing advanced search

  const { Search } = Input;
  const { Text } = Typography;
  const [sentimentInput, setSentimentInput] = useState("*"); // movie name selection (for advanced search)



  const [Subjectivity, setSubjectivity] = useState("*");

  const [Sentiment, setSentiment] = useState("*");

  const onSubjectiveChange = (value) => {
    setSubjectivity(value);
  };

  const onSentimentChange = (value) => {
    setSentiment(value);
  };

  // fetches reddit comments based on users search
  const fetchSolrData = async (searchTerm, movieName) => {
    let url =
      "http://localhost:8983/solr/movie_db/spell?indent=true&q.op=AND&rows=20&useParams=&q=body:(" +
      searchTerm +
      ")movie_name:(" +
      movieName +
      ")" +
      "senticSubjectivity:" +
      "(" + Subjectivity + ")" + 
      "senticSentiment:" +
      "(" + Sentiment + ")" +
    "&facet=true&facet.contains.ignoreCase=true&facet.field=senticSubjectivity&facet.field=senticSentiment"; //+ "%22"; //'//"body%3Atoys%20body%3Astory"
    console.log(url);
    const response = await sendRequest(url);
    console.log(response);
    console.log(response.facet_counts);
    return response;
  };

  // fetches all movie titles in database
  const fetchMovieData = async () => {
    let url =
      "http://localhost:8983/solr/movie_db/query?indent=true&q.op=AND&rows=3000&useParams=&q=*:*&fl=movie_name"; //+ "%22"; //'//"body%3Atoys%20body%3Astory"

    const response = await sendRequest(url);
    console.log(response);

    const options = new Set();
    const movies = [
      {
        value: "*",
        label: "Select a Movie",
      },
    ];
    for (let i = 0; i < response.response.docs.length; i++) {
      if (options.has(response.response.docs[i].movie_name[0])) {
        continue;
      } else {
        options.add(response.response.docs[i].movie_name[0]);
        movies.push({
          value: response.response.docs[i].movie_name[0],
          label: response.response.docs[i].movie_name[0],
        });
      }
    }

    setMovieList(movies);
    return response;
  };

  // fetches pushshift data with searched movie term
  const fetchPushshiftData = async (apiMovieSearch) => {
    const base_url =
      "https://api.pushshift.io/reddit/search/comment/?subreddit=movies&score=2";
    const payload = {
      q: apiMovieSearch,
      after: "365d",
      size: "10",
      aggs: "aggs",
    };
    const response = await fetch(`${base_url}&${new URLSearchParams(payload)}`);
    const json = await response.json();
    return json.data;
  };

  // calls fetching of reddit comments upon clicking search icon
  const onSearch = (searchTerm, movieName) => {
    if (searchTerm == "") {
      setSolrData([]);
      setQueryTime(-1);
    } else {
      const solrData = fetchSolrData(searchTerm, movieName).then((data) => {
        setSolrData(data.response);
        setSpellCheck(data.spellcheck.collations);
        setFacetFields(data.facet_counts.facet_fields);
        setQueryTime(data.responseHeader.QTime);
        setResultCount(data.response.numFound);
        console.log("Response", data.response.docs);
        console.log("Spellcheck", SpellCheck);
        console.log("Facets", FacetFields);
        console.log("Query Time", QueryTime);
      });
    }
  };

  // calls fetching of pushshift api data upon clicking search icon
  const onApiSearch = async (ApiMovieSearch) => {
    if (ApiMovieSearch === "") {
      setPushshiftData([]);
      setApiMovieName("");
    } else {
      setIsApiLoading(true);
      const data = await fetchPushshiftData(ApiMovieSearch);
      setIsApiLoading(false);

      console.log("onapisearch: ", data);
      const capitalizedMovieName =
        ApiMovieSearch.charAt(0).toUpperCase() + ApiMovieSearch.slice(1);
      setApiMovieName(capitalizedMovieName);
      setPushshiftData(data);
    }
  };

  // updates search bar
  const onChange = (e) => {
    setSearchInput(e.target.value);
  };

  // updates api search bar
  const onApiSearchChange = (e) => {
    setApiMovieSearch(e.target.value);
  };

  // button to toggle advanced search (by movie name so far)
  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!ShowAdvancedSearch);
    setShowPushshiftSearch(0);
    setShowSentimentFilter(0);
    fetchMovieData();
    setMovieNameInput("*");

    //console.log("Advanced search:", ShowAdvancedSearch);
  };

  // button to toggle advanced search (by movie name so far)
  const toggleSentimentFilter = () => {
    setShowSentimentFilter(!ShowSentimentFilter);
    setShowPushshiftSearch(0);
    setShowAdvancedSearch(0);
    fetchMovieData();
  };

  // button to toggle pushshift search
  const togglePushshiftSearch = () => {
    setShowPushshiftSearch(!ShowPushshiftSearch);
    setShowSentimentFilter(0);
    setShowAdvancedSearch(0);
  };

  // updates advanced search:movie_name
  const handleChange = (value) => {
    if (value) {
      setSearchInput("*");
      setMovieNameInput(value);
    } else {
      setMovieNameInput("*");
      setSearchInput("");
    }
    console.log(`Selected: ${value}`);
  };

  const getSuggestion = () => {
    if (SolrData.numFound < 5) {
      if (SpellCheck.length === 0) {
        return "";
      } else {
        const suggestion = SpellCheck[1].collationQuery
          .slice(5)
          .replace("(", "")
          .replace(")", "")
          .split("movie_name")[0];
        return suggestion;
      }
    } else {
      return "";
    }
  };

  const handleTextClick = (suggestion) => {
    setSearchInput(suggestion);
    onSearch(suggestion, MovieNameInput);
  };

  return (
    <div className="App">
      <Image
        style={{ paddingTop: 30, borderRadius: 40 }}
        width={400}
        preview={false}
        src={moviePicture}
      />

      <h1 style={{ fontSize: 60, marginTop: 20 }}>Movies</h1>
      {ShowPushshiftSearch ? (
        <></>
      ) : (
        <Search
          placeholder="Search.."
          style={{ width: 800 }}
          value={searchInput}
          onChange={onChange}
          onSearch={() => onSearch(searchInput, MovieNameInput)}
          enterButton
          allowClear
        />
      )}

      <br />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 800,
          gap: 2,
        }}
      >
        <div style={{ display: "flex" }}>
          <Button
            style={{ marginBottom: 10, flex: 1 }}
            onClick={() => toggleAdvancedSearch()}
            type={ShowAdvancedSearch ? "primary" : "link"}
          >
            Advanced Search
          </Button>
          <Button
            style={{ marginBottom: 10, flex: 1 }}
            onClick={() => toggleSentimentFilter()}
            type={ShowSentimentFilter ? "primary" : "link"}
          >
            Sort by sentiment
          </Button>
          <Button
            style={{ marginBottom: 10, flex: 1 }}
            onClick={() => togglePushshiftSearch()}
            type={ShowPushshiftSearch ? "primary" : "link"}
          >
            Crawl Pushshift Data
          </Button>
        </div>
        <div style={{ display: "flex" }}>
          {ShowAdvancedSearch ? (
            <Select
              style={{ marginBottom: 10, flex: 1 }}
              showSearch
              bordered
              allowClear
              placeholder="Movie name"
              value={MovieNameInput}
              onClear={() => setMovieNameInput("*")}
              onChange={handleChange}
              options={MovieList}
              enterButton
            />
          ) : (
            <div style={{ flex: 1 }}></div>
          )}
          {ShowSentimentFilter ? ( 
            <div>

            <Select
            style={{ width: 120 }}
            value={Subjectivity}
            onChange={onSubjectiveChange}
            options={[ { value: '*', label: 'None' },
              { value: 'Objective', label: 'Objective' },
            { value: 'Subjective', label: 'Subjective' }]}
          />
          <Select
            style={{ width: 120 }}
            value={Sentiment}
            onChange={onSentimentChange}
            options={[ { value: '*', label: 'None' },
              { value: 'Negative', label: 'Negative' },
            { value: 'Positive', label: 'Positive' },
            { value: 'Neutral', label: 'Neutral' }]}
          />
          </div>
          ) : (
            <div style={{ flex: 1 }}></div>
          )}
          {ShowPushshiftSearch ? (
            <Search
              placeholder="Search Movie Name from API.."
              style={{ marginBottom: 10, flex: 1 }}
              value={ApiMovieSearch}
              onChange={onApiSearchChange}
              onSearch={() => onApiSearch(ApiMovieSearch)}
              loading={isApiLoading}
              allowClear
            />
          ) : (
            <div style={{ flex: 1 }}></div>
          )}
        </div>
      </div>

      <br />

      {QueryTime >= 0 && !ShowPushshiftSearch ? (
        <text>
          {ResultCount == 1
            ? `${ResultCount} result (${QueryTime}ms)`
            : `${ResultCount} results (${QueryTime}ms)`}
        </text>
      ) : (
        <> </>
      )}

      {getSuggestion() && !ShowPushshiftSearch ? (
        <Button
          type="link"
          block
          onClick={() => {
            const suggestion = getSuggestion();
            handleTextClick(suggestion);
          }}
        >
          Did you mean {getSuggestion()}?
        </Button>
      ) : (
        <br />
      )}

      {ShowPushshiftSearch && ApiMovieName ? (
        <>
          <Text strong style={{ fontSize: "20px", color: "white" }}>
            Crawled 10 Comments about {ApiMovieName} from Pushshift API
          </Text>

          <List
            style={{ marginTop: 30 }}
            dataSource={PushshiftData}
            renderItem={(item) => (
              <div>
                <Card
                  style={{
                    width: 800,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ flex: 1, textAlign: "center" }}>
                      <Text>Searched Term</Text>
                      <br />
                      <Text strong style={{ fontSize: "20px" }}>
                        {ApiMovieName}
                      </Text>
                    </Text>

                    <Text style={{ flex: 1, textAlign: "center" }}>
                      <Text>Date</Text>
                      <br />
                      <Text strong style={{ fontSize: "20px" }}>
                        {item.utc_datetime_str}
                      </Text>
                    </Text>
                    <Text style={{ flex: 1, textAlign: "center" }}>
                      <Text>Author</Text>
                      <br />
                      <Text strong style={{ fontSize: "20px" }}>
                        {item.author ? item.author : "N/A"}
                      </Text>
                    </Text>
                  </div>
                  <hr
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#ffffff",
                      borderColor: "#ffffff",
                    }}
                  />
                  <p> {item.body} </p>
                  <hr
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#ffffff",
                      borderColor: "#ffffff",
                    }}
                  />
                </Card>
                <br />
              </div>
            )}
          />
        </>
      ) : (
        <List
          style={{ marginTop: 30 }}
          dataSource={SolrData.docs}
          renderItem={(item) => (
            <div>
              <Card
                style={{
                  width: 800,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ flex: 1, textAlign: "center" }}>
                    <Text>Movie Name</Text>
                    <br />
                    <Text strong style={{ fontSize: "20px" }}>
                      {item.movie_name}
                    </Text>
                  </Text>

                  <Text style={{ flex: 1, textAlign: "center" }}>
                    <Text>Genres</Text>
                    <br />
                    <Text strong style={{ fontSize: "20px" }}>
                      {item.genre}
                    </Text>
                  </Text>
                  <Text style={{ flex: 1, textAlign: "center" }}>
                    <Text>Author</Text>
                    <br />
                    <Text strong style={{ fontSize: "20px" }}>
                      {item.author ? item.author : "N/A"}
                    </Text>
                  </Text>
                </div>
                <hr
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#ffffff",
                    borderColor: "#ffffff",
                  }}
                />
                <p> {item.body} </p>
                <hr
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#ffffff",
                    borderColor: "#ffffff",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                  <text> Sentiment: </text>

                  {item.senticSubjectivity[0] === "SUBJECTIVE" ? (
                    <Tag color="cyan">SUBJECTIVE</Tag>
                  ) : (
                    <Tag color="purple">AMBIVALENT</Tag>
                  )}
                  {item.senticSentiment[0] === "POSITIVE" ? (
                    <Tag color="green">POSITIVE</Tag>
                  ) : (
                    <Tag color="red">NEGATIVE</Tag>
                  )}
                </div>
              </Card>
              <br />
            </div>
          )}
        />
      )}

      <div style={{ direction: "flex", top: 1500 }}>
        {" "}
        <text> </text>
      </div>

      {FacetFields.senticSentiment &&
      FacetFields.senticSentiment[1] +
        FacetFields.senticSentiment[3] +
        FacetFields.senticSentiment[5] !=
        0 ? (
        <div style={{ position: "absolute", right: 150, width: 300, top: 450 }}>
          <Doughnut
            data={{
              labels: ["Positive", "Negative", "Neutral"],
              datasets: [
                {
                  label: "Sentiment",
                  data: [
                    FacetFields.senticSentiment[1],
                    FacetFields.senticSentiment[3],
                    FacetFields.senticSentiment[5],
                  ],
                  backgroundColor: [
                    "rgba(99, 255, 132, 0.5)",
                    "rgba(255, 159, 64, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                  ],
                  borderColor: [
                    "rgba(99, 255, 132, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(54, 162, 235, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            width={300}
            height={300}
            options={{
              maintainAspectRatio: false,
              responsive: false,
              boxWidth: 10,
            }}
          />

          <br></br>

          <Doughnut
            data={{
              labels: ["Subjective", "Ambivalent", "Objective"],
              datasets: [
                {
                  label: "Subjectivity",
                  data: [
                    FacetFields.senticSubjectivity[1],
                    FacetFields.senticSubjectivity[3],
                    FacetFields.senticSubjectivity[5],
                  ],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 159, 64, 0.5)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 159, 64, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            width={300}
            height={300}
            options={{ maintainAspectRatio: false, responsive: false }}
          />
        </div>
      ) : (
        <></>
      )}
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
