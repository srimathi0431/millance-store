import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Search } from 'lucide-react';
import { vendorOrdersApi } from '../services/vendorApi';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n);
const statusColor = (s) => ({ PENDING:'warning', CONFIRMED:'info', PROCESSING:'purple', PACKED:'info', SHIPPED:'orange', DELIVERED:'success', CANCELLED:'danger' }[s] || 'info');

const VendorOrders= () => {
 const [page, setPage] = useState(1);
 const [search, setSearch] = useState('');
 const [statusFilter, setStatusFilter] = useState('');
 const [detail, setDetail] = useState(null);

 const { data, isLoading } = useQuery({
 queryKey: ['vendor-orders', page, search, statusFilter],
 queryFn: () => vendorOrdersApi.list({ page, page_size:15, search:search||undefined, status:statusFilter||undefined }).then(r => r.data.data),
 keepPreviousData: true,
 });

 const { data: orderDetail } = useQuery({
 queryKey: ['vendor-order-detail', detail?.id],
 queryFn: () => detail ? vendorOrdersApi.get(detail.id).then(r => r.data.data) : null,
 enabled: !!detail,
 });

 const STATUSES = ['PENDING','CONFIRMED','PROCESSING','PACKED','SHIPPED','DELIVERED','CANCELLED'];

 return (
 <div>
 <div className="vendor-page-header">
 <div><h1 className="vendor-page-title">Orders</h1><p className="vendor-page-subtitle">{data?.total||0} orders total</p></div>
 </div>

 <div className="vendor-table-card">
 <div className="vendor-table-header">
 <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
 <div style={{ display:'flex', alignItems:'center', gap:8, background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:8, padding:'7px 12px' }}>
 <Search size={15} style={{ color:'#94A3B8' }}/>
 <input placeholder="Search order number..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
 style={{ border:'none', background:'transparent', fontSize:13, color:'#0F172A', outline:'none', width:160 }}/>
 </div>
 <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}}
 style={{ padding:'7px 12px', border:'1px solid #E2E8F0', borderRadius:8, fontSize:13, background:'#F8FAFC', cursor:'pointer', outline:'none', color:'#334155' }}>
 <option value="">All Status</option>
 {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
 </select>
 </div>
 </div>

 {isLoading ? <div style={{padding:16}}>{Array(5).fill(0).map((_,i)=><div key={i} className="vendor-skeleton" style={{height:48,marginBottom:8}}/>)}</div>
 : !data?.items?.length ? (
 <div className="vendor-empty"><div className="vendor-empty-icon"><ShoppingCart size={28}/></div><div className="vendor-empty-title">No orders found</div></div>
 ) : (
 <>
 <table className="vendor-table">
 <thead><tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
 <tbody>
 {data.items.map((o) => (
 <tr key={o.id}>
 <td style={{ fontWeight:700 }}>#{o.order_number}</td>
 <td style={{ color:'#64748B' }}>#{o.customer_id||'Guest'}</td>
 <td style={{ fontWeight:700 }}>{fmt(o.total_amount)}</td>
 <td><span className={`vendor-badge vendor-badge-${statusColor(o.status)}`}>{o.status}</span></td>
 <td style={{ fontSize:12, color:'#94A3B8' }}>{new Date(o.created_at).toLocaleDateString()}</td>
 <td>
 <button className="vendor-btn vendor-btn-secondary" style={{ padding:'4px 10px', fontSize:12 }} onClick={()=>setDetail(o)}>View</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 <div className="vendor-pagination">
 {Array.from({length:data.total_pages||1},(_,i)=>i+1).map(p=>(
 <button key={p} className={`vendor-page-btn ${p===page?'active':''}`} onClick={()=>setPage(p)}>{p}</button>
 ))}
 </div>
 </>
 )}
 </div>

 {detail && (
 <div className="vendor-modal-overlay" onClick={e=>e.target===e.currentTarget&&setDetail(null)}>
 <div className="vendor-modal" style={{ maxWidth:520, maxHeight:'85vh', overflowY:'auto' }}>
 <div className="vendor-modal-header">
 <div className="vendor-modal-title">Order #{detail.order_number}</div>
 <button className="vendor-btn vendor-btn-secondary vendor-btn-icon" onClick={()=>setDetail(null)} style={{ fontSize:18 }}>×</button>
 </div>
 <div className="vendor-modal-body">
 {orderDetail ? (
 <>
 <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
 <div style={{ padding:12, background:'#F8FAFC', borderRadius:8 }}>
 <div style={{ fontSize:10, color:'#94A3B8', marginBottom:4, textTransform:'uppercase' }}>Status</div>
 <span className={`vendor-badge vendor-badge-${statusColor(orderDetail.status)}`}>{orderDetail.status}</span>
 </div>
 <div style={{ padding:12, background:'#F8FAFC', borderRadius:8 }}>
 <div style={{ fontSize:10, color:'#94A3B8', marginBottom:4, textTransform:'uppercase' }}>Total</div>
 <div style={{ fontWeight:800, fontSize:18 }}>{fmt(orderDetail.total_amount)}</div>
 </div>
 </div>
 {orderDetail.items?.map((item) => (
 <div key={item.id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F1F5F9', fontSize:13 }}>
 <span style={{ color:'#334155' }}>{item.product_name} × {item.quantity}</span>
 <span style={{ fontWeight:600 }}>{fmt(item.total_price)}</span>
 </div>
 ))}
 </>
 ) : <div className="vendor-skeleton" style={{ height:160 }}/>}
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default VendorOrders;
