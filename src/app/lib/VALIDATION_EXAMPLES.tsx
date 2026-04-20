/**
 * LERNOVA - FORM VALIDATION INTEGRATION EXAMPLES
 * 
 * This file shows how to use the validators.ts file in your React forms
 * Copy these patterns to all your form components
 */

import React, { useState } from 'react';
import {
  LoginSchema,
  SignUpSchema,
  CreateRoomSchema,
  SendMessageSchema,
  validateForm,
  checkPasswordStrength,
  type LoginFormData,
  type SignUpFormData,
  type CreateRoomFormData,
  type SendMessageFormData,
} from '@/app/lib/validators';

// ═════════════════════════════════════════════════════════════════════════════
// EXAMPLE 1: LOGIN FORM WITH VALIDATION
// ═════════════════════════════════════════════════════════════════════════════

export function LoginFormExample() {
  const [formData, setFormData] = useState({
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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ VALIDATE BEFORE SUBMITTING
    const { valid, errors: validationErrors, data } = validateForm(
      LoginSchema,
      formData
    );

    if (!valid) {
      setErrors(validationErrors || {});
      setIsSubmitting(false);
      return;
    }

    try {
      // ✅ CALL API WITH VALIDATED DATA
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors({ _form: error.detail || 'Login failed' });
        return;
      }

      // ✅ SUCCESS - REDIRECT OR UPDATE STATE
      const result = await response.json();
      localStorage.setItem('token', result.token);
      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({ _form: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form error */}
      {errors._form && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {errors._form}
        </div>
      )}

      {/* Email field */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="user@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password field */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EXAMPLE 2: SIGNUP FORM WITH PASSWORD STRENGTH INDICATOR
// ═════════════════════════════════════════════════════════════════════════════

export function SignUpFormExample() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'student' as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ✅ SHOW PASSWORD STRENGTH IN REAL-TIME
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Clear error when user edits
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { valid, errors: validationErrors, data } = validateForm(
      SignUpSchema,
      formData
    );

    if (!valid) {
      setErrors(validationErrors || {});
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors({ _form: error.detail || 'Signup failed' });
        return;
      }

      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({ _form: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors._form && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {errors._form}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.fullName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="user@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password with strength indicator */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}

        {/* ✅ PASSWORD STRENGTH INDICATOR */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded ${
                    i < passwordStrength.score
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            {passwordStrength.feedback.length > 0 && (
              <ul className="text-xs text-gray-600 space-y-1">
                {passwordStrength.feedback.map((msg, i) => (
                  <li key={i}>• {msg}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">I am a:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EXAMPLE 3: CREATE ROOM FORM WITH VALIDATION
// ═════════════════════════════════════════════════════════════════════════════

export function CreateRoomFormExample() {
  const [formData, setFormData] = useState({
    roomName: '',
    topic: '',
    maxParticipants: 10,
    description: '',
    roomMode: 'collaborative' as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { valid, errors: validationErrors, data } = validateForm(
      CreateRoomSchema,
      formData
    );

    if (!valid) {
      setErrors(validationErrors || {});
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors({ _form: error.detail || 'Failed to create room' });
        return;
      }

      const result = await response.json();
      window.location.href = `/room/${result.room_id}`;
    } catch (error) {
      setErrors({ _form: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors._form && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {errors._form}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Room Name</label>
        <input
          type="text"
          name="roomName"
          value={formData.roomName}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.roomName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="My Study Group"
        />
        {errors.roomName && (
          <p className="text-red-500 text-sm mt-1">{errors.roomName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Topic</label>
        <input
          type="text"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Math, Programming, Languages..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Max Participants
        </label>
        <input
          type="number"
          name="maxParticipants"
          value={formData.maxParticipants}
          onChange={handleChange}
          min="2"
          max="50"
          className={`w-full px-3 py-2 border rounded ${
            errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.maxParticipants && (
          <p className="text-red-500 text-sm mt-1">{errors.maxParticipants}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Room Mode</label>
        <select
          name="roomMode"
          value={formData.roomMode}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="focus">Focus Mode</option>
          <option value="collaborative">Collaborative</option>
          <option value="silent">Silent</option>
          <option value="live">Live</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          rows={4}
          placeholder="Tell others what this room is about..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating Room...' : 'Create Room'}
      </button>
    </form>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EXAMPLE 4: SEND MESSAGE WITH VALIDATION
// ═════════════════════════════════════════════════════════════════════════════

export function ChatInputExample({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { valid, errors: validationErrors, data } = validateForm(
      SendMessageSchema,
      { content: message, roomId }
    );

    if (!valid) {
      setError(validationErrors?.content || 'Invalid message');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/rooms/${roomId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.detail || 'Failed to send message');
        return;
      }

      setMessage('');
      setError('');
    } catch (error) {
      setError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (error) setError('');
        }}
        placeholder="Type a message..."
        className={`flex-1 px-3 py-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      <button
        type="submit"
        disabled={isSubmitting || !message.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Send
      </button>
      {error && <p className="text-red-500 text-sm absolute -bottom-6">{error}</p>}
    </form>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// KEY TAKEAWAYS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * ✅ VALIDATION BEST PRACTICES:
 * 
 * 1. Import the schema and validateForm function
 * 2. Call validateForm() before submitting to API
 * 3. Display field-specific errors to the user
 * 4. Show password strength for password inputs
 * 5. Clear errors when user starts typing
 * 6. Include Authorization header for protected endpoints
 * 7. Always include try-catch for network errors
 * 
 * ✅ ERROR HANDLING:
 * 
 * 1. Validation errors: Show under the field
 * 2. Server errors (4xx): Show in error banner
 * 3. Network errors: Show user-friendly message
 * 4. Disabled button state: Prevent double-submit
 * 
 * ✅ UX IMPROVEMENTS:
 * 
 * 1. Real-time validation as user types
 * 2. Clear error messages (not technical jargon)
 * 3. Password strength indicator
 * 4. Loading state during submission
 * 5. Success feedback (redirect or toast)
 */
