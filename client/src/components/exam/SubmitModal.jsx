function SubmitModal({
  open,
  totalQuestions,
  answered,
  review,
  remaining,
  onCancel,
  onSubmit,
  submitting,
}) {

  if (!open) return null;

  return (

    <div className="submitModalOverlay">

      <div className="submitModal">

        <h2>Submit Test</h2>

        <p>
          Are you sure you want to submit your test?
        </p>

        <div className="submitSummary">

          <div>
            <strong>Total Questions</strong>
            <span>{totalQuestions}</span>
          </div>

          <div>
            <strong>Answered</strong>
            <span>{answered}</span>
          </div>

          <div>
            <strong>Marked Review</strong>
            <span>{review}</span>
          </div>

          <div>
            <strong>Remaining</strong>
            <span>{remaining}</span>
          </div>

        </div>

        <div className="submitButtons">

          <button
            className="cancelBtn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="confirmSubmitBtn"
            disabled={submitting}
            onClick={onSubmit}
          >
            {submitting
              ? "Submitting..."
              : "Submit Test"}
          </button>

        </div>

      </div>

    </div>

  );

}

export default SubmitModal;