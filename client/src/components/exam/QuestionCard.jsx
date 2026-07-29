function QuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  language,
}) {

  if (!question) {
    return null;
  }

  const questionText =
    language === "hindi"
      ? question.questionHindi || question.question
      : question.questionEnglish || question.question;

  const options =
    language === "hindi"
      ? question.optionsHindi || question.options
      : question.optionsEnglish || question.options;

  return (

    <div className="questionSection">

      <div className="questionHeader">

        <h3>
          Question {currentQuestion + 1} / {totalQuestions}
        </h3>

        {question.difficulty && (
          <span className="difficultyBadge">
            {question.difficulty}
          </span>
        )}

      </div>

      <hr />

      <div className="questionText">

        {questionText}

      </div>

      <div className="options">

        {options.map((option, index) => (

          <label
            key={index}
            className={
              selectedAnswer === index
                ? "option activeOption"
                : "option"
            }
          >

            <input
              type="radio"
              name="answer"
              checked={selectedAnswer === index}
              onChange={() => onSelectAnswer(index)}
            />

            <span>{option}</span>

          </label>

        ))}

      </div>

    </div>

  );

}

export default QuestionCard;