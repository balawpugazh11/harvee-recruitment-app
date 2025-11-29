import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';
import EditUserModal from '../components/EditUserModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    city: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [editModal, setEditModal] = useState({ open: false, user: null });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(filters);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleSort = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await userService.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleEdit = (userData) => {
    setEditModal({ open: true, user: userData });
  };

  const handleCloseEditModal = () => {
    setEditModal({ open: false, user: null });
  };

  const handleUserUpdated = () => {
    fetchUsers();
    handleCloseEditModal();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>User Management Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name} ({user?.role})</span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="search-filters">
        <input
          type="text"
          name="search"
          placeholder="Search by name, email, state, or city..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="state"
          placeholder="Filter by state..."
          value={filters.state}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="city"
          placeholder="Filter by city..."
          value={filters.city}
          onChange={handleFilterChange}
        />
        <select
          name="limit"
          value={filters.limit}
          onChange={handleFilterChange}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Name {filters.sortBy === 'name' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                    Email {filters.sortBy === 'email' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Phone</th>
                  <th onClick={() => handleSort('state')} style={{ cursor: 'pointer' }}>
                    State {filters.sortBy === 'state' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('city')} style={{ cursor: 'pointer' }}>
                    City {filters.sortBy === 'city' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                    Created {filters.sortBy === 'createdAt' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {user.profile_image ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${user.profile_image}`}
                              alt={user.name}
                              className="image-preview"
                              style={{ width: '40px', height: '40px' }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#666'
                              }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.state}</td>
                      <td>{user.city}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="user-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/user/${user._id}`)}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleEdit(user)}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(user._id, user.name)}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              {[...Array(pagination.pages)].map((_, index) => {
                const page = index + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === pagination.pages ||
                  (page >= pagination.page - 1 && page <= pagination.page + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={pagination.page === page ? 'active' : ''}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === pagination.page - 2 ||
                  page === pagination.page + 2
                ) {
                  return <span key={page}>...</span>;
                }
                return null;
              })}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
            Showing {users.length} of {pagination.total} users
          </div>
        </>
      )}

      {editModal.open && (
        <EditUserModal
          user={editModal.user}
          onClose={handleCloseEditModal}
          onUpdate={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default Dashboard;

