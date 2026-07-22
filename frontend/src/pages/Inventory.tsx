import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface StockMovement {
  id: string;
  productId: string;
  quantityChanged: number;
  movementType: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minimumStockAlert: number;
}

const Inventory: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAdjustForm, setShowAdjustForm] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    productId: '',
    quantityChanged: '',
    movementType: 'in',
    reason: '',
  });

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [movementsRes, lowStockRes] = await Promise.all([
        api.get('/inventory/stock-movements', { params: { page, limit: 10 } }),
        api.get('/inventory/low-stock'),
      ]);
      setMovements(movementsRes.data.movements);
      setTotal(movementsRes.data.total);
      setLowStockProducts(lowStockRes.data.products || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/adjust-stock', {
        ...adjustForm,
        quantityChanged: parseInt(adjustForm.quantityChanged),
      });
      setAdjustForm({
        productId: '',
        quantityChanged: '',
        movementType: 'in',
        reason: '',
      });
      setShowAdjustForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to adjust stock');
    }
  };

  if (isLoading && movements.length === 0) {
    return <div className="spinner"><div className="spinner-border"></div></div>;
  }

  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <h1 className="mb-4">Inventory Management</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">⚠️ Low Stock Alert</h4>
          <p>{lowStockProducts.length} product(s) are running low on stock:</p>
          <ul className="mb-0">
            {lowStockProducts.map((product) => (
              <li key={product.id}>
                <strong>{product.name}</strong> (SKU: {product.sku}) - Current: {product.currentStock}, Min Alert: {product.minimumStockAlert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Adjust Stock Form */}
      <div className="row mb-4">
        <div className="col-md-6">
          {showAdjustForm ? (
            <div className="card">
              <div className="card-body">
                <h5>Adjust Stock</h5>
                <form onSubmit={handleAdjustStock}>
                  <div className="mb-3">
                    <label className="form-label">Product ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={adjustForm.productId}
                      onChange={(e) => setAdjustForm({ ...adjustForm, productId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Movement Type</label>
                    <select
                      className="form-select"
                      value={adjustForm.movementType}
                      onChange={(e) => setAdjustForm({ ...adjustForm, movementType: e.target.value })}
                    >
                      <option value="in">Stock In</option>
                      <option value="out">Stock Out</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={adjustForm.quantityChanged}
                      onChange={(e) => setAdjustForm({ ...adjustForm, quantityChanged: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <input
                      type="text"
                      className="form-control"
                      value={adjustForm.reason}
                      onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Adjust Stock</button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setShowAdjustForm(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setShowAdjustForm(true)}
            >
              <i className="bi bi-plus"></i> Adjust Stock
            </button>
          )}
        </div>
      </div>

      {/* Stock Movements */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Stock Movement History</h5>
        </div>
        <div className="card-body">
          {movements.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>No stock movements found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Product ID</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Reason</th>
                    <th>Created By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement.id}>
                      <td>
                        <span className="badge bg-secondary">{movement.productId.slice(0, 8)}</span>
                      </td>
                      <td>
                        <span className={`badge bg-${movement.movementType === 'in' ? 'success' : 'danger'}`}>
                          {movement.movementType === 'in' ? 'In' : 'Out'}
                        </span>
                      </td>
                      <td>{movement.quantityChanged}</td>
                      <td>{movement.reason}</td>
                      <td>{movement.createdBy}</td>
                      <td>{new Date(movement.createdAt).toLocaleDateString()}</td>
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

export default Inventory;
