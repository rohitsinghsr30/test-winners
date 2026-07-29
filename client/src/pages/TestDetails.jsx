import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function TestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTest();
  }, []);

  const loadTest = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setTest(res.data.test);
      }
    } catch (error) {
      console.log(error);
      alert("Unable to load test details.");
    } finally {
      setLoading(false);
    }
  };

  const startExam = () => {
    navigate(`/exam/${id}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2>Loading Test Details...</h2>
      </div>
    );
  }

  if (!test) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2>Test Not Found</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 0 15px rgba(0,0,0,.12)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#0d6efd",
        }}
      >
        TEST WINNERS CBT EXAMINATION
      </h1>

      <hr />

      <h2>{test.title}</h2>

      <p>{test.description}</p>

      <hr />

      <table
        style={{
          width: "100%",
          fontSize: "17px",
          borderSpacing: "10px",
        }}
      >
        <tbody>
          <tr>
            <td><b>Subject</b></td>
            <td>{test.subject}</td>
          </tr>

          <tr>
            <td><b>Total Questions</b></td>
            <td>{test.totalQuestions}</td>
          </tr>

          <tr>
            <td><b>Total Marks</b></td>
            <td>{test.totalMarks}</td>
          </tr>

          <tr>
            <td><b>Duration</b></td>
            <td>{test.duration} Minutes</td>
          </tr>

          <tr>
            <td><b>Entry Fee</b></td>
            <td>₹{test.entryFee}</td>
          </tr>

          <tr>
            <td><b>Prize Pool</b></td>
            <td>₹{test.prizePool}</td>
          </tr>

          <tr>
            <td><b>Negative Marking</b></td>
            <td>-{test.negativeMarking}</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Important Instructions</h2>

      <ul style={{ lineHeight: "32px" }}>
        <li>Read every question carefully before answering.</li>
        <li>Each correct answer carries full marks.</li>
        <li>Negative marking will apply for wrong answers.</li>
        <li>Your answers are saved automatically.</li>
        <li>Do not refresh or close the browser.</li>
        <li>The exam will automatically submit when the timer ends.</li>
        <li>Do not use the browser back button during the exam.</li>
      </ul>

      <div
        style={{
          textAlign: "center",
          marginTop: "35px",
        }}
      >
        <button
          onClick={startExam}
          style={{
            padding: "15px 40px",
            background: "#198754",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}

export default TestDetails;