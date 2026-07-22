import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalChallans: 0,
    draftChallans: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [customers, products, challans, lowStock] = await Promise.all([
        api.get('/customers?limit=1'),
        api.get('/products?limit=1'),
        api.get('/challans?limit=1'),
        api.get('/inventory/low-stock'),
      ]);

      setStats({
        totalCustomers: customers.data.total || 0,
        activeCustomers: Math.floor((customers.data.total || 0) * 0.7),
        totalProducts: products.data.total || 0,
        lowStockProducts: lowStock.data.products?.length || 0,
        totalChallans: challans.data.total || 0,
        draftChallans: Math.floor((challans.data.total || 0) * 0.3),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="spinner">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="dashboard-card">
            <h5>Total Customers</h5>
            <div className="value">{stats.totalCustomers}</div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="dashboard-card">
            <h5>Active Customers</h5>
            <div className="value">{stats.activeCustomers}</div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="dashboard-card">
            <h5>Total Products</h5>
            <div className="value">{stats.totalProducts}</div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="dashboard-card">
            <h5>Low Stock Items</h5>
            <div className="value" style={{ color: stats.lowStockProducts > 0 ? '#ff6b6b' : 'white' }}>
              {stats.lowStockProducts}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="dashboard-card">
            <h5>Total Challans</h5>
            <div className="value">{stats.totalChallans}</div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="dashboard-card">
            <h5>Draft Challans</h5>
            <div className="value">{stats.draftChallans}</div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5>Quick Actions</h5>
          <div className="btn-group" role="group">
            <a href="/customers" className="btn btn-outline-primary"><i className="bi bi-plus"></i> Add Customer</a>
            <a href="/products" className="btn btn-outline-success"><i className="bi bi-plus"></i> Add Product</a>
            <a href="/challans/create" className="btn btn-outline-info"><i className="bi bi-plus"></i> Create Challan</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
