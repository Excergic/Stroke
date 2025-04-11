"use client";
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  onSuccess?: () => void;
  toggleForm?: () => void;
}

export default function LoginForm({ onSuccess, toggleForm }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Login with:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/canvas');
      }
    } catch (error) {
      setErrors({ form: 'Invalid email or password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (onSuccess) {
      onSuccess(); 
    } else {
      router.push('/'); 
    }
  };

  return (
    <div className="form-container">
      <button onClick={handleClose} className="form-close" aria-label="Close form">
        ✕
      </button>
      <h2 className="form-title">Log in to your account</h2>
      <p className="form-description">Welcome back! Please enter your details.</p>

      {errors.form && <div className="form-error">{errors.form}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <div className="form-input-wrapper">
            <Mail className="form-icon" />
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="form-error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="form-input-wrapper">
            <Lock className="form-icon" />
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="form-error-message">{errors.password}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="form-button">
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      {toggleForm ? (
        <p className="form-footer">
          Don’t have an account?{' '}
          <button onClick={toggleForm} className="form-footer-link">
            Sign up
          </button>
        </p>
      ) : (
        <p className="form-footer">
          Don’t have an account?{' '}
          <a href="/signup" className="form-footer-link">
            Sign up
          </a>
        </p>
      )}
    </div>
  );
}