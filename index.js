import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

import root from './controllers/root.js';
import correctMessage from './controllers/correctMessage.js';
import transcript from './controllers/transcript.js';

//Create express app
const PORT = process.env.PORT || 4000;
const app = express();

if (process.env.CYCLIC_APP_ID) {
  console.log('Creating tmp folder');
  fs.mkdir('/tmp', (err) => {});
  console.log(path.resolve('tmp'));
}

//Configure express app
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://voice-grammar.vercel.app'],
  })
);

//Configure multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/var/task/tmp');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.webm');
  },
});

let upload = multer({ storage });

//App routes
app.get('/', root);
app.post('/correctMessage', correctMessage);
app.post('/transcript', upload.single('audio'), transcript);

//Start server
app.listen(PORT, () => {
  console.log('Server started successfully on port: ' + PORT);
});
