import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Test() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTests(res.data.tests);
    } catch (error) {
      console.log(error);
      alert("Failed to load tests.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Loading Tests...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "25px" }}>Available Tests</h1>

      {tests.length === 0 ? (
        <h3>No Tests Available</h3>
      ) : (
        tests.map((test) => (
          <div
            key={test._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>{test.title}</h2>

            <p>{test.description}</p>

            <hr />

            <p>
              <strong>Subject :</strong> {test.subject}
            </p>

            <p>
              <strong>Duration :</strong> {test.duration} Minutes
            </p>

            <p>
              <strong>Total Questions :</strong> {test.totalQuestions}
            </p>

            <p>
              <strong>Total Marks :</strong> {test.totalMarks}
            </p>

            <p>
              <strong>Negative Marking :</strong> -{test.negativeMarking}
            </p>

            <p>
              <strong>Entry Fee :</strong> ₹{test.entryFee}
            </p>

            <p>
              <strong>Prize Pool :</strong> ₹{test.prizePool}
            </p>

            <p>
              <strong>Status :</strong> {test.status}
            </p>

            <br />

            <Link to={`/test/${test._id}`}>
              <button
                style={{
                  background: "#0d6efd",
                  color: "#fff",
                  border: "none",
                  padding: "10px 25px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Start Test
              </button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Test;