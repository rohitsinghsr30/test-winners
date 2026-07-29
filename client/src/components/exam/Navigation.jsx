function Navigation({
  currentQuestion,
  totalQuestions,
  previous,
  next,
  clearResponse,
  markForReview,
}) {

  return (

    <div className="navigation">

      <button
        className="prevBtn"
        disabled={currentQuestion === 0}
        onClick={previous}
      >
        ⬅ Previous
      </button>

      <button
        className="clearBtn"
        onClick={clearResponse}
      >
        ❌ Clear Response
      </button>

      <button
        className="reviewBtn"
        onClick={markForReview}
      >
        📌 Mark For Review
      </button>

      <button
        className="nextBtn"
        disabled={currentQuestion === totalQuestions - 1}
        onClick={next}
      >
        💾 Save & Next ➡
      </button>

    </div>

  );

}

export default Navigation;