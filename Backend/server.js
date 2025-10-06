const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const questions = [
  {
    id: 1,
    question: "Combien font 2 + 2 ?",
    options: ["3", "4", "5"],
    correctAnswer: "4"
  },
  {
    id: 2,
    question: "Quelle est la capitale de la France ?",
    options: ["Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    id: 3,
    question: "Quel langage est utilisé pour styliser les pages web ?",
    options: ["HTML", "CSS", "JavaScript"],
    correctAnswer: "CSS"
  }
];

app.get('/questions', (req, res) => {
  res.json(questions);
});

app.post('/answer', (req, res) => {
  const { id, answer } = req.body;

  if (!id || !answer) {
    return res.status(400).json({ error: "id et answer sont requis" });
  }

  // Recherche de la question 
  const question = questions.find(q => q.id === id);

  if (!question) {
    return res.status(404).json({ error: "Question non trouvée" });
  }

  // Comparaison de la réponse
  const isCorrect = question.correctAnswer === answer;

  res.json({ correct: isCorrect });
});

app.listen(port, () => {
  console.log(`Serveur en ligne sur http://localhost:${port}`);
});
