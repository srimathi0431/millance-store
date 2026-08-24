import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import { vendorProductsApi, vendorOrdersApi } from '../services/vendorApi';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n);

const VendorDashboard= () => {
 const { data: products, isLoading: pLoading } = useQuery({
 queryKey: ['vendor-products-count'],
 queryFn: () => vendorProductsApi.list({ page:1, page_size:1 }).then(r => r.data.data),
 });

 const { data: orders, isLoading: oLoading } = useQuery({
 queryKey: ['vendor-orders-count'],
 queryFn: () => vendorOrdersApi.list({ page:1, page_size:5 }).then(r => r.data.data),
 });

 const kpis = [
 { label:'Total Products', value: products?.total ?? '—', icon: Package, color:'#7B2FF7', bg:'#F5F3FF' },
 { label:'Total Orders', value: orders?.total ?? '—', icon: ShoppingCart, color:'#FF3D8D', bg:'#FFF1F8' },
 { label:'Pending Orders', value: orders?.items?.filter((o) => o.status==='PENDING').length ?? '—', icon: AlertTriangle, color:'#F59E0B', bg:'#FFFBEB' },
 ];

 return (
 <div>
 <div className="vendor-page-header">
 <div>
 <h1 className="vendor-page-title">Vendor Dashboard</h1>
 <p className="vendor-page-subtitle">Overview of your store performance</p>
 </div>
 </div>

 {/* KPI Cards */}
 <div className="vendor-stats-grid">
 {kpis.map(k => (
 <div key={k.label} className="vendor-stat-card">
 <div className="vendor-stat-card-icon" style={{ background: k.bg }}>
 <k.icon size={20} style={{ color: k.color }} />
 </div>
 <div className="vendor-stat-card-value">{pLoading || oLoading ? '...' : k.value}</div>
 <div className="vendor-stat-card-label">{k.label}</div>
 </div>
 ))}
 </div>

 {/* Recent Orders */}
 <div className="vendor-table-card">
 <div className="vendor-table-header">
 <div className="vendor-table-title">Recent Orders</div>
 <a href="/vendor/orders" style={{ fontSize:13, color:'#7B2FF7', fontWeight:600, textDecoration:'none' }}>View All →</a>
 </div>
 {oLoading ? (
 <div style={{ padding:16 }}>{Array(3).fill(0).map((_,i) => <div key={i} className="vendor-skeleton" style={{ height:44, marginBottom:8 }} />)}</div>
 ) : !orders?.items?.length ? (
 <div className="vendor-empty"><div className="vendor-empty-icon"><ShoppingCart size={24}/></div><div className="vendor-empty-title">No orders yet</div></div>
 ) : (
 <table className="vendor-table">
 <thead><tr><th>Order #</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
 <tbody>
 {orders.items.map((o) => (
 <tr key={o.id}>
 <td style={{ fontWeight:600 }}>#{o.order_number}</td>
 <td style={{ fontWeight:700 }}>{fmt(o.total_amount)}</td>
 <td>
 <span className={`vendor-badge vendor-badge-${o.status==='DELIVERED'?'success':o.status==='CANCELLED'?'danger':o.status==='PENDING'?'warning':'info'}`}>
 {o.status}
 </span>
 </td>
 <td style={{ fontSize:12, color:'#94A3B8' }}>{new Date(o.created_at).toLocaleDateString()}</td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </div>
 );
};

export default VendorDashboard;
