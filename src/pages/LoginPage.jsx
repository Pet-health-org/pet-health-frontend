import React, { useState } from 'react';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Card from '../components/Card/Card';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simular petición
    setTimeout(() => {
      console.log('Login:', { email, password, rememberMe });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">🐾</div>
          <h1>Pet-Health</h1>
          <p>Accede a tu cuenta</p>
        </div>

        <Card className="login-card" padding="lg">
          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Recuérdame</span>
              </label>
              <a href="#forgot" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="login-divider">o</div>

          <div className="login-social">
            <button className="social-btn google-btn">
              Google
            </button>
            <button className="social-btn facebook-btn">
              Facebook
            </button>
          </div>

          <p className="login-footer">
            ¿No tienes cuenta? <a href="#register">Regístrate aquí</a>
          </p>
        </Card>
      </div>

      <div className="login-side">
        <div className="login-side-content">
          <h2>Bienvenido a Pet-Health</h2>
          <p>Accede a tu cuenta para agendar citas, ver historial médico de tu mascota y más.</p>
          <ul className="login-benefits">
            <li>✓ Agendamiento de citas</li>
            <li>✓ Historial médico</li>
            <li>✓ Recordatorios automáticos</li>
            <li>✓ Soporte prioritario</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
