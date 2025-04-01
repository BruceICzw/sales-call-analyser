
import { Link } from "react-router-dom";
import { Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 py-8">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Sales Call Analyzer</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Get expert-level feedback on your sales calls and improve your closing rate with our AI-powered analysis.
          </p>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/history" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Analysis History
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Connect</h3>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Github">
              <Github size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mt-8 pt-6 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
      </div>
    </footer>
  );
};

export default Footer;
