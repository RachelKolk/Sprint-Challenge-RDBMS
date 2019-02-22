//const server = require('./server.js');

const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');

const NestHydrationJS = require('nesthydrationjs')();

const db = knex(knexConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

//POSTS a new project to the projects table
server.post('/projects', async (req, res) => {
    try {
        if (req.body.name == "" || req.body.name == null) {
            res.status(406).json({message: "Please provide a project name"});
        } else {
            const [id] = await db('projects')
            .insert(req.body);

            res.status(201).json(id);
        }

    } catch (error) {
        res.status(500).json(error);
    }
});



//POSTS a new action to the correct project
server.post('/actions', async (req, res) => {
    if (req.body.project_id == "" || req.body.description == "" || req.body.notes == "" ||
    req.body.project_id == null || req.body.description == null || req.body.notes == null) {
        res.status(400).json({message: "Please provide information for all of the fields."})
    } else {
        try {
            const newAction = await db('actions')
            .insert(req.body);
            res.status(201).json(newAction)
        } catch (error) {
            res.status(500).json({message: "Error while adding message."});
        }
    }
});



//GETS a project using its id and returns the project with its actions
server.get('/projects/:id/actions', async (req, res) => {
    try {
        const id = req.params.id

    
        const entireProject = await db('projects as p')
        .join('actions as a', 'p.id', 'a.project_id')
        
        .select('p.id as _id___NUMBER', 'p.name as _name', 'p.description as _description', 'p.completed as _completed', 
        'a.id as _action_id___NUMBER', 'a.description as _action_name', 'a.notes as _action_notes', 'a.completed as _action_completed')
        
        .where('a.project_id', id);
        result = NestHydrationJS.nest(entireProject);

    

        if (entireProject.length > 0) {
            res.status(200).json(result)
        } else {
            res.status(404).json({message: "That project doesn't exist"});
        }

    } catch  (error) {
        res.status(500).json({message: "An error occured."});
    }
});



//GETS all projects
server.get('/projects', async (req, res) => {
    try {
        const projects = await db('projects');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json(error);
    }
});



const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`\n* Server Running on http://localhost:${port} *\n`);
});