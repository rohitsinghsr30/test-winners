import { useEffect, useState } from "react";
import axios from "axios";

function useExamApi(testId, navigate) {

  const [loading, setLoading] = useState(true);

  const [test, setTest] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [candidate, setCandidate] = useState({
    fullName: "",
    rollNumber: "",
  });

  useEffect(() => {

    loadExam();

  }, [testId]);

  const loadExam = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {

        navigate("/login");

        return;

      }

      const [testRes, userRes] = await Promise.all([

        axios.get(
          `${import.meta.env.VITE_API_URL}/api/tests/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

        axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

      ]);

      setTest(testRes.data.test);

      setQuestions(testRes.data.questions || []);

      setCandidate({

        fullName: userRes.data.user.fullName,

        rollNumber:
          userRes.data.user._id
            .slice(-6)
            .toUpperCase(),

      });

    } catch (error) {

      console.error(error);

      alert("Unable to load exam.");

      navigate("/test");

    } finally {

      setLoading(false);

    }

  };

  return {

    loading,

    test,

    questions,

    candidate,

  };

}

export default useExamApi;