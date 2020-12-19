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

app.get('/exportjson', async (req, res) => {
    try {
       await exportCollectionDocumentsInJSON('users');
       await exportCollectionDocumentsInJSON('body_parts');
       await exportCollectionDocumentsInJSON('clinical_examination');
       await exportCollectionDocumentsInJSON('complains');
       await exportCollectionDocumentsInJSON('medication');
       await exportCollectionDocumentsInJSON('other_investigation');
       await exportCollectionDocumentsInJSON('pathology_investigation');
       await exportCollectionDocumentsInJSON('provisional_diagnosis');
       await exportCollectionDocumentsInJSON('radiology_investigation');
       await exportCollectionDocumentsInJSON('signs');
       await exportCollectionDocumentsInJSON('symptoms');
       res.send('Success!!!');
    } catch (err) {
        console.log('err........', err);
        res.send(err);
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

