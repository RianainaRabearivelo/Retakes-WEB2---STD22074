import { useEffect, useState } from "react";

function App() {
  const [listeQuestions, setListeQuestions] = useState([]);
  const [reponsesUtilisateur, setReponsesUtilisateur] = useState({});
  const [verification, setVerification] = useState({});
  const [noteFinale, setNoteFinale] = useState(null);


  useEffect(() => {
    const chargerQuestions = async () => {
      try {
        const res = await fetch("http://localhost:3000/questions");
        const data = await res.json();
        setListeQuestions(data);
      } catch (err) {
        console.error("Erreur lors du chargement des questions :", err);
      }
    };

    chargerQuestions();
  }, []);

  const choisirReponse = (idQuestion, valeur) => {
    setReponsesUtilisateur(prev => ({
      ...prev,
      [idQuestion]: valeur
    }));
  };


  const validerQuiz = async () => {
    let resultatTemporaire = {};
    let bonnesReponses = 0;

    for (let q of listeQuestions) {
      const res = await fetch("http://localhost:3000/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: q.id,
          answer: reponsesUtilisateur[q.id]
        })
      });

      const data = await res.json();
      resultatTemporaire[q.id] = data.correct;

      if (data.correct) bonnesReponses++;
    }

    setVerification(resultatTemporaire);
    setNoteFinale(`${bonnesReponses} / ${listeQuestions.length}`);
  };

  return (
    <div style={{ maxWidth: 650, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Mini Quiz</h1>

      {listeQuestions.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            marginBottom: 25,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          <p style={{ fontWeight: "bold" }}>{item.question}</p>

          {item.options.map((option) => (
            <label key={option} style={{ display: "block", margin: "6px 0" }}>
              <input
                type="radio"
                name={`q-${item.id}`}
                value={option}
                checked={reponsesUtilisateur[item.id] === option}
                onChange={() => choisirReponse(item.id, option)}
              />{" "}
              {option}
            </label>
          ))}

          {verification[item.id] !== undefined && (
            <div style={{ marginTop: 5 }}>
              {verification[item.id] ? (
                <span style={{ color: "green" }}>Correct</span>
              ) : (
                <span style={{ color: "black" }}>Incorrect</span>
              )}
            </div>
          )}
        </div>
      ))}

      {listeQuestions.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={validerQuiz}
            style={{
              padding: "10px 25px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#6d6d6dff",
              color: "white"
            }}
          >
            Soumettre
          </button>
        </div>
      )}

      {noteFinale && (
        <h2 style={{ textAlign: "center", marginTop: 25 }}>
           Résultat final : {noteFinale}
        </h2>
      )}
    </div>
  );
}

export default App;
