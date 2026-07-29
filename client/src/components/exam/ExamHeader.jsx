import { useEffect, useState } from "react";

function ExamHeader({
  title,
  subject,
  contestType,
  totalQuestions,
  candidateName,
  rollNumber,
  time,
  language,
  setLanguage,
}) {

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {

      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );

    };

  }, []);

  const toggleFullscreen = async () => {

    try {

      if (!document.fullscreenElement) {

        await document.documentElement.requestFullscreen();

      } else {

        await document.exitFullscreen();

      }

    } catch (error) {

      console.error("Fullscreen Error:", error);

    }

  };

  return (

    <header className="examHeader">

      <div className="headerLeft">

        <h2>🏆 TEST WINNERS</h2>

        <h3>{title}</h3>

        <p>
          <strong>Subject :</strong> {subject}
        </p>

        <p>
          <strong>Contest :</strong> {contestType}
        </p>

      </div>

      <div className="headerCenter">

        <p>
          <strong>Candidate :</strong> {candidateName}
        </p>

        <p>
          <strong>Roll No :</strong> {rollNumber}
        </p>

        <p>
          <strong>Total Questions :</strong> {totalQuestions}
        </p>

      </div>

      <div className="headerRight">

        <div className="languageBox">

          <label>Language</label>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
          >
            <option value="english">
              English
            </option>

            <option value="hindi">
              हिन्दी
            </option>

          </select>

        </div>

        <div className="timerBox">

          {time}

        </div>

        <button
          className="fullscreenBtn"
          onClick={toggleFullscreen}
        >
          {isFullscreen
            ? "Exit Full Screen"
            : "Full Screen"}
        </button>

      </div>

    </header>

  );

}

export default ExamHeader;