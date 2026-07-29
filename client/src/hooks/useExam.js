import { useState } from "react";

function useExam() {

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});

  const [markedReview, setMarkedReview] = useState([]);

  const [visitedQuestions, setVisitedQuestions] = useState([]);

  const [language, setLanguage] = useState("english");

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // ===========================
  // Select Answer
  // ===========================

  const selectAnswer = (questionId, option) => {

    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));

    if (!visitedQuestions.includes(questionId)) {
      setVisitedQuestions((prev) => [...prev, questionId]);
    }

  };

  // ===========================
  // Clear Response
  // ===========================

  const clearResponse = (questionId) => {

    setAnswers((prev) => {

      const temp = { ...prev };

      delete temp[questionId];

      return temp;

    });

  };

  // ===========================
  // Mark For Review
  // ===========================

  const markForReview = (questionId) => {

    if (!visitedQuestions.includes(questionId)) {
      setVisitedQuestions((prev) => [...prev, questionId]);
    }

    if (markedReview.includes(questionId)) {

      setMarkedReview((prev) =>
        prev.filter((id) => id !== questionId)
      );

    } else {

      setMarkedReview((prev) => [
        ...prev,
        questionId,
      ]);

    }

  };

  // ===========================
  // Next Question
  // ===========================

  const nextQuestion = (total, questionId) => {

    if (
      questionId &&
      !visitedQuestions.includes(questionId)
    ) {
      setVisitedQuestions((prev) => [
        ...prev,
        questionId,
      ]);
    }

    if (currentQuestion < total - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }

  };

  // ===========================
  // Previous Question
  // ===========================

  const previousQuestion = (questionId) => {

    if (
      questionId &&
      !visitedQuestions.includes(questionId)
    ) {
      setVisitedQuestions((prev) => [
        ...prev,
        questionId,
      ]);
    }

    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }

  };

  // ===========================
  // Jump Question
  // ===========================

  const jumpQuestion = (index, questionId) => {

    if (
      questionId &&
      !visitedQuestions.includes(questionId)
    ) {
      setVisitedQuestions((prev) => [
        ...prev,
        questionId,
      ]);
    }

    setCurrentQuestion(index);

  };

  return {

    currentQuestion,
    setCurrentQuestion,

    answers,

    markedReview,

    visitedQuestions,

    language,
    setLanguage,

    showSubmitModal,
    setShowSubmitModal,

    selectAnswer,

    clearResponse,

    markForReview,

    nextQuestion,

    previousQuestion,

    jumpQuestion,

  };

}

export default useExam;