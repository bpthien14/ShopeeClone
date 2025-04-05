import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Có lỗi xảy ra khi đăng nhập');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng nhập</h2>
        {error && (
          <div className="error-message">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu của bạn"
            />
          </div>
          <button type="submit" className="submit-button">
            Đăng nhập
          </button>
        </form>
        <div className="register-link">
          <a href="/register">Chưa có tài khoản? Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
}; 