function QuestionPalette({
  questions,
  currentQuestion,
  answers,
  changeQuestion,
  submitExam,
}) {

  return (

    <div className="palette">

      <h3>Question Palette</h3>

      <div className="paletteGrid">

        {questions.map((_, index) => (

          <button
            key={index}
            className={
              currentQuestion === index
                ? "activeQuestion"
                : answers[index] !== undefined
                ? "answeredQuestion"
                : ""
            }
            onClick={() => changeQuestion(index)}
          >
            {index + 1}
          </button>

        ))}

      </div>

      <button
        className="submitBtn"
        onClick={submitExam}
      >
        Submit Test
      </button>

    </div>

  );
}

export default QuestionPalette;