import { useNavigate } from "react-router-dom";
import "../../styles/add.css";

export default function BackButton({ to }) {
  const navigate = useNavigate();
  return (
    <span className="back-btn" onClick={() => navigate(to)}>
      <i className="fa-solid fa-arrow-left"></i>
    </span>
  );
}
