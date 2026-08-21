import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Trash2, Search } from 'lucide-react';
import { reviewsApi } from '../services/api';
import { useToast } from '../components/Toast';

const STATUSES = ['PENDING','APPROVED','REJECTED','HIDDEN'];
const statusColor = (s) => ({PENDING:'warning',APPROVED:'success',REJECTED:'danger',HIDDEN:'gray'}[s]||'gray');

const ReviewsPage= () => {
 const qc = useQueryClient();
 const { toast } = useToast();
 const [page, setPage] = useState(1);
 const [statusFilter, setStatusFilter] = useState('');
 const [rating, setRating] = useState('');
 const [deleteId, setDeleteId] = useState(null);

 const { data, isLoading } = useQuery({
 queryKey: ['admin-reviews', page, statusFilter, rating],
 queryFn: () => reviewsApi.list({ page, page_size:15, status:statusFilter||undefined, rating:rating||undefined }).then(r=>r.data.data),
 keepPreviousData: true,
 });

 const statusMut = useMutation({ mutationFn:({id,s}) =>reviewsApi.updateStatus(id,s), onSuccess:()=>{qc.invalidateQueries(['admin-reviews']);toast('success','Status updated');}, onError:(e)=>toast('error',e?.response?.data?.message||'Failed') });
 const deleteMut = useMutation({ mutationFn:(id)=>reviewsApi.delete(id), onSuccess:()=>{qc.invalidateQueries(['admin-reviews']);setDeleteId(null);toast('success','Review deleted');} });

 return (
 <div>
 <div className="admin-page-header">
 <div><h1 className="admin-page-title">Reviews</h1><p className="admin-page-subtitle">{data?.total||0} reviews</p></div>
 </div>
 <div className="admin-table-card">
 <div className="admin-table-header">
 <div className="admin-table-filters">
 <select className="admin-select" value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}}>
 <option value="">All Status</option>
 {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
 </select>
 <select className="admin-select" value={rating} onChange={e=>{setRating(e.target.value);setPage(1);}}>
 <option value="">All Ratings</option>
 {[5,4,3,2,1].map(r=><option key={r} value={r}>{'★'.repeat(r)} {r} Stars</option>)}
 </select>
 </div>
 </div>
 {isLoading ? <div style={{padding:20}}>{Array(5).fill(0).map((_,i)=><div key={i} className="skeleton" style={{height:52,marginBottom:8}}/>)}</div>
 : !data?.items?.length ? <div className="admin-empty"><div className="admin-empty-icon"><Star size={28}/></div><div className="admin-empty-title">No reviews found</div></div>
 : (
 <>
 <table className="admin-table">
 <thead><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Review</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
 <tbody>
 {data.items.map((r)=>(
 <tr key={r.id}>
 <td style={{color:'#64748B'}}>#{r.product_id}</td>
 <td style={{color:'#64748B'}}>#{r.customer_id}</td>
 <td>
 <span style={{color:'#F59E0B',fontSize:14}}>{'★'.repeat(r.rating)}</span>
 <span style={{color:'#E2E8F0',fontSize:14}}>{'★'.repeat(5-r.rating)}</span>
 </td>
 <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13,color:'#334155'}}>{r.body||r.title||'—'}</td>
 <td>
 <select className="admin-select" style={{padding:'3px 8px',fontSize:11}} value={r.status} onChange={e=>statusMut.mutate({id:r.id,s:e.target.value})}>
 {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
 </select>
 </td>
 <td style={{fontSize:12,color:'#94A3B8'}}>{new Date(r.created_at).toLocaleDateString()}</td>
 <td><button className="admin-btn admin-btn-danger admin-btn-icon" onClick={()=>setDeleteId(r.id)}><Trash2 size={14}/></button></td>
 </tr>
 ))}
 </tbody>
 </table>
 <div className="admin-pagination">{Array.from({length:data.total_pages||1},(_,i)=>i+1).map(p=><button key={p} className={`admin-page-btn ${p===page?'active':''}`} onClick={()=>setPage(p)}>{p}</button>)}</div>
 </>
 )}
 </div>
 {deleteId && (
 <div className="admin-modal-overlay">
 <div className="admin-modal" style={{maxWidth:360}}>
 <div className="admin-modal-header"><div className="admin-modal-title">Delete Review</div></div>
 <div className="admin-modal-body"><p style={{color:'#334155',margin:0}}>Permanently delete this review?</p></div>
 <div className="admin-modal-footer"><button className="admin-btn admin-btn-secondary" onClick={()=>setDeleteId(null)}>Cancel</button><button className="admin-btn admin-btn-primary" style={{background:'#EF4444'}} onClick={()=>deleteMut.mutate(deleteId)} disabled={deleteMut.isLoading}>{deleteMut.isLoading?'Deleting...':'Delete'}</button></div>
 </div>
 </div>
 )}
 </div>
 );
};

export default ReviewsPage;
