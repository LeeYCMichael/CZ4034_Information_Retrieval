# CZ4034_Information_Retrieval

## Instructions for running frontend server

1. Ensure that you have node installed by using the following command: node -v
2. Ensure that you have npm installed by using the following command: npm -v
3. Follow the following commands to start the application:

   a. cd frontend

   b. cd info_retrieval_ui

   c. npm install

   d. npm start

## Instructions for running backend server

**Commands to start the solr server**

   a. cd backend
   
   b. cd solr-9.1.1/bin

   c. Ensure you are in /bin and run solr start
   

**Commands to use solr**

   a. Once Solr is running, navigate to http://localhost:8983/solr/#/

   b. Under core selector, select movie_db. This is the core we have created and used for our IR system
   
   c. To test a query, under q specify field before search term Eg. body:batman
   - For longer queries like is toy story good, do body:(is toy story good)
   - To query in another field, do movie_name:batman 
   - Switch q.op operand from AND to OR if needed
   - To run spellcheck, in Request-Handler (qt), use /spell and tick spellcheeck checkbox, solr would return a list of suggested words along with their frequencies
   
## Question 1

`subredditScraper.ipynb`

- **Description:**
  - This Python notebook crawls movie comments from the r/movies subreddit using the Pushshift API. It uses the 'get_pushshift_data' function to fetch data and filter it based on specific criteria.

`corpus_statistics.ipynb`

- **Description:**
  - This Python notebook visualizes data to answer questions about the corpus, including the number of records, words, and types. It includes a plot for Zipf's law and a bar chart for Overall Polarity Distribution.

## Question 2

### Data

**Q2_queries**

- **Description:**
  - This folder contains the JSON results from the 5 queries
    - The green
    - was Justice League that bad
    - tom cruise was great
    - is ryan reynolds in free guy
    - is Banana Splits better than Willy Wonderland
  - A picture of a table containing the results from these queries are also incuded for quick reference


## Question 3 and 4

### Data

`crawledData.csv`

- **Description:**
  - Contains crawled textual data from the movies subreddit via the pushshift API

`Top_10000_Movies.csv`

- **Description:**
  - Contains a list of recent movies taken from Kaggle. More details on this dataset are found in our report.
  - In brief, it contains movie name and metadata associated with it. The movie name from this csv file was used as a keyword in the API calls made to pushshift.

`TrainData.csv`

- **Description:**
  - Contains train data (90% of crawled data) which we will run the autolabeller on.

`evaluation.csv`

- **Description:**
  - Contains test data along with labels which were manually labeled by the 2 annotators.
  - Ground truths are taken with respect to annotator 2.
  - In this dataset, ground truths are given the column names "Auto_labeller_eval_subj" and "Auto_labeller_eval_pol"

`movieCorpus.csv`

- **Description:**
  - This dataset is a combination of both train and test data.
  - These are distinguished using a boolean via the "Test" column. {"Train": 0, "Test", 1}.
  - Ground truths from autolabeller (train data: 90%) and manually labelled data (test data: 10%) are added here
  - Ground truths are given the column names "Auto_labeller_eval_subj" and "Auto_labeller_eval_pol"

`subjectivityClassificationResults.csv`

- **Description:**
  - Contains results on test data for the subjectivity task from running the baseline BERT model over it
 
`polarityClassificationResults.csv`

- **Description:**
  - Contains results on test data for the polarity task from running the baseline BERT model over it

### Model Weights
`BERT_subjectivity.pt`

- **Description:**
  - Baseline BERT weights for the subjectivity task

`BERT_Polarity.pt`

- **Description:**
  - Baseline BERT weights for the polarity task

### Notebooks

`TrainDataProcessing.ipynb`

- **Description:**
  - Contains code for Textblob was used to run over our train data (90% of crawled data).

`multinomialNB.ipynb`

- **Description:**
  - Contains code for how a multonomial NB model was trained and evaluated. Code contains subsections for the subjectivity and polarity tasks.
  
`Word Embeddings.ipynb`

- **Description:**
  - Contains code for how a word embeddings model was trained and evaluated. Code contains subsections for the subjectivity and polarity tasks.
  - File "glove.6B.100d.txt" for pre-trained word vectors could be found here: https://nlp.stanford.edu/projects/glove/ under glove.6B.zip

`BaselineBERT.ipynb`

- **Description:**
  - Contains code for how a BERT model was trained and evaluated. Code contains subsections for the subjectivity and polarity tasks.

## Question 5
### Data
`BertBiLSTM_subjectivityClassificationResults.csv`

- **Description:**
  - Contains results on test data for the subjectivity task from running the BERT+Bi-LSTM model over it

`BertBiLSTM_polarityClassificationResults.csv`

- **Description:**
  - Contains results on test data for the polarity task from running the BERT+Bi-LSTM model over it

### Model Weights
`subjectivityBertBiLSTM.pth`

- **Description:**
  -  BERT+Bi-LSTM weights for the subjectivity task

`polarityBertBiLSTM.pth`

- **Description:**
  -  BERT+Bi-LSTM weights for the polarity task

### Notebooks
`BertLSTM_Final.ipynb`

- **Description:**
  - Contains code for how an end-2-end ensemble with BERT+Bi-LSTM model was trained and evaluated. Code contains subsections for the subjectivity and polarity tasks.
 
- **Environment Needed:**
  - python version == 3.7.13
  - transformers==3.0.0
  - torch==1.8.1
