import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await userService.getUserById(id);
      setUser(response.data.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch user details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }

  if (!user) {
    return <div className="container">User not found</div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>User Details</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '30px' }}>
          <div>
            {user.profile_image ? (
              <img
                src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${user.profile_image}`}
                alt={user.name}
                className="image-preview"
                style={{ width: '200px', height: '200px' }}
              />
            ) : (
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: '#ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: '#666'
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2>{user.name}</h2>
            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>Email:</strong> {user.email}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Phone:</strong> {user.phone}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Role:</strong> {user.role}
              </div>
              {user.address && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Address:</strong> {user.address}
                </div>
              )}
              <div style={{ marginBottom: '15px' }}>
                <strong>State:</strong> {user.state}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>City:</strong> {user.city}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Country:</strong> {user.country}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Pincode:</strong> {user.pincode}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

