import axios from "axios";

function useExamSubmit() {

  const submitExam = async (
    testId,
    questions,
    answers,
    navigate,
    test
  ) => {

    try {

      const token = localStorage.getItem("token");

      const formattedAnswers = {};

      questions.forEach((question) => {

        if (
          answers[question._id] !== undefined
        ) {

          formattedAnswers[
            question._id
          ] = answers[question._id];

        }

      });

      const res = await axios.post(

        `${import.meta.env.VITE_API_URL}/api/tests/${testId}/submit`,

        {
          answers: formattedAnswers,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      navigate("/result", {

        replace: true,

        state: {

          result: res.data.result,

          test,

          totalQuestions:
            questions.length,

        },

      });

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to submit test."
      );

    }

  };

  return {

    submitExam,

  };

}

export default useExamSubmit;