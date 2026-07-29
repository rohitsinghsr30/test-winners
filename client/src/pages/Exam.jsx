import { useParams, useNavigate } from "react-router-dom";

import "../styles/exam.css";

import ExamHeader from "../components/exam/ExamHeader";
import QuestionCard from "../components/exam/QuestionCard";
import QuestionPalette from "../components/exam/QuestionPalette";
import Navigation from "../components/exam/Navigation";
import Timer from "../components/exam/Timer";
import SubmitModal from "../components/exam/SubmitModal";

import useExam from "../hooks/useExam";
import useExamApi from "../hooks/useExamApi";
import useExamSubmit from "../hooks/useExamSubmit";

function Exam() {

  const { id } = useParams();

  const navigate = useNavigate();

  const {

    currentQuestion,

    answers,

    visitedQuestions,

    markedReview,

    language,

    showSubmitModal,

    setShowSubmitModal,

    setLanguage,

    selectAnswer,

    clearResponse,

    markForReview,

    nextQuestion,

    previousQuestion,

    jumpQuestion,

  } = useExam();

  const {

    loading,

    test,

    questions,

    candidate,

  } = useExamApi(id, navigate);

  const {

    submitExam,

  } = useExamSubmit();

  if (loading) {

    return (

      <div className="examPage">

        <h2
          style={{
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          Loading Exam...
        </h2>

      </div>

    );

  }

  if (!test) {

    return (

      <div className="examPage">

        <h2
          style={{
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          Test Not Found
        </h2>

      </div>

    );

  }

  const question = questions[currentQuestion] || null;

  const answered =
    questions.filter(
      (q) => answers[q._id] !== undefined
    ).length;

  const remaining =
    questions.length - answered;

    if (!question) {

  return (

    <div className="examPage">

      <h2
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        No Questions Found
      </h2>

    </div>

  );

}
  return (

    <div className="examPage">

      <ExamHeader

        title={test.title}

        subject={test.subject}

        contestType={test.contestType || "Mega Challenge"}

        totalQuestions={questions.length}

        candidateName={candidate.fullName}

        rollNumber={candidate.rollNumber}

        language={language}

        setLanguage={setLanguage}

        time={

          <Timer

            minutes={test.duration}

            onTimeUp={() =>

              submitExam(

                id,

                questions,

                answers,

                navigate,

                test

              )

            }

          />

        }

      />

      <div className="examBody">

        <div className="leftPanel">

         

          <QuestionCard

            question={question}

            currentQuestion={currentQuestion}

            totalQuestions={questions.length}

            selectedAnswer={

              answers[question?._id]

            }

            onSelectAnswer={(option) => {

  if (!question) return;

  selectAnswer(question._id, option);

}}

            language={language}

          />
                    <Navigation

            currentQuestion={currentQuestion}

            totalQuestions={questions.length}

            previous={() =>
               previousQuestion(question._id)
}

            next={() =>
             nextQuestion(
              questions.length,
              question._id
  )
            }

            clearResponse={() => {

   if(!question) return;

   clearResponse(question._id);

}}

markForReview={() => {

  if (!question) return;

  markForReview(question._id);

}}
          />

        </div>

        <QuestionPalette

          questions={questions}

          currentQuestion={currentQuestion}

          answers={answers}

          visitedQuestions={visitedQuestions}

          markedReview={markedReview}

          changeQuestion={(index) =>
            jumpQuestion(index, questions[index]._id)
}

          submitExam={() =>
            setShowSubmitModal(true)
          }

          submitting={false}

        />

      </div>

      <SubmitModal

        open={showSubmitModal}

        totalQuestions={questions.length}

        answered={answered}

        review={markedReview.length}

        remaining={remaining}

        submitting={false}

        onCancel={() =>
          setShowSubmitModal(false)
        }

        onSubmit={() =>

          submitExam(

            id,

            questions,

            answers,

            navigate,

            test

          )

        }

      />
          </div>

  );

}

export default Exam;