import styles from "./TWButton.module.css";

function TWButton({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
}) {
  const className = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
  `;

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default TWButton;