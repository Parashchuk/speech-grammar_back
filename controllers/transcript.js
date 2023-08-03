import ffmpeg from 'ffmpeg';
import path from 'path';

const transcript = (req, res) => {
  try {
    const pathToFile = 'tmp/' + req.file.filename;

    console.log(pathToFile);
    let process = new ffmpeg(pathToFile);

    process.then((audio) => {
      audio.fnExtractSoundToMP3(pathToFile.replace('webm', 'mp3'), (error, file) => {
        if (!error) console.log('Audio file: ' + file);
        if (error) console.log(error);
      });
    });
  } catch (err) {
    console.log(err);
  }

  return res.status(200).json({ message: 'success' });
};

export default transcript;
