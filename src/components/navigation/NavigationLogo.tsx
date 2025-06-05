
import { Link } from "react-router-dom";

interface NavigationLogoProps {
  onLogoClick: () => void;
}

const NavigationLogo = ({ onLogoClick }: NavigationLogoProps) => {
  return (
    <Link to="/" className="flex items-center space-x-2" onClick={onLogoClick}>
      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">F</span>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        FirstLook
      </span>
    </Link>
  );
};

export default NavigationLogo;
