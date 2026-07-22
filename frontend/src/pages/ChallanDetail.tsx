import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface ChalanItem {
  id: string;
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface Challan {
  id: string;
  challanNumber: string;
  customer: { id: string; name: string };
  items: ChalanItem[];
  totalQuantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const ChallanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challan, setChallan] = useState<Challan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) fetchChallan();
  }, [id]);

  const fetchChallan = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/challans/${id}`);
      setChallan(response.data.challan);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch challan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await api.put(`/challans/${id}/confirm`);
      setChallan(response.data.challan);
      setSuccess('Challan confirmed successfully and stock deducted');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to confirm challan');
    }
  };

  const handleCancel = async () => {
    try {
      const response = await api.put(`/challans/${id}/cancel`);
      setChallan(response.data.challan);
      setSuccess('Challan cancelled');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel challan');
    }
  };

  if (isLoading) {
    return <div className="spinner"><div className="spinner-border"></div></div>;
  }

  if (!challan) {
    return <div className="alert alert-danger">Challan not found</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Challan Details</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/challans')}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Challan Information</h5>
              <p><strong>Challan #:</strong> {challan.challanNumber}</p>
              <p><strong>Customer:</strong> {challan.customer?.name}</p>
              <p><strong>Total Quantity:</strong> {challan.totalQuantity}</p>
              <p><strong>Total Amount:</strong> ₹{challan.totalAmount.toFixed(2)}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`badge bg-${challan.status === 'confirmed' ? 'success' : challan.status === 'draft' ? 'warning' : 'danger'}`}
                >
                  {challan.status}
                </span>
              </p>
              <p><strong>Created:</strong> {new Date(challan.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Actions</h5>
              {challan.status === 'draft' && (
                <>
                  <button
                    className="btn btn-success w-100 mb-2"
                    onClick={handleConfirm}
                  >
                    <i className="bi bi-check-circle"></i> Confirm Challan
                  </button>
                  <button
                    className="btn btn-danger w-100"
                    onClick={handleCancel}
                  >
                    <i className="bi bi-x-circle"></i> Cancel Challan
                  </button>
                </>
              )}
              {challan.status === 'confirmed' && (
                <div className="alert alert-success">This challan has been confirmed.</div>
              )}
              {challan.status === 'cancelled' && (
                <div className="alert alert-danger">This challan has been cancelled.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Items</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {challan.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>
                      <span className="badge bg-secondary">{item.productSku}</span>
                    </td>
                    <td>₹{item.unitPrice.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <strong>₹{item.totalPrice.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4} className="text-end">Grand Total:</th>
                  <th>₹{challan.totalAmount.toFixed(2)}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallanDetail;
