import { JwtPayload, jwtDecode } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  email: string;
  sub: string;
  role: string;
  aud: string;
  id?: string; // Maps to sub for backward compatibility
}

class AuthService {
  getProfile() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      // Map sub to id for backward compatibility
      const profile = {
        ...decoded,
        id: decoded.sub
      };
      console.log('Decoded token:', profile); // Debug log
      return profile;
    } catch (err) {
      console.error('Error decoding token:', err); // Debug log
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<CustomJwtPayload & { exp: number }>(token);
      const isValid = !this.isTokenExpired(token);
      console.log('Token validation:', { decoded, isValid }); // Debug log
      return isValid;
    } catch (err) {
      console.error('Error checking login status:', err); // Debug log
      return false;
    }
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<CustomJwtPayload & { exp: number }>(token);
      const isExpired = decoded.exp < Date.now() / 1000;
      if (isExpired) {
        localStorage.removeItem('token');
      }
      return isExpired;
    } catch (err) {
      console.error('Error checking token expiration:', err); // Debug log
      return true;
    }
  }

  getToken(): string {
    const token = localStorage.getItem('token') || '';
    console.log('Retrieved token:', token ? 'exists' : 'none'); // Debug log
    return token;
  }

  login(token: string) {
    console.log('Setting token:', token ? 'exists' : 'none'); // Debug log
    localStorage.setItem('token', token);
    window.location.assign('/board');
  }

  logout() {
    console.log('Removing token'); // Debug log
    localStorage.removeItem('token');
    window.location.assign('/');
  }
}

export default new AuthService();
