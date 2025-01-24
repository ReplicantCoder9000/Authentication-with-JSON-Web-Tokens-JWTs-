import { JwtPayload, jwtDecode } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  username: string;
  id: number;
}

class AuthService {
  getProfile() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      console.log('Decoded token:', decoded); // Debug log
      return decoded;
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
        localStorage.removeItem('id_token');
      }
      return isExpired;
    } catch (err) {
      console.error('Error checking token expiration:', err); // Debug log
      return true;
    }
  }

  getToken(): string {
    const token = localStorage.getItem('id_token') || '';
    console.log('Retrieved token:', token ? 'exists' : 'none'); // Debug log
    return token;
  }

  login(idToken: string) {
    console.log('Setting token:', idToken ? 'exists' : 'none'); // Debug log
    localStorage.setItem('id_token', idToken);
    window.location.assign('/board');
  }

  logout() {
    console.log('Removing token'); // Debug log
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
