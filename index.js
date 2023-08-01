import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import root from './controllers/root.js';
import correctMessage from './controllers/correctMessage.js';

//Create express app
const PORT = process.env.PORT || 4000;
const app = express();

//Configure express app
app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000'] }));

//App routes
app.get('/', root);
app.post('/transcriptAudio', () => {});
app.post('/correctMessage', correctMessage);

//Start server
app.listen(PORT, () => {
  console.log('Server started successfully on port: ' + PORT);
});
