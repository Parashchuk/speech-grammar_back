import express from 'express';
import multer from 'multer';
import cors from 'cors';
import 'dotenv/config';

import root from './controllers/root.js';
import correctMessage from './controllers/correctMessage.js';
import transcript from './controllers/transcript.js';

//Create express app
const PORT = process.env.PORT || 4000;
const app = express();

//Configure express app
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://speech-grammar.vercel.app'],
  })
);

//Configure multer
let upload = multer({ storage: multer.memoryStorage() });

//App routes
app.get('/', root);
app.post('/correctMessage', correctMessage);
app.post('/transcript', upload.single('audio'), transcript);
app.get('auth/me', () => {
  console.log('auth me');
});
app.post('auth/register', () => {
  console.log('register');
});
app.post('auth/login', () => {
  console.log('login');
});

//Start server
app.listen(PORT, () => {
  console.log('Server started successfully on port: ' + PORT);
});
