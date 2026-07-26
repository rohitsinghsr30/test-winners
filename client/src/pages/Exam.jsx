import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "../styles/exam.css";

import ExamHeader from "../components/exam/ExamHeader";
import Timer from "../components/exam/Timer";
import QuestionCard from "../components/exam/QuestionCard";
import QuestionPalette from "../components/exam/QuestionPalette";
import Navigation from "../components/exam/Navigation";

function Exam() {
  const { id } = useParams();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExam();
  }, []);

  const loadExam = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      console.log("Loading Exam ID :", id);
      console.log("API :", `${import.meta.env.VITE_API_URL}/api/tests/${id}`);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Exam Response :", response.data);

      if (response.data.success) {
        setTest(response.data.test);
        setQuestions(response.data.questions || []);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("=========== EXAM ERROR ===========");

      if (error.response) {
        console.log("Status :", error.response.status);
        console.log("Data :", error.response.data);
        alert(error.response.data.message || "Unable to load exam.");
      } else if (error.request) {
        console.log("Request :", error.request);
        alert("Server is not responding.");
      } else {
        console.log("Message :", error.message);
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const submitExam = () => {
    console.log("Answers :", answers);
    alert("Submit API will be connected next.");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Loading Exam...</h2>
      </div>
    );
  }

  if (!test) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Test Not Found</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>No Questions Available</h2>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="examPage">
      <ExamHeader
        title={test.title}
        subject={test.subject}
        time={<Timer minutes={test.duration} />}
      />

      <div className="examBody">
        <div style={{ flex: 3 }}>
          <QuestionCard
            question={question}
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentQuestion]}
            onSelectAnswer={handleSelectAnswer}
          />

          <Navigation
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            previous={previousQuestion}
            next={nextQuestion}
          />
        </div>

        <QuestionPalette
          questions={questions}
          currentQuestion={currentQuestion}
          answers={answers}
          changeQuestion={jumpToQuestion}
          submitExam={submitExam}
        />
      </div>
    </div>
  );
}

export default Exam;