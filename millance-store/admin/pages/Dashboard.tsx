import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { dashboardApi } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat('en-IN').format(n);

const SkeletonCard = () => (
  <div className="admin-stat-card">
    <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 12 }} />
    <div className="skeleton" style={{ width: '60%', height: 28, marginBottom: 6 }} />
    <div className="skeleton" style={{ width: '80%', height: 14 }} />
  </div>
);

const DashboardPage: React.FC = () => {
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  const { data: dash, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardApi.get().then(r => r.data.data),
  });

  const { data: salesData } = useQuery({
    queryKey: ['admin-sales', salesPeriod],
    queryFn: () => dashboardApi.sales(salesPeriod, salesPeriod === 'daily' ? 30 : salesPeriod === 'weekly' ? 12 : salesPeriod === 'monthly' ? 12 : 5).then(r => r.data.data),
  });

  const { data: topProducts } = useQuery({
    queryKey: ['admin-top-products'],
    queryFn: () => dashboardApi.topProducts(5).then(r => r.data.data),
  });

  const kpis = dash ? [
    { label: 'Total Revenue', value: fmt(dash.revenue?.total_revenue ?? 0), icon: DollarSign, color: '#FF7A00', bg: '#FFF7ED', trend: null },
    { label: 'Total Orders', value: fmtNum(dash.orders?.total_orders ?? 0), icon: ShoppingCart, color: '#7B2FF7', bg: '#F5F3FF', trend: null },
    { label: 'Total Products', value: fmtNum(dash.products?.total_products ?? 0), icon: Package, color: '#FF3D8D', bg: '#FFF1F8', trend: null },
    { label: 'Total Customers', value: fmtNum(dash.customers?.total_customers ?? 0), icon: Users, color: '#10B981', bg: '#ECFDF5', trend: null },
  ] : [];

  const orderStats = dash?.orders ? [
    { label: 'Pending', value: dash.orders.pending_orders, color: '#F59E0B' },
    { label: 'Confirmed', value: dash.orders.confirmed_orders, color: '#3B82F6' },
    { label: 'Processing', value: dash.orders.processing_orders, color: '#8B5CF6' },
    { label: 'Shipped', value: dash.orders.shipped_orders, color: '#FF7A00' },
    { label: 'Delivered', value: dash.orders.delivered_orders, color: '#10B981' },
    { label: 'Cancelled', value: dash.orders.cancelled_orders, color: '#EF4444' },
  ] : [];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-stats-grid">
        {isLoading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />) :
          kpis.map(k => (
            <div key={k.label} className="admin-stat-card">
              <div className="admin-stat-card-icon" style={{ background: k.bg }}>
                <k.icon size={20} style={{ color: k.color }} />
              </div>
              <div className="admin-stat-card-value">{k.value}</div>
              <div className="admin-stat-card-label">{k.label}</div>
            </div>
          ))
        }
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Sales Chart (text-based) */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Sales Overview</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['daily','weekly','monthly','yearly'] as const).map(p => (
                <button key={p} onClick={() => setSalesPeriod(p)}
                  style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: salesPeriod === p ? 'linear-gradient(135deg,#FF7A00,#FF3D8D)' : '#F1F5F9',
                    color: salesPeriod === p ? 'white' : '#64748B',
                  }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
              ))}
            </div>
          </div>
          {!salesData || salesData.length === 0 ? (
            <div className="admin-empty" style={{ padding: '30px 20px' }}>
              <div style={{ fontSize: 13, color: '#94A3B8' }}>No sales data for this period</div>
            </div>
          ) : (
            <div>
              {salesData.slice(-8).map((s: any, i: number) => {
                const maxRev = Math.max(...salesData.map((x: any) => x.revenue));
                const pct = maxRev > 0 ? (s.revenue / maxRev) * 100 : 0;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 80, fontSize: 11, color: '#64748B', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {String(s.label).substring(0, 10)}
                    </div>
                    <div style={{ flex: 1, height: 24, background: '#F1F5F9', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#FF7A00,#FF3D8D)', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                        <span style={{ fontSize: 10, color: pct > 20 ? 'white' : 'transparent', fontWeight: 600 }}>{fmt(s.revenue)}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', width: 50, textAlign: 'right' }}>{s.orders} ord</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Stats */}
        <div className="admin-card">
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', marginBottom: 16 }}>Order Status</div>
          {isLoading ? (
            <div>{Array(6).fill(0).map((_,i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }} />)}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {orderStats.map(s => (
                <div key={s.label} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{fmtNum(s.value)}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Orders */}
        <div className="admin-table-card">
          <div className="admin-table-header">
            <div className="admin-table-title">Recent Orders</div>
          </div>
          {isLoading ? (
            <div style={{ padding: 16 }}>{Array(4).fill(0).map((_,i) => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8 }} />)}</div>
          ) : !dash?.recent_orders?.length ? (
            <div className="admin-empty"><div className="admin-empty-title">No orders yet</div></div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Order #</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {dash.recent_orders.slice(0,6).map((o: any) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>#{o.order_number}</td>
                    <td>{fmt(o.total_amount)}</td>
                    <td><span className={`badge badge-${o.status === 'DELIVERED' ? 'success' : o.status === 'CANCELLED' ? 'danger' : o.status === 'PENDING' ? 'warning' : 'info'}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Products */}
        <div className="admin-table-card">
          <div className="admin-table-header">
            <div className="admin-table-title">Top Products</div>
          </div>
          {!topProducts?.length ? (
            <div className="admin-empty"><div className="admin-empty-title">No sales data yet</div></div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>#</th><th>Product</th><th>Sold</th><th>Revenue</th></tr></thead>
              <tbody>
                {topProducts.slice(0,5).map((p: any, i: number) => (
                  <tr key={p.product_id}>
                    <td style={{ color: '#94A3B8', fontWeight: 700 }}>{i+1}</td>
                    <td style={{ fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.product_name}</td>
                    <td>{p.total_sold}</td>
                    <td>{fmt(p.total_revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Inventory alerts */}
      {dash && (dash.products?.low_stock_products > 0 || dash.products?.out_of_stock_products > 0) && (
        <div style={{ marginTop: 20, background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 20 }}>
          <span style={{ fontSize: 13, color: '#C2410C', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={15} /> {dash.products.low_stock_products} products low stock
          </span>
          <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <XCircle size={15} /> {dash.products.out_of_stock_products} out of stock
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
