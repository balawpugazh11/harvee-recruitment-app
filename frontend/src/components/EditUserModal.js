import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';

const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        state: user.state || '',
        city: user.city || '',
        country: user.country || '',
        pincode: user.pincode || '',
        profile_image: null
      });
      if (user.profile_image) {
        setImagePreview(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${user.profile_image}`);
      }
    }
  }, [user]);

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

    if (formData.name && formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (formData.name && !/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only alphabets';
    }

    if (formData.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10-15 digits';
    }

    if (formData.address && formData.address.length > 150) {
      newErrors.address = 'Address must not exceed 150 characters';
    }

    if (formData.pincode && !/^\d{4,10}$/.test(formData.pincode)) {
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
        if (formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      await userService.updateUser(user._id, data);
      toast.success('User updated successfully');
      onUpdate();
    } catch (error) {
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        error.response.data.errors.forEach(err => {
          toast.error(err.msg || err.message);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to update user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit User</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
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
                id="profile_image_edit"
                name="profile_image"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleChange}
              />
              <label htmlFor="profile_image_edit">Change Image</label>
            </div>
            {errors.profile_image && <div className="error-message">{errors.profile_image}</div>}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update User'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;

