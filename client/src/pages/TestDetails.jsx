import { useParams, useNavigate } from "react-router-dom";

function TestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const startExam = () => {
    navigate(`/exam/${id}`);
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,.15)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#0d6efd" }}>
        TEST WINNERS CBT Examination
      </h1>

      <hr />

      <h2>Instructions</h2>

      <ul style={{ lineHeight: "35px", fontSize: "18px" }}>
        <li>Total Questions : <b>100</b></li>
        <li>Total Marks : <b>100</b></li>
        <li>Duration : <b>180 Minutes</b></li>
        <li>Each Correct Answer : <b>+1 Mark</b></li>
        <li>Negative Marking : <b>-0.25</b></li>
        <li>Do not refresh the browser.</li>
        <li>Do not press Back button.</li>
        <li>Internet connection should remain active.</li>
        <li>Your answers will be auto saved.</li>
        <li>Exam will auto submit when timer becomes zero.</li>
      </ul>

      <hr />

      <h3>Test ID</h3>

      <p>{id}</p>

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
        }}
      >
        <button
          onClick={startExam}
          style={{
            padding: "15px 40px",
            fontSize: "18px",
            border: "none",
            background: "#198754",
            color: "#fff",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}

export default TestDetails;