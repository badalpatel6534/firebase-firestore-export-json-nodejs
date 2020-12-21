const express = require('express')
const fs = require('fs');
const app = express();
const port = 3000
var admin = require("firebase-admin");
const serviceAccount = require('./serviceAccountKey.json'); // serviceAccountKey found from firebase console project setting 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "" // database URL found from firebase console project setting
});
const db = admin.firestore();


app.get('/', (req, res) => {
    res.send('root')
})

app.get('/exportParticularCollection', async (req, res) => {
    console.log('req.query', req.query);
    if (req.query.collectionName) {
        try {
            await exportCollectionDocumentsInJSON(`${req.query.collectionName}`);
            res.send('Success!!!');
         } catch (err) {
             console.log('err........', err);
             res.send(err);
         }
    } else {
        res.send('collectionName Required as query parameter!');
    }
})

app.get('/exportAllCollections', async (req, res) => {
    try {
        const collectionReferences = await db.listCollections();
        for (collection of collectionReferences) {
            await exportCollectionDocumentsInJSON(collection.id);
        }
        res.send('Success!!!');
    } catch (err) {
        console.log('err........', err);
        res.send(err);
    }
})

/**
 * 
 * @param {*} collectionName: string
 */

async function exportCollectionDocumentsInJSON(collectionName) {
    const snapshot = await db.collection(`${collectionName}`).get()
    const allDocuments = snapshot.docs.map(doc => doc.data());
    fs.writeFileSync(`${collectionName}.json`, JSON.stringify(allDocuments));
}

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});

