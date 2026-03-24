import { CodeXml, Github, Linkedin } from "lucide-react";
import { Link } from "react-router";
import img from "../assets/images/Logo.png";

const Footer = () => {
  return (
 
      <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded pb-4 relative w-full bottom-0 mt-10">
        <nav>
          <Link
              to={"/"}
            className="flex font-bold text-2xl items-center gap-1 "
          >
            <img src={img} alt="Logo SameWay" className="h-10" />
            SameWay
            
          </Link>
          <div className="flex flex-row gap-4 mt-2">
            <a
              href="https://www.linkedin.com/in/nicolas-deteh-b88571374"
              target="_blank"
            >
              <Linkedin />
            </a>
            <a href="https://github.com/nicostar-lab" target="_blank">
              <Github />
            </a>
          </div>
        </nav>
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            SameWay Team.
          </p>
        </aside>
      </footer>
    
  );
};

export default Footer;
