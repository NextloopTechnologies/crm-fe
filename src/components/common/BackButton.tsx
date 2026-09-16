import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  path: string;
  label?: string;
  icon?: React.ReactNode;
}

const defaultIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const BackButton = ({ path, label = "Back to list", icon = defaultIcon }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="flex mt-[-10px] mb-4 items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
};

export default BackButton;