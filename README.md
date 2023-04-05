# CZ4034_Information_Retrieval

## Question 1

## Question 2
### Data
**Q2_queries**
- **Description:** 
  - This folder contains the JSON results from the 5 queries 
    -  The green
    -  was Justice League that bad
    -  tom cruise was great
    -  is ryan reynolds in free guy
    -  is Banana Splits better than Willy Wonderland
  - A picture of a table containing the results from these queries are also incuded for quick reference

## Question 3

## Question 4

### Data
**crawledData.csv**
- **Description:** 
  - Contains crawled textual data from the movies subreddit via the pushshift API

**Top_10000_Movies.csv**
- **Description:** 
  - Contains a list of recent movies taken from Kaggle. More details on this dataset are found in our report. 
  - In brief, it contains movie name and metadata associated with it. The movie name from this csv file was used as a keyword in the API calls made to pushshift.

**TrainData.csv**
- **Description:** 
  - Contains train data (90% of crawled data) which we will run the autolabeller on.

**evaluation.csv**
- **Description:** 
  - Contains test data along with labels which were manually labeled by the 2 annotators. 
  - Ground truths are taken with respect to annotator 2. 
  - In this dataset, ground truths are given the column names "Auto_labeller_eval_subj" and "Auto_labeller_eval_pol"

**movieCorpus.csv**
- **Description:** 
  - This dataset is a combination of both train and test data. 
  - These are distinguished using a boolean via the "Test" column. {"Train": 0, "Test", 1}. 
  - Ground truths from autolabeller (train data: 90%) and manually labelled data (test data: 10%) are added here
  - Ground truths are given the column names "Auto_labeller_eval_subj" and "Auto_labeller_eval_pol"
  
**subjectivityClassificationResults.csv**
- **Description:** 
  - Contains results on test data for the subjectivity task from running the baseline BERT model over it
  
**BERT_subjectivity.pt**
- **Description:** 
  - Baseline BERT weights for the subjectivity task
  
**BERT_Polarity.pt**
- **Description:** 
  - Baseline BERT weights for the polarity task
 
### Notebooks
**TrainDataProcessing.ipynb**
- **Description:** 
  - Contains code for Textblob was used to run over our train data (90% of crawled data). 

**multinomialNB.ipynb**
- **Description:** 
  - Contains code for how a multonomial NB model was trained and evaluated. Code contains subsections for the subjectivity and polarity tasks.

**BaselineBERT.ipynb**
- **Description:** 
  - Contains code for how a BERT model was trained and evaluated. Code contains subsections for the subjectivity and polarity tasks.

## Question 5

