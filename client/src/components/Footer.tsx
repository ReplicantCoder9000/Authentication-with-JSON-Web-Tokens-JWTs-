const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            © {currentYear} Krazy Kanban Board. All rights reserved.
          </div>
          <div className="footer-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="mx-2">
              GitHub
            </a>
            <span className="mx-2">•</span>
            <a href="#" className="mx-2">Terms</a>
            <span className="mx-2">•</span>
            <a href="#" className="mx-2">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
