import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Challan {
  id: string;
  challanNumber: string;
  customer: { name: string };
  totalQuantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const Challans: React.FC = () => {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallans();
  }, [page, status]);

  const fetchChallans = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/challans', {
        params: { page, status, limit: 10 },
      });
      setChallans(response.data.challans);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch challans');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && challans.length === 0) {
    return <div className="spinner"><div className="spinner-border"></div></div>;
  }

  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Sales Challans</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/challans/create')}
        >
          <i className="bi bi-plus"></i> Create Challan
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <select
              className="form-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {challans.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>No challans found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Challan #</th>
                    <th>Customer</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {challans.map((challan) => (
                    <tr key={challan.id}>
                      <td>
                        <strong>{challan.challanNumber}</strong>
                      </td>
                      <td>{challan.customer?.name || 'N/A'}</td>
                      <td>{challan.totalQuantity}</td>
                      <td>₹{challan.totalAmount.toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge bg-${challan.status === 'confirmed' ? 'success' : challan.status === 'draft' ? 'warning' : 'danger'}`}
                        >
                          {challan.status}
                        </span>
                      </td>
                      <td>{new Date(challan.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/challans/${challan.id}`)}
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

export default Challans;
