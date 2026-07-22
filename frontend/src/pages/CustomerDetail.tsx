import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  businessName: string;
  gstNumber: string;
  type: string;
  address: string;
  status: string;
  notes: string;
}

interface FollowUp {
  id: string;
  notes: string;
  followUpDate: string;
  isCompleted: boolean;
  createdAt: string;
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({
    notes: '',
    followUpDate: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});

  useEffect(() => {
    if (id) fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/customers/${id}`);
      setCustomer(response.data.customer);
      setEditForm(response.data.customer);
      setFollowUps(response.data.customer.followUps || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/customers/${id}/follow-ups`, followUpForm);
      setFollowUpForm({ notes: '', followUpDate: '' });
      setShowFollowUpForm(false);
      fetchCustomer();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add follow-up');
    }
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/customers/${id}`, editForm);
      setCustomer(editForm as Customer);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update customer');
    }
  };

  if (isLoading) {
    return <div className="spinner"><div className="spinner-border"></div></div>;
  }

  if (!customer) {
    return <div className="alert alert-danger">Customer not found</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Customer Details</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/customers')}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Customer Information</h5>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className="card-body">
              {isEditing ? (
                <form onSubmit={handleUpdateCustomer}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Mobile</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={editForm.mobileNumber || ''}
                        onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.businessName || ''}
                        onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              ) : (
                <div>
                  <p><strong>Name:</strong> {customer.name}</p>
                  <p><strong>Email:</strong> {customer.email}</p>
                  <p><strong>Mobile:</strong> {customer.mobileNumber}</p>
                  <p><strong>Business Name:</strong> {customer.businessName}</p>
                  <p><strong>GST Number:</strong> {customer.gstNumber || 'N/A'}</p>
                  <p><strong>Type:</strong> <span className="badge bg-info">{customer.type}</span></p>
                  <p><strong>Address:</strong> {customer.address}</p>
                  <p><strong>Status:</strong> <span className={`badge bg-${customer.status === 'active' ? 'success' : customer.status === 'lead' ? 'warning' : 'danger'}`}>{customer.status}</span></p>
                  <p><strong>Notes:</strong> {customer.notes || 'N/A'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Follow-ups</h5>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowFollowUpForm(!showFollowUpForm)}
              >
                <i className="bi bi-plus"></i> Add
              </button>
            </div>
            <div className="card-body">
              {showFollowUpForm && (
                <form onSubmit={handleAddFollowUp} className="mb-3">
                  <div className="mb-2">
                    <textarea
                      className="form-control form-control-sm"
                      placeholder="Follow-up notes"
                      value={followUpForm.notes}
                      onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={followUpForm.followUpDate}
                      onChange={(e) => setFollowUpForm({ ...followUpForm, followUpDate: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-sm btn-primary">Save</button>
                </form>
              )}

              {followUps.length === 0 ? (
                <p className="text-muted">No follow-ups yet</p>
              ) : (
                <div className="list-group">
                  {followUps.map((followUp) => (
                    <div key={followUp.id} className="list-group-item">
                      <p className="mb-1">{followUp.notes}</p>
                      <small className="text-muted">{new Date(followUp.createdAt).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
