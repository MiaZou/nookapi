const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const admin = require('firebase-admin');
const serviceAccount = require('./ServiceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

// get villagers
app.get('/villagers/:userId', async (req, res) => {
    try {
        console.log(req.params.userId);
        const villagerData = [];
        await db.collection('villagers').where('userId', '==', req.params.userId).orderBy('id').get()
        .then((snapshot) => {
            snapshot.forEach(doc => {
                villagerData.push(doc['_fieldsProto']['id']['integerValue']);
            });
            console.log(villagerData);
            res.send(villagerData.json);
        })
    } catch (error) {
        console.log(error);
    }
})

// add a villager
app.put('/:userId/villagers/:villagerId', async (req, res) => {
    try {
        await db.collection('villagers').doc(req.params.userId + req.params.villagerId).set({id: parseInt(req.params.villagerId), userId: req.params.userId})
        .then((snapshot) => {
            console.log(snapshot);
            return snapshot;
        })
    } catch (error) {
        console.log(error);
    }
})

// delete a villager
app.delete('/:userId/villagerdel/:villagerId', async (req, res) => {
    try {
        await db.collection('villagers').doc(req.params.userId + req.params.villagerId).delete()
        .then((snapshot) => {
            console.log(snapshot);
            return snapshot;
        })
    } catch (error) {
        console.log(error);
    }
})

// get fish
app.get('/fish/:userId', async (req, res) => {
    try {
        const fishData = new Set();
        await db.collection('fish').where('userId', '==', req.params.userId).orderBy('id').get()
        .then((snapshot) => {
            snapshot.forEach(doc => {
                fishData.add(doc['_fieldsProto']['id']['integerValue']);
            });
            console.log(fishData);
            return fishData;
        })
    } catch (error) {
        console.log(error);
    }
})

// add a fish
app.put('/:userId/fish/:fishId', async (req, res) => {
    try {
        await db.collection('fish').doc(req.params.userId + req.params.fishId).set({id: parseInt(req.params.fishId), userId: req.params.userId})
        .then((snapshot) => {
            console.log(snapshot);
            return snapshot;
        })
    } catch (error) {
        console.log(error);
    }
})

// delete a fish
app.delete('/:userId/fishdel/:fishId', async (req, res) => {
    try {
        await db.collection('fish').doc(req.params.userId + req.params.fishId).delete()
        .then((snapshot) => {
            console.log(snapshot);
            return snapshot;
        })
    } catch (error) {
        console.log(error);
    }
})