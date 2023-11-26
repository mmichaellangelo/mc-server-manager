import {
    getServerStatus,
    startServer,
    stopServer,
    restartServer,
} from "./server_functions";

import express = require('express');

const PORT = 3000;

const app = express();

/*
*   Get status of server and backup containers
*/
app.get("/server/status", (req, res) => {
    let status = {};
    getServerStatus()
    .then(status => {
        res.status(200)
        .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        })
        .send(JSON.stringify(status));
    })
    .catch(error => {
        res.status(500)
        .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        })
        .send(error);
    })
}) 

/*
*   Start Server
*/

app.post("/server/start", (req, res) => {
    startServer("/home/michael/Dev/mc_docker_webapp/")
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

/*
*   Stop Server
*/

app.post("/server/stop", (req, res) => {
    stopServer("/home/michael/Dev/mc_docker_webapp/")
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

/*
*   Restart Server
*/

app.post("/server/restart", (req, res) => {
    restartServer("/home/michael/Dev/mc_docker_webapp/")
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})


