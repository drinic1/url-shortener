import styles from "./ErrorModal.module.css";

interface Props {
  header?: string;
  message: string;
  buttonText?: string;
  onClicked: () => void;
}

const ErrorModal = ({ header, message, buttonText, onClicked }: Props) => {
  return (
    <div className={styles.formContent}>
      <div className={styles.header}>{header}</div>
      <div className={styles.message}>{message}</div>
      <button className="btn btnPrimary" onClick={onClicked}>
        {buttonText || "OK"}
      </button>
    </div>
  );
};

export default ErrorModal;
