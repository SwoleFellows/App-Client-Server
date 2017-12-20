'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');
const superagent = require('superagent');
const WGER_KEY = process.env.WGER_KEY;
const app = express();
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);

// const CLIENT_URL = process.env.CLIENT_URL;
client.connect();
client.on('error', err => console.error(err));

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (request, response) =>
  response.sendFile('index.html', {root: './public'}));
app.get('/routine', (request, response) =>
  response.sendFile('routine.html', {root: './public'}));
app.get('/search', (request, response) =>
  response.sendFile('search.html', {root: './public'}));

//local database CRUD
app.get('/api/v1/users/:user_id', (request, response) => {
  client.query(
    `SELECT * FROM users INNER JOIN workout_routine ON user.user_id=routine_id WHERE user_id=${request.params.user_id};`
  )
    .then(result => response.send(result.rows))
    .catch(console.error);
});

app.post('/api/v1/users', (request, response) => {
  console.log('adding new')
  client.query(
    `INSERT INTO users(username, password) VALUES($1, $2)`,
    [request.body.username, request.body.password]
  )
    .then(() => response.sendStatus(201))
    .catch(console.error);
});

app.get('/api/v1/users/:username', (request, response) => {
  client.query(
    `SELECT * FROM users WHERE username=${request.params.username};`
  )
    .then(result => response.send(result.rows))
    .catch(console.error);
});

/////////////////// ** API superagent queries ** ////////////////////

app.get('/api/v1/filters/musclegroup', (req, res) => {
  let url = 'https://wger.de/api/v2/exercisecategory?language=2&status=2'

  superagent.get(url)
    .query({'key': WGER_KEY})
    .then(ret => res.send(ret.text));
})

app.get('/api/v1/filters/equipment', (req, res) => {
  let url = 'https://wger.de/api/v2/equipment?language=2&status=2'

  superagent.get(url)
    .query({'key': WGER_KEY})
    .then(ret => res.send(ret.text));
})

app.get('/api/v1/exerciselist', (req, res) => {
  let url = req.body.url;

  superagent.get(url)
    .query({'key': WGER_KEY})
    .then(ret => res.send(ret.text));
})

/////////////////////// ** Database Manipulation ** //////////////////////

app.post('/api/v1/workout_routine', (request, response) => {
  let {routine_id, monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2} = request.body;
  client.query(
    `INSERT INTO workout_routine(routine_id, monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [routine_id, monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2]
  )
    .then(() => response.sendStatus(201))
    .catch(console.error);
});

app.put('/api/v1/users/:user_id', (request, response) => {
  let {routine_id, monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2} = request.body;
  client.query(
    `UPDATE workout_routine SET(routine_id, monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [routine_id, monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2]
  )
    .then(() => response.send('Update Complete'))
    .catch(console.error);
});

app.delete('/api/v1/users/:user_id', (request, response) => {
  client.query(
    `DELETE FROM users INNER JOIN workout_routine WHERE user_id=$1;`,
    [request.params.id]
  )
    .then(() => response.send('Deleted'))
    .catch(console.error);
});


createUsersTable()
createWorkoutTable()


app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

function createUsersTable() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    users (
      user_id SERIAL PRIMARY KEY,
      username VARCHAR(12) UNIQUE NOT NULL,
      password VARCHAR (16)
    );`
  )
  .catch(console.error);
}
function createWorkoutTable () {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    workout_routine (
      routine_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(user_id),
      monday1 VARCHAR(255),
      monday2 VARCHAR(255),
      tuesday1 VARCHAR(255),
      tuesday2 VARCHAR(255),
      wednesday1 VARCHAR(255),
      wednesday2 VARCHAR(255),
      thursday1 VARCHAR(255),
      thursday2 VARCHAR(255),
      friday1 VARCHAR(255),
      friday2 VARCHAR(255),
      saturday1 VARCHAR(255),
      saturday2 VARCHAR(255),
      sunday1 VARCHAR(255),
      sunday2 VARCHAR(255)
    );`
  )
  .catch(console.error);
}
// export PORT=3000
// export CLIENT_URL=http://localhost:8080
// export DATABASE_URL=postgres://localhost:5432/books_app
// export DATABASE_URL=postgres://postgres:plokij09@localhost:5432/books_app
