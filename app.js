require('dotenv').config();
const express = require('express');
const openai = require('openai');
const random = require('random');
const path = require('path');

const app = express();

// OpenAI API credentials
openai.apiKey = process.env.OPENAI_API_KEY; //node event listener

// GPT-3.5 parameters
const model = "text-davinci-003";

// Flow-GPT prompts
const prompts = {
  "greeting": "What can I do for you today?",
  "farewell": "It was nice chatting with you. Have a great day!",
  "fallback": "I'm sorry, but I'm not sure how to respond. Can you rephrase or ask something else?"
};

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));// instead of CORS 


function isGreeting(message) {
  const greetings = ["hi", "hello", "hey"];
  return greetings.some(greeting => message.toLowerCase().includes(greeting));
}

// Home pagewe
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  const message = req.body.message;
  const response = await generateResponse(message);
  res.send(response);
});

// Generate response using GPT-3.5 and Flow-GPT prompts
async function generateResponse(message) {
  let prompt;
  if (isGreeting(message)) {
    prompt = prompts["greeting"];
  } else {
    prompt = "You: " + message + "\nKochi:";
  }
  const response = await openai.Completion.create({
    model: model,
    prompt: prompt,
    max_tokens: 100,
    n: 1,
    stop: null,
    temperature: 0.7
  });

  const reply = response.choices[0].text.trim().replace("Kochi:", "");
  return formatReply(reply);
}

// Format the reply as a tsundere response
function formatReply(reply) {
  if (reply.endsWith(".") || reply.endsWith("!") || reply.endsWith("?")) {
    reply = reply.slice(0, -1); // Remove the punctuation at the end
  }

  // Add tsundere expressions at the end of the sentence
  const tsundereExpressions = ["hmpf", "tch!", "baka!", "Urusai!"];
  reply += " " + tsundereExpressions[random.int(0, tsundereExpressions.length - 1)];

  // Add follow-up after a request
  const followUp = [
    "It's not like I did that because I like you or anything!",
    "It's not like I like you or anything!",
    "Don't get the wrong idea!"
  ];

  return reply + " " + followUp[random.int(0, followUp.length - 1)];
}

app.listen(3000, () => console.log('Server running on port 3000'));