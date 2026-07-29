import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/test.css";

function Test() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setTests(res.data.tests || []);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load tests.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchSearch =
        test.title.toLowerCase().includes(search.toLowerCase()) ||
        test.subject.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all"
          ? true
          : test.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [tests, search, statusFilter]);

  if (loading) {
    return (
      <div className="testPage">
        <h2 className="loadingText">Loading Tests...</h2>
      </div>
    );
  }

  return (
    <div className="testPage">

      <div className="testHeader">

        <h1>Available Tests</h1>

        <p>
          Choose a live test and compete for exciting rewards.
        </p>

      </div>

      <div className="testFilters">

        <input
          type="text"
          placeholder="Search by title or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Tests</option>
          <option value="live">Live</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>

      </div>

      {filteredTests.length === 0 ? (

        <div className="noTests">
          <h2>No Tests Found</h2>
        </div>

      ) : (

        <div className="testGrid">

          {filteredTests.map((test) => (

            <div className="testCard" key={test._id}>

              <div className="statusBadge">
                {test.status.toUpperCase()}
              </div>

              <h2>{test.title}</h2>

              <p>{test.description}</p>

              <div className="testInfo">

                <div>
                  <strong>Subject</strong>
                  <span>{test.subject}</span>
                </div>

                <div>
                  <strong>Duration</strong>
                  <span>{test.duration} Min</span>
                </div>

                <div>
                  <strong>Questions</strong>
                  <span>{test.totalQuestions}</span>
                </div>

                <div>
                  <strong>Marks</strong>
                  <span>{test.totalMarks}</span>
                </div>

                <div>
                  <strong>Entry Fee</strong>
                  <span>₹{test.entryFee}</span>
                </div>

                <div>
                  <strong>Prize Pool</strong>
                  <span>₹{test.prizePool}</span>
                </div>

              </div>

              <div className="testButtons">

                <Link to={`/test/${test._id}`}>
                  <button className="detailsBtn">
                    View Details
                  </button>
                </Link>

                {test.status === "live" && (
                  <Link to={`/exam/${test._id}`}>
                    <button className="startBtn">
                      Start Test
                    </button>
                  </Link>
                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Test;