function QuestionPalette({
  questions,
  currentQuestion,
  answers,
  visitedQuestions,
  markedReview,
  changeQuestion,
  submitExam,
  submitting,
}) {

  const answeredCount = questions.filter(
    (q) => answers[q._id] !== undefined
  ).length;

  const reviewCount = markedReview.length;

  const remainingCount =
    questions.length - answeredCount;

  return (

    <div className="palette">

      <h3>Question Palette</h3>

      {/* ================= Legend ================= */}

      <div className="paletteLegend">

        <div>
          <span className="legendBox currentLegend"></span>
          Current
        </div>

        <div>
          <span className="legendBox answeredLegend"></span>
          Answered
        </div>

        <div>
          <span className="legendBox reviewLegend"></span>
          Review
        </div>

        <div>
          <span className="legendBox visitedLegend"></span>
          Visited
        </div>

        <div>
          <span className="legendBox notVisitedLegend"></span>
          Not Visited
        </div>

      </div>

      {/* ================= Palette ================= */}

      <div className="paletteGrid">

        {questions.map((question, index) => {

          let className = "notVisited";

          if (currentQuestion === index) {

            className = "currentQuestion";

          }
          else if (markedReview.includes(question._id)) {

            className = "reviewQuestion";

          }
          else if (answers[question._id] !== undefined) {

            className = "answeredQuestion";

          }
          else if (visitedQuestions.includes(question._id)) {

            className = "visitedQuestion";

          }

          return (

            <button
              key={question._id}
              className={className}
              onClick={() => changeQuestion(index)}
            >
              {index + 1}
            </button>

          );

        })}

      </div>

      {/* ================= Summary ================= */}

      <div className="paletteSummary">

        <p>
          <strong>Total :</strong>
          <span>{questions.length}</span>
        </p>

        <p>
          <strong>Answered :</strong>
          <span>{answeredCount}</span>
        </p>

        <p>
          <strong>Review :</strong>
          <span>{reviewCount}</span>
        </p>

        <p>
          <strong>Remaining :</strong>
          <span>{remainingCount}</span>
        </p>

      </div>

      {/* ================= Submit ================= */}

      <button
        className="submitBtn"
        disabled={submitting}
        onClick={submitExam}
      >
        {submitting ? "Submitting..." : "Submit Test"}
      </button>

    </div>

  );

}

export default QuestionPalette;