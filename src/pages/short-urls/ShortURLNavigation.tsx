import Button from "@/components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";

function ShortURLNavigation() {
  const navigate = useNavigate();

  const location = useLocation();

  const activeClasses = "bg-blue-200 text-blue-500 hover:bg-blue-200";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button variant="secondary" className={location.pathname === "/short-urls" ? activeClasses : ""} onClick={() => navigate("/short-urls")}>
        Short Urls
      </Button>
      <Button variant="secondary" className={location.pathname === "/analyze-pack" ? activeClasses : ""} onClick={() => navigate("/analyze-pack")}>
        Analyze Packs
      </Button>
      <Button variant="secondary" className={location.pathname === "/pre-configured-level" ? activeClasses : ""} onClick={() => navigate("/pre-configured-level")}>
        Pre-configured Levels
      </Button>
    </div>
  );
}

export default ShortURLNavigation;
