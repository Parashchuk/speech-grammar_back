import axios from 'axios';

import correctMessage from './correctMessage.js';

const transcript = async (req, res) => {
  const baseUrl = 'https://api.assemblyai.com/v2';
  const { buffer } = req.file;

  //Upload buffer file to the aseembly
  const uploadAudioReponse = await axios.post(`${baseUrl}/upload`, buffer, {
    headers: { authorization: process.env.ASSEMBLYAI_API_KEY },
  });

  //Register buffer in queue for transcript
  const queueRegister = await axios.post(
    baseUrl + '/transcript',
    { audio_url: uploadAudioReponse.data.upload_url },
    {
      headers: { authorization: process.env.ASSEMBLYAI_API_KEY },
    }
  );

  //Polling api endpoint, till the transcript ends
  while (true) {
    const pollingResponse = await axios.get(`${baseUrl}/transcript/${queueRegister.data.id}`, {
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
      },
    });
    const transcriptionResult = pollingResponse.data;

    if (transcriptionResult.status === 'completed') {
      const req = { body: { message: transcriptionResult.text } };
      return correctMessage(req, res);
    } else if (transcriptionResult.status === 'error') {
      throw new Error(`Transcription failed: ${transcriptionResult.error}`);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

export default transcript;
