const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;

const url = 'mongodb+srv://emreKommez:lastikPark48@bodcluster-whupa.mongodb.net/test?retryWrites=true&w=majority';

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {

    if (err) throw err;

    const db = client.db("lastikParkDB");



    // db.listCollections().toArray().then((docs) => {

    //     console.log('Available collections:');
    //     docs.forEach((doc, idx, array) => { console.log(doc.name) });
        

    // }).catch((err) => {

    //     console.log(err);
    // }).finally(() => {
    //     console.log("Done.")
       
        
    //     //client.close();
        
    //     console.log(client.isConnected());
    // });


    /*
    db.collection("companies").find().toArray().then((docs2)=> {
        console.log("Reading the Database:");
        docs2.forEach((doc2,idx,array) => { console.log(doc2.name) });
    
    }).catch((err) => {

        console.log(err);
    }).finally(() => {
        console.log("Done.")
       
        
        //client.close();
        
        console.log(client.isConnected());
    });
    */
   db.collection("siparisCollection").insertOne({
       marka: "Michelin",
       ebat: "165",
       alisFiyati: 250,
       satisFiyati: 300
   })
   .then(result => console.log("Successfully inserted item with _id:"  ))
   .catch((err) => {
       console.log(err);
   })
   .finally(()=> {
        console.log("Insert Completed..");
        process.exit();
    });
   ;
});