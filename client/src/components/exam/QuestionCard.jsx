function QuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}) {
  return (
    <div className="questionSection">

      <h3>
        Question {currentQuestion + 1} of {totalQuestions}
      </h3>

      <hr />

      <h2>{question.question}</h2>

      <div className="options">

        {question.options.map((option, index) => (

          <label
            key={index}
            className="option"
          >

            <input
              type="radio"
              name="answer"
              checked={selectedAnswer === index}
              onChange={() => onSelectAnswer(index)}
            />

            {option}

          </label>

        ))}

      </div>

    </div>
  );
}

export default QuestionCard;