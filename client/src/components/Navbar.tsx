import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auth from '../utils/auth';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(auth.loggedIn());
  }, []);

  const handleLogout = () => {
    auth.logout();
    setIsLoggedIn(false);
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <div className="nav-title">
            <span className="fade-in">Krazy Kanban Board</span>
          </div>
          <ul className="nav-items">
            {!isLoggedIn ? (
              <li>
                <Link to="/">
                  <button className="btn-primary slide-in">
                    Login
                  </button>
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/create">
                    <button className="btn-secondary slide-in">
                      New Ticket
                    </button>
                  </Link>
                </li>
                <li>
                  <button 
                    className="btn-primary slide-in"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
