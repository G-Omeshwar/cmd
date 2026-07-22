import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  businessName: string;
  type: string;
  status: string;
  createdAt: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    businessName: '',
    gstNumber: '',
    type: 'retail',
    address: '',
    notes: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/customers', {
        params: { page, search, limit: 10 },
      });
      setCustomers(response.data.customers);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/customers', formData);
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        mobileNumber: '',
        businessName: '',
        gstNumber: '',
        type: 'retail',
        address: '',
        notes: '',
      });
      fetchCustomers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add customer');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading && customers.length === 0) {
    return <div className="spinner"><div className="spinner-border"></div></div>;
  }

  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Customers</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="bi bi-plus"></i> Add Customer
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleAddCustomer}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">GST Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="distributor">Distributor</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Customer</button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {customers.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>No customers found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Business</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.mobileNumber}</td>
                      <td>{customer.businessName}</td>
                      <td>
                        <span className="badge bg-info">{customer.type}</span>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${customer.status === 'active' ? 'success' : customer.status === 'lead' ? 'warning' : 'danger'}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/customers/${customer.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
