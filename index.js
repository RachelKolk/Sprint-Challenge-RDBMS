//const server = require('./server.js');

const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');


const db = knex(knexConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());




//GETS a project using its id and returns the project with its actions
server.get('/projects/:id/actions', async (req, res) => {
    try {
        const id = req.params.id

        const entireProject = await db('actions as a')
        .join('projects as p', 'p.id', 'a.project_id')
        .select('p.id', 'p.name', 'p.description', 'p.completed', 'a.id', 'a.description', 'a.notes', 'a.completed')
        .where('a.project_id', id);

        if (entireProject.length > 0) {
            res.status(200).json(entireProject)
        } else {
            res.status(404).json({message: "That project doesn't exist"});
        }

    } catch  (error) {
        res.status(500).json({error: "AN error occurred during data retrieval."});
    }
});



const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`\n* Server Running on http://localhost:${port} *\n`);
});