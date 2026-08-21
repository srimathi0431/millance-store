import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Users } from 'lucide-react';
import { customersApi } from '../services/api';
import { useToast } from '../components/Toast';

const CustomersPage= () => {
 const qc = useQueryClient();
 const { toast } = useToast();
 const [page, setPage] = useState(1);
 const [search, setSearch] = useState('');
 const [detailId, setDetailId] = useState(null);

 const { data, isLoading } = useQuery({
 queryKey: ['admin-customers', page, search],
 queryFn: () => customersApi.list({ page, page_size:15, search:search||undefined }).then(r=>r.data.data),
 keepPreviousData: true,
 });

 const { data: detail } = useQuery({
 queryKey: ['admin-customer', detailId],
 queryFn: () => detailId ? customersApi.get(detailId).then(r=>r.data.data) : null,
 enabled: !!detailId,
 });

 const statusMut = useMutation({
 mutationFn: ({ id, d }) => customersApi.updateStatus(id, d),
 onSuccess: () => { qc.invalidateQueries(['admin-customers']); qc.invalidateQueries(['admin-customer']); toast('success','Status updated'); },
 onError: (e) => toast('error', e?.response?.data?.message || 'Failed'),
 });

 return (
 <div>
 <div className="admin-page-header">
 <div><h1 className="admin-page-title">Customers</h1><p className="admin-page-subtitle">{data?.total||0} customers</p></div>
 </div>
 <div className="admin-table-card">
 <div className="admin-table-header">
 <div className="admin-search-input">
 <Search size={15} style={{color:'#94A3B8'}}/>
 <input placeholder="Search name, email, phone..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
 </div>
 </div>
 {isLoading ? <div style={{padding:20}}>{Array(5).fill(0).map((_,i)=><div key={i} className="skeleton" style={{height:52,marginBottom:8}}/>)}</div>
 : !data?.items?.length ? (
 <div className="admin-empty"><div className="admin-empty-icon"><Users size={28}/></div><div className="admin-empty-title">No customers found</div></div>
 ) : (
 <>
 <table className="admin-table">
 <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Blocked</th><th>Joined</th><th>Actions</th></tr></thead>
 <tbody>
 {data.items.map((c)=>(
 <tr key={c.id}>
 <td style={{fontWeight:600}}>{c.name}</td>
 <td style={{fontSize:12,color:'#64748B'}}>{c.email}</td>
 <td style={{fontSize:12,color:'#64748B'}}>{c.phone||'—'}</td>
 <td>
 <button className={`badge badge-${c.is_active?'success':'gray'}`} style={{cursor:'pointer',border:'none'}}
 onClick={()=>statusMut.mutate({id:c.id,d:{is_active:!c.is_active}})}>
 {c.is_active?'Active':'Inactive'}
 </button>
 </td>
 <td>
 <button className={`badge badge-${c.is_blocked?'danger':'success'}`} style={{cursor:'pointer',border:'none'}}
 onClick={()=>statusMut.mutate({id:c.id,d:{is_blocked:!c.is_blocked}})}>
 {c.is_blocked?'Blocked':'OK'}
 </button>
 </td>
 <td style={{fontSize:12,color:'#94A3B8'}}>{new Date(c.created_at).toLocaleDateString()}</td>
 <td><button className="admin-btn admin-btn-secondary" style={{padding:'4px 10px',fontSize:12}} onClick={()=>setDetailId(c.id)}>View</button></td>
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

 {detailId && (
 <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&setDetailId(null)}>
 <div className="admin-modal" style={{maxWidth:480}}>
 <div className="admin-modal-header">
 <div className="admin-modal-title">Customer Detail</div>
 <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={()=>setDetailId(null)}>×</button>
 </div>
 <div className="admin-modal-body">
 {detail ? (
 <div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
 {[['Name',detail.name],['Email',detail.email],['Phone',detail.phone||'—'],['Orders',detail.order_count??'—'],['Total Spent',detail.total_spent?`₹${detail.total_spent}`:'—'],['Joined',new Date(detail.created_at).toLocaleDateString()]].map(([k,v])=>(
 <div key={k} style={{padding:10,background:'#F8FAFC',borderRadius:8}}>
 <div style={{fontSize:10,color:'#94A3B8',marginBottom:2,textTransform:'uppercase',letterSpacing:'0.5px'}}>{k}</div>
 <div style={{fontSize:13,fontWeight:600,color:'#0F172A'}}>{v}</div>
 </div>
 ))}
 </div>
 <div style={{display:'flex',gap:8,marginTop:16}}>
 <button className="admin-btn admin-btn-secondary" onClick={()=>statusMut.mutate({id:detail.id,d:{is_active:!detail.is_active}})}>{detail.is_active?'Deactivate':'Activate'}</button>
 <button className={`admin-btn ${detail.is_blocked?'admin-btn-success':'admin-btn-danger'}`} onClick={()=>statusMut.mutate({id:detail.id,d:{is_blocked:!detail.is_blocked}})}>{detail.is_blocked?'Unblock':'Block'}</button>
 </div>
 </div>
 ) : <div className="skeleton" style={{height:160}}/>}
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default CustomersPage;
