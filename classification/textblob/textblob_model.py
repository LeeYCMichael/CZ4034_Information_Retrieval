#import the library
from textblob import TextBlob
import pandas as pd

from sklearn.metrics import accuracy_score

import warnings
warnings.filterwarnings("ignore")

#import dataset
df = pd.read_csv("uncleaned_data.csv")

#data info (initial)
print("Subjectivity count (initial):")
print(df["subjectivity"].value_counts())
print(df["subjectivity"].value_counts(normalize=True), "\n")

print("Polarity count (initial):")
print(df["polarity"].value_counts())
print(df["polarity"].value_counts(normalize=True), "\n")

print("Relevance count (initial):")
print(df["relevance"].value_counts())
print(df["relevance"].value_counts(normalize=True), "\n")

df_drop_useless = df[df['relevance']!=1]
df_drop_useless = df_drop_useless.dropna(subset=['subjectivity'])

print("Subjectivity count (aft drop useless data):")
print(df_drop_useless["subjectivity"].value_counts())
print(df_drop_useless["subjectivity"].value_counts(normalize=True), "\n")

df_drop_subj = df_drop_useless[df_drop_useless['subjectivity']==1]
df_drop_subj = df_drop_subj[(df_drop_subj['polarity']==0)|(df_drop_subj['polarity']==1)]

print("Polarity count (aft drop useless data):")
print(df_drop_subj["polarity"].value_counts())
print(df_drop_subj["polarity"].value_counts(normalize=True), "\n")

print("Relevance count (aft drop useless data):")
print(df_drop_useless["relevance"].value_counts())
print(df_drop_useless["relevance"].value_counts(normalize=True), "\n")


#Label sentiment and subjectivity using TextBlob
def sentiment_analysis(data):
    #Create a function to get the subjectivity
    def getSubjectivity(text):
        return TextBlob(text).sentiment.subjectivity

    def getSubjAnalysis(score):
        if score < 0.5:
            return 0 #‘Objective’
        else:
            return 1 #‘Subjective’

    #Create a function to get the polarity
    def getPolarity(subj, pol, text):
        if subj == 1 and (pol == 1 or pol == 0):
            return TextBlob(text).sentiment.polarity

    def getPolAnalysis(subj, pol, score):
       if subj == 1 and (pol == 1 or pol == 0):
            if score <= 0:
                return 0 #‘Negative’
            elif score > 0.3:
                return 2 #‘Postive’
            else:
                return 1 #‘Neutral’

    data['TB_Subj_Score'] = data['body'].apply(getSubjectivity)
    data['TB_Subjectivity'] = data['TB_Subj_Score'].apply(getSubjAnalysis)

    data['TB_Pol_Score'] = data.apply(lambda x: getPolarity(x['subjectivity'], x['polarity'], x['body']), axis=1)
    data['TB_Polarity'] = data.apply(lambda x: getPolAnalysis(x['subjectivity'], x['polarity'], x['TB_Pol_Score']), axis=1)

    return data

df_TB_labelled = sentiment_analysis(df_drop_useless)

#data info of labelled Textblob data
print("Subjectivity count  (Textblob):")
print(df_TB_labelled["TB_Subjectivity"].value_counts())
print(df_TB_labelled["TB_Subjectivity"].value_counts(normalize=True), "\n")

print("Polarity count (Textblob):")
print(df_TB_labelled["TB_Polarity"].value_counts())
print(df_TB_labelled["TB_Polarity"].value_counts(normalize=True), "\n")

#Compare accuracy Textblob vs manual
print("Accuracy Textblob vs Manual:")
print("Subjectivity Acc: ", accuracy_score(df_TB_labelled["subjectivity"],
                                           df_TB_labelled["TB_Subjectivity"],
                                           normalize=False))
print("Subjectivity Acc %: ", accuracy_score(df_TB_labelled["subjectivity"],
                                             df_TB_labelled["TB_Subjectivity"]))

df_temp = df_TB_labelled[(df_TB_labelled['subjectivity']==1) & ((df_TB_labelled['polarity']==0) | (df_TB_labelled['polarity']==1))]

print("Polarity Acc: ", accuracy_score(df_temp["polarity"],
                                       df_temp["TB_Polarity"],
                                       normalize=False))
print("Polarity Acc %: ", accuracy_score(df_temp["polarity"],
                                         df_temp["TB_Polarity"]))

df_temp_1 = df_TB_labelled[(df_TB_labelled['polarity']==0) & (df_TB_labelled['subjectivity']==1)]
df_temp_2 = df_TB_labelled[(df_TB_labelled['polarity']==1) & (df_TB_labelled['subjectivity']==1)]
df_temp_2["polarity"].replace(1, 2, inplace=True)

print("Polarity Acc % (neg): ", accuracy_score(df_temp_1["polarity"],
                                               df_temp_1["TB_Polarity"]))
print("Polarity Acc % (pos): ", accuracy_score(df_temp_2["polarity"],
                                               df_temp_2["TB_Polarity"]))

#Save TextBlob labelled data to csv
df_TB_labelled.to_csv("uncleaned_data_with_TextBlob.csv")
