import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6 space-y-4 md:space-y-0">
        <div className="text-sm text-muted-foreground">
          © {year} Sales Call Analyzer. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link
            to="#"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="#"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            to="#"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;