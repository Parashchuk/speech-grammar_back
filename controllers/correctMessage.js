import textgears from 'textgears-api';

//Main function
const correctMessage = async (req, res) => {
  try {
    const { message: userMessage } = req.body;

    //If request don't include parameter message return error
    if (!userMessage) {
      return res
        .status(400)
        .json({ userMessage: 'Some neccessary parameters for this request are missing' });
    }

    //Configure textgearsAPI to work with english and take api key
    const textgearsApi = textgears(process.env.TEXTGEARS_API_KEY, { language: 'en-US' });

    //Call api twice in case if first was with mistakes, because API on free trial and do it not properly from first reqest
    let checkedMessage = await checkGrammar(userMessage, textgearsApi);

    //If first check don't passed, then make second
    if (!checkedMessage.passed) {
      let checkedSecondMessage = await checkGrammar(checkedMessage.responseMessage, textgearsApi);

      //If in second check was errors return the corrected version, if not it's means
      //that the message in the second variable is 'congrats' and we don't need to send it after we just solved it
      if (!checkedSecondMessage.passed) {
        checkedMessage = checkedSecondMessage;
      }
    }

    return res.status(200).json({ userMessage, correctedMessage: checkedMessage.responseMessage });
  } catch (err) {
    res.status(500).json({
      message: 'There is a technical problem on the server, we are already working on its solution',
    });
    throw new Error(err);
  }
};

//Function to generate reponse message
const generateResponseMessage = (errors, message) => {
  let resultedString = '';

  if (errors.length != 0) {
    resultedString = message;
    let lastErorAtIndex = 0;

    for (const error of errors) {
      let correctPart = error.better[0];
      const currentErrorIndex = resultedString.indexOf(error.bad, lastErorAtIndex);

      resultedString =
        resultedString.slice(0, currentErrorIndex) +
        correctPart +
        resultedString.slice(currentErrorIndex + error.bad.length);

      lastErorAtIndex = currentErrorIndex + correctPart.length;
    }
  } else {
    return {
      resultedString: '',
      passed: true,
    };
  }

  return { resultedString, passed: false };
};

//Function to make request for API
const checkGrammar = (message, textgearsApi) => {
  return textgearsApi
    .checkGrammar(message)
    .then((data) => {
      const res = generateResponseMessage(data.response.errors, message);
      return {
        responseMessage: res.resultedString,
        passed: res.passed,
      };
    })
    .catch((err) => {
      res.status(500).json({
        message:
          'There is a technical problem on the server, we are already working on its solution',
      });
      throw new Error(err);
    });
};

export default correctMessage;
