import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    profile_image: null
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'profile_image') {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
          setErrors({
            ...errors,
            profile_image: 'Only JPG and PNG images are allowed'
          });
          return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
          setErrors({
            ...errors,
            profile_image: 'Image size must be less than 2MB'
          });
          return;
        }

        setFormData({
          ...formData,
          profile_image: file
        });

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        if (errors.profile_image) {
          setErrors({
            ...errors,
            profile_image: ''
          });
        }
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });

      if (errors[e.target.name]) {
        setErrors({
          ...errors,
          [e.target.name]: ''
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only alphabets';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10-15 digits';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Address validation
    if (formData.address && formData.address.length > 150) {
      newErrors.address = 'Address must not exceed 150 characters';
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    // Pincode validation
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{4,10}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 4-10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData for multipart/form-data
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword' && formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      const result = await register(data);

      if (result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => {
            toast.error(error.msg || error.message);
          });
        } else {
          toast.error(result.message || 'Registration failed');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min 6 chars with number)"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address (optional, max 150 chars)"
              rows="3"
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
            />
            {errors.state && <div className="error-message">{errors.state}</div>}
          </div>

          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
            {errors.city && <div className="error-message">{errors.city}</div>}
          </div>

          <div className="form-group">
            <label>Country *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
            />
            {errors.country && <div className="error-message">{errors.country}</div>}
          </div>

          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode (4-10 digits)"
            />
            {errors.pincode && <div className="error-message">{errors.pincode}</div>}
          </div>

          <div className="form-group">
            <label>Profile Image (JPG/PNG, max 2MB)</label>
            <div className="image-upload">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
              <input
                type="file"
                id="profile_image"
                name="profile_image"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleChange}
              />
              <label htmlFor="profile_image">Choose Image</label>
            </div>
            {errors.profile_image && <div className="error-message">{errors.profile_image}</div>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

