import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Customer {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  currentStock: number;
}

interface ChallanItem {
  productId: string;
  quantity: number;
}

const ChallanCreate: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedItems, setSelectedItems] = useState<ChallanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [customersRes, productsRes] = await Promise.all([
        api.get('/customers?limit=100'),
        api.get('/products?limit=100'),
      ]);
      setCustomers(customersRes.data.customers);
      setProducts(productsRes.data.products);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...selectedItems];
    if (field === 'productId') {
      newItems[index] = { ...newItems[index], productId: value };
    } else if (field === 'quantity') {
      newItems[index] = { ...newItems[index], quantity: parseInt(value) };
    }
    setSelectedItems(newItems);
  };

  const handleCreateChallan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || selectedItems.length === 0) {
      setError('Please select a customer and add items');
      return;
    }

    try {
      const response = await api.post('/challans', {
        customerId: selectedCustomerId,
        items: selectedItems,
      });
      setSuccess('Challan created successfully');
      setTimeout(() => {
        navigate(`/challans/${response.data.challan.id}`);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create challan');
    }
  };

  if (isLoading) {
    return <div className="spinner"><div className="spinner-border"></div></div>;
  }

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product ? product.unitPrice * item.quantity : 0);
    }, 0);
  };

  return (
    <div>
      <h1 className="mb-4">Create Sales Challan</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleCreateChallan}>
            <div className="mb-4">
              <label className="form-label">Select Customer *</label>
              <select
                className="form-select"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                required
              >
                <option value="">-- Select Customer --</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Items</h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleAddItem}
                >
                  <i className="bi bi-plus"></i> Add Item
                </button>
              </div>

              {selectedItems.length === 0 ? (
                <div className="alert alert-info">No items added yet. Click "Add Item" to add products.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Stock</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems.map((item, index) => {
                        const product = products.find((p) => p.id === item.productId);
                        return (
                          <tr key={index}>
                            <td>
                              <select
                                className="form-select"
                                value={item.productId}
                                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                required
                              >
                                <option value="">-- Select --</option>
                                {products.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>{product?.currentStock || '-'}</td>
                            <td>₹{product?.unitPrice.toFixed(2) || '-'}</td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                max={product?.currentStock || 999}
                                className="form-control"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                required
                              />
                            </td>
                            <td>₹{product ? (product.unitPrice * item.quantity).toFixed(2) : '-'}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveItem(index)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="alert alert-info">
              <strong>Total Amount:</strong> ₹{getTotalAmount().toFixed(2)}
            </div>

            <button type="submit" className="btn btn-primary btn-lg">
              Create Challan
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg ms-2"
              onClick={() => navigate('/challans')}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChallanCreate;
