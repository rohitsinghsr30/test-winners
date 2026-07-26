function ExamHeader({ title, subject, time }) {
  return (
    <div className="examHeader">

      <div>
        <h2>{title}</h2>
        <p>Subject : {subject}</p>
      </div>

      <div className="timerBox">
        <h2>{time}</h2>
      </div>

    </div>
  );
}

export default ExamHeader;