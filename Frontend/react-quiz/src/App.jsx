import { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [score, setScore] = useState(null);

  // Charger les questions depuis le backend
  useEffect(() => {
    fetch("http://localhost:3000/questions")
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error("Erreur de chargement:", err));
  }, []);

  // Gestion de la réponse choisie
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // Validation des réponses
  const handleSubmit = async () => {
    let newResults = {};
    let correctCount = 0;

    for (const question of questions) {
      const res = await fetch("http://localhost:3000/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: question.id,
          answer: answers[question.id]
        })
      });
      const data = await res.json();
      newResults[question.id] = data.correct;
      if (data.correct) correctCount++;
    }

    setResults(newResults);
    setScore(`${correctCount} / ${questions.length}`);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
      <h1>Quiz React + Express</h1>

      {questions.map(q => (
        <div key={q.id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>{q.question}</h3>

          {q.options.map(opt => (
            <label key={opt} style={{ display: "block", margin: "5px 0" }}>
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() => handleAnswerChange(q.id, opt)}
              />{" "}
              {opt}
            </label>
          ))}

          {results[q.id] !== undefined && (
            <p style={{ color: results[q.id] ? "green" : "red" }}>
              {results[q.id] ? " Correct" : " Incorrect"}
            </p>
          )}
        </div>
      ))}

      {questions.length > 0 && (
        <button onClick={handleSubmit} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Valider mes réponses
        </button>
      )}

      {score && (
        <h2 style={{ marginTop: "20px" }}> Score final : {score}</h2>
      )}
    </div>
  );
}

export default App;
