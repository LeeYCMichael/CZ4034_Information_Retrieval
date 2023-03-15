#import the library
from textblob import TextBlob
import pandas as pd

import warnings
warnings.filterwarnings("ignore")

#import dataset
df = pd.read_csv("uncleaned_data.csv")
df = df.dropna(subset=['subjectivity', 'polarity', 'relevance'])

#data info
print("Subjectivity count:")
print(df["subjectivity"].value_counts())
print(df["subjectivity"].value_counts(normalize=True), "\n")

print("Polarity count:")
print(df["polarity"].value_counts())
print(df["polarity"].value_counts(normalize=True), "\n")

print("Relevance count:")
print(df["relevance"].value_counts())
print(df["relevance"].value_counts(normalize=True), "\n")

df_drop_useless = df[df['relevance']==0]

print("Relevance count (drop useless data):")
print(df_drop_useless["relevance"].value_counts())
print(df_drop_useless["relevance"].value_counts(normalize=True), "\n")

#Label sentiment and subjectivity using TextBlob
def sentiment_analysis(data):
    def getSubjectivity(text):
        return TextBlob(text).sentiment.subjectivity

    #Create a function to get the polarity
    def getPolarity(text):
        return TextBlob(text).sentiment.polarity

    #Create two new columns ‘Subjectivity’ & ‘Polarity’
    data['TB_Subj_Score'] = data['body'].apply(getSubjectivity)
    data['TB_Pol_Score'] = data['body'].apply(getPolarity)

    def getSubjAnalysis(score):
        if score < 0.5:
            return 0 #‘Objective’
        else:
            return 1 #‘Subjective’

    def getPolAnalysis(score):
        if score < 0:
            return 0 #‘Negative’
        #elif score == 0:
        #return ‘Neutral’
        else:
            return 1 #‘Positive’

    data['TB_Subjectivity'] = data['TB_Subj_Score'].apply(getSubjAnalysis)
    data['TB_Polarity'] = data['TB_Pol_Score'].apply(getPolAnalysis)

    return data

df_TB_labelled = sentiment_analysis(df_drop_useless)

#data info of labelled Textblob data
print("Subjectivity count  (Textblob):")
print(df_TB_labelled["TB_Subjectivity"].value_counts())
print(df_TB_labelled["TB_Subjectivity"].value_counts(normalize=True), "\n")

print("Polarity count (Textblob):")
print(df_TB_labelled["TB_Polarity"].value_counts())
print(df_TB_labelled["TB_Polarity"].value_counts(normalize=True), "\n")

#Save TextBlob labelled data to csv
df_TB_labelled.to_csv("uncleaned_data_with_TextBlob.csv")
