const express = require('express')
const app = express();
const { Pool } = require('pg')
const bodyParser = require('body-parser')
const cors = require('cors')

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "postgres",
    port: 5432
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/get', (req, res) => {
    query('select * from filme', false, res)
})
app.post('/api/insert', (req, res) => {
    const movieName = req.body.movieName
    const movieReview = req.body.movieReview
    query('INSERT INTO filme(fil_nome, fil_descricao) VALUES ($1,$2) RETURNING fil_codigo', [movieName, movieReview], res)
})
app.delete('/api/delete/:fil_codigo', (req, res) => {
    const fil_codigo = req.params.fil_codigo
    query('DELETE FROM filme WHERE fil_codigo=$1', [fil_codigo], res)
})
app.put('/api/update/:fil_codigo', (req, res) => {
    const fil_codigo = req.params.fil_codigo
    const fil_descricao = req.body.movieReview
    query('UPDATE filme SET fil_descricao=$2 WHERE fil_codigo=$1', [fil_codigo, fil_descricao])
})

app.listen('3003', () => {
    console.log('Running port 3003')
})

function query(sql, values = false, callback = false) {
    const query = {
        text: sql,
        values: values
    }
    pool.query(query, (err, res) => {
        // pool.end()
        if (err) {
            console.log(err.stack)
        }
        if (callback !== false) {
            callback.send(res)
        }
    })
}