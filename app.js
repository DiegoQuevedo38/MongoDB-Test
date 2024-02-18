const express = require("express")
const {connectToDb, getDb} = require("./db");
const { ObjectId } = require("mongodb");
const app = express();


app.use(express.json());

connectToDb((error) => {
    if(!error){
        app.listen(3001, () => {
            console.log(`Connected to Port 3001`)
        })
        db = getDb()
    }
})


//Enrutamientos xulos

app.get("/music", (req, res) => {
    // Paginado
    const page = req.query.p || 0;
    const songPerPage = 3

    let musicDiscs = []

    db.collection("MusicCDs")
        .find()
        .sort({Year: 1})
        .skip(page * songPerPage)
        .limit(songPerPage)
        .forEach(song => musicDiscs.push(song))
        .then(()=>{
            res.status(200).send(musicDiscs)
        })
        .catch(() => {
            res.status(500).send({error: "No pudimos traer la musica"})
        })
})

// Routing by id

app.get("/music/:id", (req, res) => {

    if(ObjectId.isValid(req.params.id)){

        db.collection("MusicCDs")
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).send(doc)
        })
        .catch(err => {
            res.status(500).send({err})
        })
    } else {
        res.status(500).send({error: "No pudiste hacer fetch pa, portate serio"})
    }
})

// Enrutamiento post, te voy a recomendar una playlist

app.post("/music", (req, res) => {
    const cd = req.body

db.collection("MusicCDs")
    .insertOne(cd)
    .then(result => {
        res.status(201).send(result)
    })
    .catch(error => {
        res.status(500).json({error: "Que cancion maluca pa, no se pudo subir"})
    })
})


// Ahora vamos a borrar esas canciones tan pailas

app.delete("/music/:id", (req, res) => {
    if(ObjectId.isValid(req.params.id)){

        db.collection("MusicCDs")
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(201).send(result)
        })
        .catch(err => {
            res.status(500).send({error: "Not possible my friend"})
        })
    } else {
        res.status(500).send({error: "No se pudo borrar de mi memoria"})
    }
})

// Vamo a editar esa info pa

app.patch("/music/:id", (req, res) => {
    const updates = req.body

    if(ObjectId.isValid(req.params.id)){

        db.collection("MusicCDs")
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(201).send(result)
        })
        .catch(err => {
            res.status(500).send({error: "No actualizacion para ti"})
        })
    } else {
        res.status(500).send({error: "Así estaba bien, no moleste mano"})
    }
})