/**
 * Created by kurtdusek on 2/1/18.
 */
var express = require('express');
var app = express();
var path = require('path');

import axios from 'axios';
import multer from 'multer';
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import GoalApp from '../goalapp.js'


// Serve static assets
let staticDir = path.resolve(__dirname, '..', 'client/public');

const storage = multer.diskStorage({
    destination: staticDir + '/files',
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(/\s/g, "").toLowerCase());
    }
});

const upload = multer({ storage });


app.use(express.static(
    staticDir
));
console.log(staticDir);
app.get('/', (req, res) => {
    const context = {};

    const html = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <GoalApp/>
        </StaticRouter>);

    if (context.url) {
        res.writeHead(301, {
            Location: context.url
        });
        res.end();
    } else {
        res.write(`<!doctype html><div id="app">${html}</div><script src="/bundle.js" type="text/javascript"></script></html>`);
        res.end();
    }
});

app.post('/upload', upload.single('file'), (req, res) => {
        res.send({status: 'success', filename: req.file.filename});
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));