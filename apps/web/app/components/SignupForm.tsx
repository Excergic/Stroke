"use client";
import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { CreateUserSchema } from '@repo/common/types'; // Adjust path as needed

interface SignupFormProps {
  onSuccess?: () => void;
  toggleForm?: () => void;
}

export default function SignupForm({ onSuccess, toggleForm }: SignupFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
      const validatedData = CreateUserSchema.parse(formData);
      console.log('Form submitted with:', validatedData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/canvas');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ form: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (onSuccess) {
      onSuccess(); // Closes the modal in the landing page context
    } else {
      router.push('/'); // Redirects to homepage in standalone context
    }
  };

  return (
    <div className="form-container">
      <button onClick={handleClose} className="form-close" aria-label="Close form">
        ✕
      </button>
      <h2 className="form-title">Create your account</h2>
      <p className="form-description">Sign up to start creating amazing artwork</p>

      {errors.form && <div className="form-error">{errors.form}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <div className="form-input-wrapper">
            <User className="form-icon" />
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="artistname"
            />
          </div>
          {errors.username && <p className="form-error-message">{errors.username}</p>}
          <p className="form-hint">Must be between 3-50 characters</p>
        </div>

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
          <p className="form-hint">Must be between 8-50 characters</p>
        </div>

        <button type="submit" disabled={isSubmitting} className="form-button">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {toggleForm ? (
        <p className="form-footer">
          Already have an account?{' '}
          <button onClick={toggleForm} className="form-footer-link">
            Log in
          </button>
        </p>
      ) : (
        <p className="form-footer">
          Already have an account?{' '}
          <a href="/login" className="form-footer-link">
            Log in
          </a>
        </p>
      )}
    </div>
  );
}