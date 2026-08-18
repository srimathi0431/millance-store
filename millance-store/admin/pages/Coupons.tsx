import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { couponsApi } from '../services/api';
import { useToast } from '../components/Toast';

const CouponsPage: React.FC = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number|null>(null);
  const emptyForm = { code:'', description:'', discount_type:'PERCENTAGE', discount_value:'', min_order_amount:'0', max_discount_amount:'', usage_limit:'', per_user_limit:'1', starts_at:'', expires_at:'' };
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons', page, search],
    queryFn: () => couponsApi.list({ page, page_size:15, search:search||undefined }).then(r=>r.data.data),
    keepPreviousData: true,
  });

  const createMut = useMutation({ mutationFn: (d:any)=>couponsApi.create(d), onSuccess:()=>{qc.invalidateQueries(['admin-coupons']);setShowModal(false);toast('success','Coupon created');}, onError:(e:any)=>toast('error',e?.response?.data?.message||'Failed') });
  const updateMut = useMutation({ mutationFn:({id,d}:any)=>couponsApi.update(id,d), onSuccess:()=>{qc.invalidateQueries(['admin-coupons']);setShowModal(false);toast('success','Updated');}, onError:(e:any)=>toast('error',e?.response?.data?.message||'Failed') });
  const deleteMut = useMutation({ mutationFn:(id:number)=>couponsApi.delete(id), onSuccess:()=>{qc.invalidateQueries(['admin-coupons']);setDeleteId(null);toast('success','Deleted');} });
  const statusMut = useMutation({ mutationFn:({id,v}:any)=>couponsApi.updateStatus(id,v), onSuccess:()=>{qc.invalidateQueries(['admin-coupons']);toast('success','Status updated');} });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c:any) => { setEditing(c); setForm({ code:c.code, description:c.description||'', discount_type:c.discount_type, discount_value:String(c.discount_value), min_order_amount:String(c.min_order_amount||0), max_discount_amount:String(c.max_discount_amount||''), usage_limit:String(c.usage_limit||''), per_user_limit:String(c.per_user_limit||1), starts_at:c.starts_at?c.starts_at.slice(0,16):'', expires_at:c.expires_at?c.expires_at.slice(0,16):'' }); setShowModal(true); };

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, code:form.code.toUpperCase(), discount_value:parseFloat(form.discount_value), min_order_amount:parseFloat(form.min_order_amount||'0'), max_discount_amount:form.max_discount_amount?parseFloat(form.max_discount_amount):null, usage_limit:form.usage_limit?parseInt(form.usage_limit):null, per_user_limit:parseInt(form.per_user_limit||'1'), starts_at:form.starts_at||null, expires_at:form.expires_at||null };
    editing ? updateMut.mutate({id:editing.id,d:payload}) : createMut.mutate(payload);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Coupons</h1><p className="admin-page-subtitle">{data?.total||0} coupons</p></div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}><Plus size={16}/> Add Coupon</button>
      </div>
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div className="admin-search-input"><Search size={15} style={{color:'#94A3B8'}}/><input placeholder="Search coupons..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/></div>
        </div>
        {isLoading ? <div style={{padding:20}}>{Array(4).fill(0).map((_,i)=><div key={i} className="skeleton" style={{height:48,marginBottom:8}}/>)}</div>
        : !data?.items?.length ? <div className="admin-empty"><div className="admin-empty-icon"><Ticket size={28}/></div><div className="admin-empty-title">No coupons found</div></div>
        : (
          <>
            <table className="admin-table">
              <thead><tr><th>Code</th><th>Discount</th><th>Used</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {data.items.map((c:any)=>(
                  <tr key={c.id}>
                    <td><code style={{fontWeight:700,background:'#F1F5F9',padding:'2px 8px',borderRadius:4}}>{c.code}</code></td>
                    <td style={{fontWeight:600}}>{c.discount_type==='PERCENTAGE'?`${c.discount_value}%`:`₹${c.discount_value}`}</td>
                    <td style={{color:'#64748B'}}>{c.used_count}/{c.usage_limit||'∞'}</td>
                    <td style={{fontSize:12,color:'#94A3B8'}}>{c.expires_at?new Date(c.expires_at).toLocaleDateString():'No expiry'}</td>
                    <td><button className={`badge badge-${c.is_active?'success':'gray'}`} style={{cursor:'pointer',border:'none'}} onClick={()=>statusMut.mutate({id:c.id,v:!c.is_active})}>{c.is_active?'Active':'Inactive'}</button></td>
                    <td><div style={{display:'flex',gap:6}}><button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={()=>openEdit(c)}><Edit2 size={14}/></button><button className="admin-btn admin-btn-danger admin-btn-icon" onClick={()=>setDeleteId(c.id)}><Trash2 size={14}/></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="admin-pagination">{Array.from({length:data.total_pages||1},(_,i)=>i+1).map(p=><button key={p} className={`admin-page-btn ${p===page?'active':''}`} onClick={()=>setPage(p)}>{p}</button>)}</div>
          </>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="admin-modal" style={{maxWidth:540}}>
            <div className="admin-modal-header"><div className="admin-modal-title">{editing?'Edit Coupon':'Add Coupon'}</div><button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={()=>setShowModal(false)}>×</button></div>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',minHeight:0,flex:1}}>
              <div className="admin-modal-body">
                <div className="form-grid-2">
                <div className="admin-form-group"><label className="admin-form-label">Code *</label><input className="admin-form-input" value={form.code} onChange={e=>setForm(p=>({...p,code:e.target.value.toUpperCase()}))} required/></div>
                <div className="admin-form-group"><label className="admin-form-label">Discount Type</label><select className="admin-form-select" value={form.discount_type} onChange={e=>setForm(p=>({...p,discount_type:e.target.value}))}><option value="PERCENTAGE">Percentage %</option><option value="FIXED">Fixed ₹</option></select></div>
                <div className="admin-form-group"><label className="admin-form-label">Discount Value *</label><input className="admin-form-input" type="number" step="0.01" min="0.01" value={form.discount_value} onChange={e=>setForm(p=>({...p,discount_value:e.target.value}))} required/></div>
                <div className="admin-form-group"><label className="admin-form-label">Min Order Amount</label><input className="admin-form-input" type="number" step="0.01" min="0" value={form.min_order_amount} onChange={e=>setForm(p=>({...p,min_order_amount:e.target.value}))}/></div>
                <div className="admin-form-group"><label className="admin-form-label">Max Discount Amount</label><input className="admin-form-input" type="number" step="0.01" min="0" value={form.max_discount_amount} onChange={e=>setForm(p=>({...p,max_discount_amount:e.target.value}))}/></div>
                <div className="admin-form-group"><label className="admin-form-label">Usage Limit (blank=∞)</label><input className="admin-form-input" type="number" min="1" value={form.usage_limit} onChange={e=>setForm(p=>({...p,usage_limit:e.target.value}))}/></div>
                <div className="admin-form-group"><label className="admin-form-label">Per User Limit</label><input className="admin-form-input" type="number" min="1" value={form.per_user_limit} onChange={e=>setForm(p=>({...p,per_user_limit:e.target.value}))}/></div>
                <div className="admin-form-group"><label className="admin-form-label">Starts At</label><input className="admin-form-input" type="datetime-local" value={form.starts_at} onChange={e=>setForm(p=>({...p,starts_at:e.target.value}))}/></div>
                <div className="admin-form-group"><label className="admin-form-label">Expires At</label><input className="admin-form-input" type="datetime-local" value={form.expires_at} onChange={e=>setForm(p=>({...p,expires_at:e.target.value}))}/></div>
                <div className="admin-form-group" style={{gridColumn:'1/-1'}}><label className="admin-form-label">Description</label><input className="admin-form-input" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div>
                </div>
              </div>
              <div className="admin-modal-footer"><button type="button" className="admin-btn admin-btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="admin-btn admin-btn-primary" disabled={createMut.isLoading||updateMut.isLoading}>{createMut.isLoading||updateMut.isLoading?'Saving...':editing?'Update':'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{maxWidth:360}}>
            <div className="admin-modal-header"><div className="admin-modal-title">Delete Coupon</div></div>
            <div className="admin-modal-body"><p style={{color:'#334155',margin:0}}>Are you sure you want to delete this coupon?</p></div>
            <div className="admin-modal-footer"><button className="admin-btn admin-btn-secondary" onClick={()=>setDeleteId(null)}>Cancel</button><button className="admin-btn admin-btn-primary" style={{background:'#EF4444'}} onClick={()=>deleteMut.mutate(deleteId!)} disabled={deleteMut.isLoading}>{deleteMut.isLoading?'Deleting...':'Delete'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
