import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Search } from 'lucide-react';
import { ordersApi } from '../services/api';
import { useToast } from '../components/Toast';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n);
const STATUS_TRANSITIONS = {
 PENDING:['CONFIRMED','CANCELLED'], CONFIRMED:['PROCESSING','CANCELLED'],
 PROCESSING:['PACKED','CANCELLED'], PACKED:['SHIPPED'], SHIPPED:['OUT_FOR_DELIVERY'],
 OUT_FOR_DELIVERY:['DELIVERED'], DELIVERED:['RETURN_REQUESTED'],
 RETURN_REQUESTED:['RETURNED','DELIVERED'], CANCELLED:[], RETURNED:[],
};
const statusColor = (s) => ({PENDING:'warning',CONFIRMED:'info',PROCESSING:'purple',PACKED:'info',SHIPPED:'orange',OUT_FOR_DELIVERY:'orange',DELIVERED:'success',CANCELLED:'danger',RETURN_REQUESTED:'warning',RETURNED:'gray'}[s]||'gray');

const OrdersPage= () => {
 const qc = useQueryClient();
 const { toast } = useToast();
 const [page, setPage] = useState(1);
 const [search, setSearch] = useState('');
 const [statusFilter, setStatusFilter] = useState('');
 const [detailOrder, setDetailOrder] = useState(null);
 const [cancelId, setCancelId] = useState(null);
 const [cancelReason, setCancelReason] = useState('');
 const [newStatus, setNewStatus] = useState('');

 const { data, isLoading } = useQuery({
 queryKey: ['admin-orders', page, search, statusFilter],
 queryFn: () => ordersApi.list({ page, page_size:15, search:search||undefined, status:statusFilter||undefined }).then(r=>r.data.data),
 keepPreviousData: true,
 });

 const { data: orderDetail } = useQuery({
 queryKey: ['admin-order', detailOrder?.id],
 queryFn: () => detailOrder ? ordersApi.get(detailOrder.id).then(r=>r.data.data) : null,
 enabled: !!detailOrder,
 });

 const statusMut = useMutation({
 mutationFn: ({ id, s }) => ordersApi.updateStatus(id, s),
 onSuccess: () => { qc.invalidateQueries(['admin-orders']); qc.invalidateQueries(['admin-order']); toast('success','Status updated'); },
 onError: (e) => toast('error', e?.response?.data?.message || 'Invalid transition'),
 });

 const cancelMut = useMutation({
 mutationFn: ({ id, reason }) => ordersApi.cancel(id, reason),
 onSuccess: () => { qc.invalidateQueries(['admin-orders']); setCancelId(null); setCancelReason(''); toast('success','Order cancelled'); },
 onError: (e) => toast('error', e?.response?.data?.message || 'Cannot cancel'),
 });

 const STATUSES = Object.keys(STATUS_TRANSITIONS);

 return (
 <div>
 <div className="admin-page-header">
 <div><h1 className="admin-page-title">Orders</h1><p className="admin-page-subtitle">{data?.total||0} orders</p></div>
 </div>
 <div className="admin-table-card">
 <div className="admin-table-header">
 <div className="admin-table-filters">
 <div className="admin-search-input">
 <Search size={15} style={{color:'#94A3B8'}}/>
 <input placeholder="Search order number..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
 </div>
 <select className="admin-select" value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}}>
 <option value="">All Status</option>
 {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
 </select>
 </div>
 </div>
 {isLoading ? <div style={{padding:20}}>{Array(5).fill(0).map((_,i)=><div key={i} className="skeleton" style={{height:52,marginBottom:8}}/>)}</div>
 : !data?.items?.length ? (
 <div className="admin-empty"><div className="admin-empty-icon"><ShoppingCart size={28}/></div><div className="admin-empty-title">No orders found</div></div>
 ) : (
 <>
 <table className="admin-table">
 <thead><tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
 <tbody>
 {data.items.map((o)=>(
 <tr key={o.id}>
 <td style={{fontWeight:700}}>#{o.order_number}</td>
 <td style={{color:'#64748B'}}>#{o.customer_id||'Guest'}</td>
 <td style={{fontWeight:700}}>{fmt(o.total_amount)}</td>
 <td><span className={`badge badge-${statusColor(o.status)}`}>{o.status}</span></td>
 <td style={{fontSize:12,color:'#94A3B8'}}>{new Date(o.created_at).toLocaleDateString()}</td>
 <td>
 <div style={{display:'flex',gap:6}}>
 <button className="admin-btn admin-btn-secondary" style={{padding:'4px 10px',fontSize:12}} onClick={()=>setDetailOrder(o)}>View</button>
 {STATUS_TRANSITIONS[o.status]?.includes('CANCELLED') && (
 <button className="admin-btn admin-btn-danger" style={{padding:'4px 10px',fontSize:12}} onClick={()=>{setCancelId(o.id);setCancelReason('');}}>Cancel</button>
 )}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 <div className="admin-pagination">
 {Array.from({length:data.total_pages||1},(_,i)=>i+1).map(p=>(
 <button key={p} className={`admin-page-btn ${p===page?'active':''}`} onClick={()=>setPage(p)}>{p}</button>
 ))}
 </div>
 </>
 )}
 </div>

 {/* Order Detail Modal */}
 {detailOrder && (
 <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&setDetailOrder(null)}>
 <div className="admin-modal" style={{maxWidth:580}}>
 <div className="admin-modal-header">
 <div className="admin-modal-title">Order #{detailOrder.order_number}</div>
 <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={()=>setDetailOrder(null)}>×</button>
 </div>
 <div className="admin-modal-body">
 {orderDetail ? (
 <>
 <div className="form-grid-2" style={{marginBottom:16}}>
 <div style={{padding:12,background:'#F8FAFC',borderRadius:8}}>
 <div style={{fontSize:11,color:'#94A3B8',marginBottom:4}}>STATUS</div>
 <span className={`badge badge-${statusColor(orderDetail.status)}`}>{orderDetail.status}</span>
 </div>
 <div style={{padding:12,background:'#F8FAFC',borderRadius:8}}>
 <div style={{fontSize:11,color:'#94A3B8',marginBottom:4}}>TOTAL</div>
 <div style={{fontWeight:800,fontSize:18}}>{fmt(orderDetail.total_amount)}</div>
 </div>
 </div>
 {orderDetail.items?.length > 0 && (
 <div style={{marginBottom:16}}>
 <div style={{fontWeight:700,fontSize:13,marginBottom:8}}>Items</div>
 {orderDetail.items.map((item)=>(
 <div key={item.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #F1F5F9',fontSize:13}}>
 <span style={{color:'#334155'}}>{item.product_name} × {item.quantity}</span>
 <span style={{fontWeight:600}}>{fmt(item.total_price)}</span>
 </div>
 ))}
 </div>
 )}
 {/* Update Status */}
 {STATUS_TRANSITIONS[orderDetail.status]?.length > 0 && (
 <div style={{display:'flex',gap:8,alignItems:'center',marginTop:12}}>
 <select className="admin-form-select" style={{flex:1}} value={newStatus} onChange={e=>setNewStatus(e.target.value)}>
 <option value="">Move to status...</option>
 {STATUS_TRANSITIONS[orderDetail.status].map(s=><option key={s} value={s}>{s}</option>)}
 </select>
 <button className="admin-btn admin-btn-primary" disabled={!newStatus||statusMut.isLoading}
 onClick={()=>{ if(newStatus) statusMut.mutate({id:orderDetail.id,s:newStatus}); }}>
 {statusMut.isLoading?'Updating...':'Update'}
 </button>
 </div>
 )}
 </>
 ) : <div className="skeleton" style={{height:200}}/>}
 </div>
 </div>
 </div>
 )}

 {/* Cancel Modal */}
 {cancelId && (
 <div className="admin-modal-overlay">
 <div className="admin-modal" style={{maxWidth:400}}>
 <div className="admin-modal-header"><div className="admin-modal-title">Cancel Order</div></div>
 <div className="admin-modal-body">
 <p style={{color:'#334155',marginBottom:12}}>Inventory will be restored. This cannot be undone.</p>
 <div className="admin-form-group">
 <label className="admin-form-label">Reason (optional)</label>
 <input className="admin-form-input" value={cancelReason} onChange={e=>setCancelReason(e.target.value)} placeholder="Reason for cancellation..."/>
 </div>
 </div>
 <div className="admin-modal-footer">
 <button className="admin-btn admin-btn-secondary" onClick={()=>setCancelId(null)}>Back</button>
 <button className="admin-btn admin-btn-primary" style={{background:'#EF4444'}} onClick={()=>cancelMut.mutate({id:cancelId,reason:cancelReason||undefined})} disabled={cancelMut.isLoading}>
 {cancelMut.isLoading?'Cancelling...':'Confirm Cancel'}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default OrdersPage;
