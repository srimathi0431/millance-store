import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard } from 'lucide-react';
import { paymentsApi } from '../services/api';
import { useToast } from '../components/Toast';

const fmt = (n) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const statusColor = (s) => ({PENDING:'warning',SUCCESS:'success',FAILED:'danger',REFUNDED:'purple',PARTIALLY_REFUNDED:'info'}[s]||'gray');

const PaymentsPage= () => {
 const qc = useQueryClient();
 const { toast } = useToast();
 const [tab, setTab] = useState('payments');
 const [page, setPage] = useState(1);
 const [refundModal, setRefundModal] = useState(null);
 const [refundAmount, setRefundAmount] = useState('');
 const [refundReason, setRefundReason] = useState('');

 const { data: paymentsData, isLoading: pLoading } = useQuery({
 queryKey: ['admin-payments', page],
 queryFn: () => paymentsApi.list({ page, page_size:15 }).then(r=>r.data.data),
 enabled: tab==='payments', keepPreviousData: true,
 });

 const { data: refundsData, isLoading: rLoading } = useQuery({
 queryKey: ['admin-refunds', page],
 queryFn: () => paymentsApi.refunds({ page, page_size:15 }).then(r=>r.data.data),
 enabled: tab==='refunds', keepPreviousData: true,
 });

 const refundMut = useMutation({
 mutationFn: ({ orderId, amount, reason }) => paymentsApi.refund(orderId, parseFloat(amount), reason||undefined),
 onSuccess: () => { qc.invalidateQueries(['admin-payments']); qc.invalidateQueries(['admin-refunds']); setRefundModal(null); setRefundAmount(''); setRefundReason(''); toast('success','Refund created'); },
 onError: (e) => toast('error', e?.response?.data?.message || 'Refund failed'),
 });

 const handleRefund = (e) => {
 e.preventDefault();
 if (!refundAmount || parseFloat(refundAmount) <= 0) { toast('error','Enter valid amount'); return; }
 refundMut.mutate({ orderId: refundModal.order_id, amount: refundAmount, reason: refundReason });
 };

 const isLoading = tab==='payments' ? pLoading : rLoading;
 const data = tab==='payments' ? paymentsData : refundsData;

 return (
 <div>
 <div className="admin-page-header">
 <div><h1 className="admin-page-title">Payments & Refunds</h1></div>
 </div>
 <div style={{display:'flex',gap:8,marginBottom:20}}>
 {(['payments','refunds']).map(t=>(
 <button key={t} onClick={()=>{setTab(t);setPage(1);}} className={`admin-btn ${tab===t?'admin-btn-primary':'admin-btn-secondary'}`}>
 {t.charAt(0).toUpperCase()+t.slice(1)}
 </button>
 ))}
 </div>
 <div className="admin-table-card">
 {isLoading ? <div style={{padding:20}}>{Array(5).fill(0).map((_,i)=><div key={i} className="skeleton" style={{height:52,marginBottom:8}}/>)}</div>
 : !data?.items?.length ? (
 <div className="admin-empty"><div className="admin-empty-icon"><CreditCard size={28}/></div><div className="admin-empty-title">No {tab} found</div></div>
 ) : (
 <>
 <table className="admin-table">
 <thead>
 {tab==='payments'
 ? <tr><th>ID</th><th>Order</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr>
 : <tr><th>ID</th><th>Order</th><th>Amount</th><th>Status</th><th>Date</th></tr>
 }
 </thead>
 <tbody>
 {data.items.map((item)=>(
 <tr key={item.id}>
 <td style={{fontWeight:600}}>#{item.id}</td>
 <td style={{color:'#64748B'}}>#{item.order_id}</td>
 <td style={{fontWeight:700}}>{fmt(item.amount)}</td>
 {tab==='payments' && <td style={{fontSize:12,color:'#64748B'}}>{item.payment_method||'—'}</td>}
 <td><span className={`badge badge-${statusColor(item.status)}`}>{item.status}</span></td>
 <td style={{fontSize:12,color:'#94A3B8'}}>{new Date(item.created_at).toLocaleDateString()}</td>
 {tab==='payments' && (
 <td>
 {(item.status==='SUCCESS'||item.status==='PARTIALLY_REFUNDED') && (
 <button className="admin-btn admin-btn-secondary" style={{padding:'4px 10px',fontSize:12}} onClick={()=>{ setRefundModal(item); setRefundAmount(''); setRefundReason(''); }}>Refund</button>
 )}
 </td>
 )}
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

 {refundModal && (
 <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&setRefundModal(null)}>
 <div className="admin-modal" style={{maxWidth:400}}>
 <div className="admin-modal-header"><div className="admin-modal-title">Create Refund</div><button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={()=>setRefundModal(null)}>×</button></div>
 <form onSubmit={handleRefund}>
 <div className="admin-modal-body">
 <div style={{padding:10,background:'#F8FAFC',borderRadius:8,marginBottom:16,fontSize:13}}>
 <span style={{color:'#64748B'}}>Payment total: </span><strong>{fmt(refundModal.amount)}</strong>
 </div>
 <div className="admin-form-group">
 <label className="admin-form-label">Refund Amount (₹) *</label>
 <input className="admin-form-input" type="number" step="0.01" min="0.01" value={refundAmount} onChange={e=>setRefundAmount(e.target.value)} required/>
 </div>
 <div className="admin-form-group">
 <label className="admin-form-label">Reason</label>
 <input className="admin-form-input" value={refundReason} onChange={e=>setRefundReason(e.target.value)} placeholder="Optional reason..."/>
 </div>
 </div>
 <div className="admin-modal-footer">
 <button type="button" className="admin-btn admin-btn-secondary" onClick={()=>setRefundModal(null)}>Cancel</button>
 <button type="submit" className="admin-btn admin-btn-primary" disabled={refundMut.isLoading}>{refundMut.isLoading?'Processing...':'Create Refund'}</button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
};

export default PaymentsPage;
