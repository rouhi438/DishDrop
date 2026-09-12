import { useNavigate } from "react-router-dom";
import "../../styles/add.css";

export default function BackButton({ to }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="back-btn"
      onClick={() => navigate(to)}
      aria-label="Go back"
    >
      <i className="fa-solid fa-arrow-left" aria-hidden="true" />
      <span>Back</span>
    </button>
  );
}
