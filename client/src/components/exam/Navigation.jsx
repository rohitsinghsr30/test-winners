function Navigation({
  currentQuestion,
  totalQuestions,
  previous,
  next,
}) {
  return (
    <div className="navigation">

      <button
        disabled={currentQuestion === 0}
        onClick={previous}
      >
        Previous
      </button>

      <button
        disabled={currentQuestion === totalQuestions - 1}
        onClick={next}
      >
        Save & Next
      </button>

    </div>
  );
}

export default Navigation;