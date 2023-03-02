# backend

**Follow the following commands to start the server**

   a. cd solr-9.1.1/bin

   b. Ensure you are in /bin and run solr start
   

**Follow the following commands to use solr**

   a. cd solr-9.1.1/bin

   b. Ensure you are in /bin and run solr start

   c. Under core selector, select movie_db
   
   d. To test a query, under q specify field before search term Eg. body:batman
   - For queries with more than 1 word like is toy story good, do body:is body:toy body:story body:good
   - For phrase queries, do body:"toy story"
   - To query in another field, do movie_name:batman 
   - Switch q.op operand from OR to AND if needed
   - To run spellcheck, in Request-Handler (qt), use /spell and tick spellcheeck checkbox, solr would return a list of suggested words along with their frequencies
   