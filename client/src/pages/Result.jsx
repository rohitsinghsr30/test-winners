import { useLocation, useNavigate } from "react-router-dom";
import "../styles/result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data || !data.result) {
    return (
      <div className="resultPage">
        <div className="resultCard">
          <div className="resultHeader">
            <h1>No Result Found</h1>
          </div>

          <div style={{ padding: "30px" }}>
            <button
              className="resultBtn dashboardBtn"
              onClick={() => navigate("/dashboard")}
            >
              Back To Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { result, test, totalQuestions } = data;

  const score = result.score ?? 0;
  const correct = result.correctAnswers ?? 0;
  const wrong = result.wrongAnswers ?? 0;
  const unanswered = result.unanswered ?? 0;

  const percentage =
    totalQuestions > 0
      ? ((correct / totalQuestions) * 100).toFixed(2)
      : 0;

  const accuracy =
    correct + wrong > 0
      ? ((correct / (correct + wrong)) * 100).toFixed(2)
      : 0;

  const pass = Number(percentage) >= 40;

  return (
    <div className="resultPage">
      <div className="resultCard">

        {/* Header */}

        <div className="resultHeader">

          <h1>🏆 TEST RESULT</h1>

          <h2>{test?.title}</h2>

          <div
            className={`resultBadge ${
              pass ? "passBadge" : "failBadge"
            }`}
          >
            {pass ? "PASS" : "FAIL"}
          </div>

        </div>

        {/* Result Grid */}

        <div className="resultGrid">

          <div className="resultBox">
            <h3>Score</h3>
            <span>{score}</span>
          </div>

          <div className="resultBox">
            <h3>Correct</h3>
            <span>{correct}</span>
          </div>

          <div className="resultBox">
            <h3>Wrong</h3>
            <span>{wrong}</span>
          </div>

          <div className="resultBox">
            <h3>Unanswered</h3>
            <span>{unanswered}</span>
          </div>

          <div className="resultBox">
            <h3>Accuracy</h3>
            <span>{accuracy}%</span>
          </div>

          <div className="resultBox">
            <h3>Percentage</h3>
            <span>{percentage}%</span>
          </div>

          <div className="resultBox">
            <h3>Total Questions</h3>
            <span>{totalQuestions}</span>
          </div>

          <div className="resultBox">
            <h3>Rank</h3>
            <span>--</span>
          </div>

          <div className="resultBox">
            <h3>Prize</h3>
            <span>₹0</span>
          </div>

        </div>

        {/* Buttons */}

        <div className="resultActions">

          <button
            className="resultBtn reviewBtn"
            onClick={() =>
              alert("Review Answers feature coming soon.")
            }
          >
            Review Answers
          </button>

          <button
            className="resultBtn dashboardBtn"
            onClick={() => navigate("/dashboard")}
          >
            Back To Dashboard
          </button>

        </div>

      </div>
    </div>
  );
}

export default Result;