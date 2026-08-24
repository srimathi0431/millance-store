import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, Search, Edit2, X, Image, Layers } from 'lucide-react';
import { vendorProductsApi, vendorCategoriesApi } from '../services/vendorApi';

const fmt = (n) =>
 new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const STATUSES = ['ACTIVE', 'INACTIVE', 'DRAFT', 'OUT_OF_STOCK'];
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];

// ── Size Variant Builder ───────────────────────────────
const SizeVariantBuilder = ({ productSku, productPrice, editVariants, onAddVariants, onUpdateVariant, onDeleteVariant, showToast }) => {
 const [selectedSizes, setSelectedSizes] = React.useState([]);
 const [color, setColor] = React.useState('');
 const [sizeRows, setSizeRows] = React.useState({});
 const [mode, setMode] = React.useState('sizes');
 const [customForm, setCustomForm] = React.useState({ name:'', sku:'', price:'', stock:'0', color:'', attributes:'' });

 const toggleSize = (size) => {
 setSelectedSizes(prev => {
 const next = prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size];
 if (!prev.includes(size)) {
 setSizeRows(rows => ({ ...rows, [size]: { stock:'0', sku:`${productSku||'PROD'}-${size.replace(' ','').toUpperCase()}`, price: productPrice||'' } }));
 }
 return next;
 });
 };

 const handleAddSizes = () => {
 if (!selectedSizes.length) { showToast('error','Select at least one size'); return; }
 const variants = [];
 for (const size of selectedSizes) {
 const row = sizeRows[size];
 if (!row?.sku) { showToast('error',`SKU required for size ${size}`); return; }
 if (!row.price || parseFloat(row.price)<=0) { showToast('error',`Price must be > 0 for size ${size}`); return; }
 const attrs = { size };
 if (color.trim()) attrs.color = color.trim();
 variants.push({ name: color ? `${size} / ${color}` : size, sku: row.sku.toUpperCase(), price: parseFloat(row.price), stock: parseInt(row.stock)||0, attributes: JSON.stringify(attrs), is_active: true });
 }
 onAddVariants(variants);
 setSelectedSizes([]); setSizeRows({}); setColor('');
 showToast('success',`${variants.length} variant${variants.length>1?'s':''} added`);
 };

 const handleAddCustom = () => {
 if (!customForm.sku) { showToast('error','SKU required'); return; }
 if (!customForm.price || parseFloat(customForm.price)<=0) { showToast('error','Price must be > 0'); return; }
 const attrs = {};
 if (customForm.color) attrs.color = customForm.color;
 if (customForm.attributes) { try { Object.assign(attrs, JSON.parse(customForm.attributes)); } catch {} }
 onAddVariants([{ name: customForm.name||customForm.color||'Variant', sku: customForm.sku.toUpperCase(), price: parseFloat(customForm.price), stock: parseInt(customForm.stock)||0, attributes: Object.keys(attrs).length>0?JSON.stringify(attrs):null, is_active: true }]);
 setCustomForm({ name:'', sku:'', price:'', stock:'0', color:'', attributes:'' });
 showToast('success','Variant added');
 };

 const parseAttrs = (s) => { if (!s) return {}; try { return JSON.parse(s); } catch { return {}; } };
 const fmtV = (n) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);

 return (
 <div>
 <div style={{ display:'flex', gap:8, marginBottom:14 }}>
 <button className={`vendor-btn ${mode==='sizes'?'vendor-btn-primary':'vendor-btn-secondary'}`} style={{ padding:'7px 14px', fontSize:13 }} onClick={()=>setMode('sizes')}>👕 Select Sizes</button>
 <button className={`vendor-btn ${mode==='custom'?'vendor-btn-primary':'vendor-btn-secondary'}`} style={{ padding:'7px 14px', fontSize:13 }} onClick={()=>setMode('custom')}>⚙ Custom Variant</button>
 </div>

 {mode==='sizes' && (
 <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:12, padding:14, marginBottom:14 }}>
 <div style={{ fontWeight:700, fontSize:14, color:'#0F172A', marginBottom:10 }}>1. Select sizes</div>
 <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
 {CLOTHING_SIZES.map(size => {
 const sel = selectedSizes.includes(size);
 return (
 <button key={size} onClick={()=>toggleSize(size)}
 style={{ padding:'8px 16px', borderRadius:20, border: sel?'2px solid #7B2FF7':'1.5px solid #E2E8F0', background: sel?'linear-gradient(135deg,#7B2FF7,#FF3D8D)':'white', color: sel?'white':'#334155', fontWeight:700, fontSize:14, cursor:'pointer', transition:'all 0.15s', boxShadow: sel?'0 4px 12px rgba(123,47,247,0.3)':'none' }}>
 {size}
 </button>
 );
 })}
 </div>
 {selectedSizes.length > 0 && (
 <>
 <div style={{ fontWeight:700, fontSize:13, marginBottom:8, color:'#0F172A' }}>2. Color (optional)</div>
 <input className="vendor-form-input" style={{ maxWidth:220, marginBottom:14 }} placeholder="e.g. Red, Navy Blue" value={color} onChange={e=>setColor(e.target.value)} />
 <div style={{ fontWeight:700, fontSize:13, marginBottom:8, color:'#0F172A' }}>3. Stock & SKU per size</div>
 <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:10, marginBottom:12 }}>
 {selectedSizes.map(size => {
 const row = sizeRows[size]||{ stock:'0', sku:'', price:productPrice||'' };
 return (
 <div key={size} style={{ background:'white', border:'1.5px solid #7B2FF7', borderRadius:10, padding:'10px 12px' }}>
 <div style={{ fontWeight:800, fontSize:15, color:'#7B2FF7', marginBottom:8 }}>{size}{color?` / ${color}`:''}</div>
 <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
 {[['Stock','stock','number'],['Price ₹','price','number'],['SKU','sku','text']].map(([lbl,key,type])=>(
 <div key={key}>
 <label style={{ fontSize:11, color:'#64748B', display:'block', marginBottom:3 }}>{lbl}</label>
 <input className="vendor-form-input" style={{ padding:'6px 8px', fontSize:13 }} type={type} min={type==='number'?'0':'undefined'} value={row[key]} onChange={e=>setSizeRows(prev=>({ ...prev, [size]: { ...prev[size], [key]: type==='text'?e.target.value.toUpperCase():e.target.value } }))} />
 </div>
 ))}
 </div>
 </div>
 );
 })}
 </div>
 <button className="vendor-btn vendor-btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={handleAddSizes}>
 + Add {selectedSizes.length} Size Variant{selectedSizes.length>1?'s':''}
 </button>
 </>
 )}
 {selectedSizes.length===0 && <p style={{ fontSize:13, color:'#94A3B8', margin:0 }}>Click sizes above to select.</p>}
 </div>
 )}

 {mode==='custom' && (
 <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:12, padding:14, marginBottom:14 }}>
 <div style={{ fontWeight:700, fontSize:14, color:'#0F172A', marginBottom:10 }}>Custom Variant</div>
 <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
 {[['Name','name','text','e.g. 256GB Black'],['SKU *','sku','text','e.g. PROD-256-BK'],['Price (₹) *','price','number',''],['Stock','stock','number',''],['Color','color','text','e.g. Red']].map(([lbl,key,type,ph])=>(
 <div className="vendor-form-group" key={key}>
 <label className="vendor-form-label">{lbl}</label>
 <input className="vendor-form-input" type={type} min={type==='number'?'0':'undefined'} placeholder={ph} value={customForm[key]} onChange={e=>setCustomForm(p=>({...p,[key]:key==='sku'?e.target.value.toUpperCase():e.target.value}))} />
 </div>
 ))}
 <div className="vendor-form-group">
 <label className="vendor-form-label">Extra attrs (JSON)</label>
 <input className="vendor-form-input" placeholder='{"storage":"256GB"}' value={customForm.attributes} onChange={e=>setCustomForm(p=>({...p,attributes:e.target.value}))} />
 </div>
 </div>
 <button className="vendor-btn vendor-btn-primary" style={{ marginTop:8 }} onClick={handleAddCustom}>+ Add Variant</button>
 </div>
 )}

 {/* Current variants */}
 <div style={{ fontWeight:700, fontSize:14, color:'#0F172A', marginBottom:8 }}>Current Variants ({editVariants.length})</div>
 {editVariants.length===0 ? (
 <div style={{ padding:'18px', textAlign:'center', color:'#94A3B8', fontSize:13, background:'#F8FAFC', borderRadius:10 }}>No variants yet</div>
 ) : (
 <div style={{ overflowX:'auto' }}>
 <table className="vendor-table">
 <thead><tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
 <tbody>
 {editVariants.map((v,idx)=>{
 const [es,setEs]=React.useState(String(v.stock));
 return (
 <tr key={v.id||idx}>
 <td style={{ fontWeight:700 }}>{v.name}</td>
 <td><code style={{ fontSize:11, background:'#F1F5F9', padding:'2px 6px', borderRadius:4 }}>{v.sku}</code></td>
 <td style={{ fontWeight:600 }}>{fmtV(v.price)}</td>
 <td>
 <input type="number" min="0" value={es} onChange={e=>setEs(e.target.value)}
 onBlur={()=>{ const n=parseInt(es); if(!isNaN(n)&&n!==v.stock) onUpdateVariant(idx,{stock:n}); }}
 style={{ width:60, padding:'5px 8px', border:'1.5px solid #E2E8F0', borderRadius:7, fontSize:14, fontWeight:700, textAlign:'center', outline:'none' }} />
 </td>
 <td><span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700, background:v.stock>0?'#D1FAE5':'#FEE2E2', color:v.stock>0?'#059669':'#DC2626' }}>{v.stock>0?'In Stock':'Out of Stock'}</span></td>
 <td><button style={{ width:28,height:28,borderRadius:7,border:'1px solid #FECACA',background:'#FEF2F2',color:'#DC2626',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }} onClick={()=>onDeleteVariant(idx)}>×</button></td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 )}
 </div>
 );
};

const emptyForm = () => ({
 name: '', sku: '', price: '', discount_price: '',
 description: '', category_id: '', brand: '',
 status: 'DRAFT', is_featured: false, tax_percent: '0',
 weight: '', dimensions: '',
});
const emptyVariant = () => ({
 name: '', sku: '', price: '', stock: '0', size: '', color: '', attributes: '',
});

const Toast = ({ msg, type, onClose }) => (
 <div style={{
 position: 'fixed', top: 20, right: 20, zIndex: 9999,
 background: 'white', border: `1px solid ${type === 'success' ? '#A7F3D0' : '#FECACA'}`,
 borderLeft: `4px solid ${type === 'success' ? '#10B981' : '#EF4444'}`,
 borderRadius: 10, padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
 display: 'flex', alignItems: 'center', gap: 10, minWidth: 260,
 animation: 'toastIn 0.3s ease',
 fontSize: 14, color: '#334155',
 }}>
 <span>{msg}</span>
 <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '0 4px' }}>×</button>
 </div>
);

const VendorProducts= () => {
 const qc = useQueryClient();

 // Toast
 const [toastMsg, setToastMsg] = useState(null);
 const showToast = (type, msg) => {
 setToastMsg({ msg, type });
 setTimeout(() => setToastMsg(null), 4000);
 };

 // List state
 const [page, setPage] = useState(1);
 const [search, setSearch] = useState('');
 const [statusFilter, setStatusFilter] = useState('');
 const [catFilter, setCatFilter] = useState('');

 // Modal state
 const [showModal, setShowModal] = useState(false);
 const [activeTab, setActiveTab] = useState('info');
 const [editing, setEditing] = useState(null);
 const [form, setForm] = useState(emptyForm());

 // Images state
 const [imageUrl, setImageUrl] = useState('');
 const [editImages, setEditImages] = useState([]);

 // Variants state
 const [variantForm, setVariantForm] = useState(emptyVariant());
 const [editVariants, setEditVariants] = useState([]);
 const [editingVariantIdx, setEditingVariantIdx] = useState(null);
 const [showVariantForm, setShowVariantForm] = useState(false);

 // ── Queries ──────────────────────────────────────────
 const { data, isLoading } = useQuery({
 queryKey: ['vendor-products', page, search, statusFilter, catFilter],
 queryFn: () => vendorProductsApi.list({
 page, page_size: 15,
 search: search || undefined,
 status: statusFilter || undefined,
 category_id: catFilter || undefined,
 }).then(r => r.data.data),
 keepPreviousData: true,
 });

 const { data: catsData } = useQuery({
 queryKey: ['vendor-cats'],
 queryFn: () => vendorCategoriesApi.list().then(r => r.data.data?.items || []),
 });
 const allCats = catsData || [];
 const rootCats = allCats.filter(c => !c.parent_id);
 const subCats = allCats.filter(c => !!c.parent_id);
 // Build id→name lookup from real categories
 const catMap = Object.fromEntries(allCats.map(c => [c.id, c.name]));

 // ── Mutations ────────────────────────────────────────
 const createMut = useMutation({
 mutationFn: (d) => vendorProductsApi.create(d),
 onSuccess: async (res) => {
 const newId = res.data.data.id;
 for (const img of editImages) {
 try { await vendorProductsApi.addImage(newId, { image_url: img.image_url, alt_text: img.alt_text, is_primary: img.is_primary }); } catch {}
 }
 for (const v of editVariants) {
 try { await vendorProductsApi.createVariant(newId, v); } catch {}
 }
 qc.invalidateQueries(['vendor-products']);
 setShowModal(false);
 showToast('success', 'Product created successfully');
 },
 onError: (e) => showToast('error', e?.response?.data?.message || 'Failed to create product'),
 });

 const updateMut = useMutation({
 mutationFn: ({ id, d }) => vendorProductsApi.update(id, d),
 onSuccess: () => { qc.invalidateQueries(['vendor-products']); setShowModal(false); showToast('success', 'Product updated'); },
 onError: (e) => showToast('error', e?.response?.data?.message || 'Failed to update'),
 });

 const statusMut = useMutation({
 mutationFn: ({ id, s }) => vendorProductsApi.updateStatus(id, s),
 onSuccess: () => { qc.invalidateQueries(['vendor-products']); showToast('success', 'Status updated'); },
 onError: (e) => showToast('error', e?.response?.data?.message || 'Failed'),
 });

 const addImageMut = useMutation({
 mutationFn: ({ pid, data }) => vendorProductsApi.addImage(pid, data),
 onSuccess: async () => { await refreshEdit(); showToast('success', 'Image added'); },
 onError: (e) => showToast('error', e?.response?.data?.message || 'Failed to add image'),
 });

 const delImageMut = useMutation({
 mutationFn: ({ pid, iid }) => vendorProductsApi.deleteImage(pid, iid),
 onSuccess: async () => { await refreshEdit(); showToast('success', 'Image removed'); },
 onError: (e) => showToast('error', e?.response?.data?.message || 'Failed'),
 });

 const primaryImageMut = useMutation({
 mutationFn: ({ pid, iid }) => vendorProductsApi.setPrimaryImage(pid, iid),
 onSuccess: async () => { await refreshEdit(); },
 });

 const createVariantMut = useMutation({
 mutationFn: ({ pid, data }) => vendorProductsApi.createVariant(pid, data),
 onSuccess: async () => {
 await refreshEdit();
 setVariantForm(emptyVariant()); setShowVariantForm(false); setEditingVariantIdx(null);
 showToast('success', 'Variant added');
 },
 onError: (e) => showToast('error', e?.response?.data?.message || 'Failed to add variant'),
 });

 const updateVariantMut = useMutation({
 mutationFn: ({ pid, vid, data }) => vendorProductsApi.updateVariant(pid, vid, data),
 onSuccess: async () => {
 await refreshEdit();
 setVariantForm(emptyVariant()); setShowVariantForm(false); setEditingVariantIdx(null);
 showToast('success', 'Variant updated');
 },
 onError: (e) => showToast('error', e?.response?.data?.message || 'Failed'),
 });

 const delVariantMut = useMutation({
 mutationFn: ({ pid, vid }) => vendorProductsApi.deleteVariant(pid, vid),
 onSuccess: async () => { await refreshEdit(); showToast('success', 'Variant removed'); },
 onError: (e) => showToast('error', e?.response?.data?.message || 'Failed'),
 });

 // ── Helpers ──────────────────────────────────────────
 const refreshEdit = async () => {
 if (!editing) return;
 try {
 const res = await vendorProductsApi.get(editing.id);
 const p = res.data.data;
 setEditImages(p.images || []);
 setEditVariants(p.variants || []);
 } catch {}
 qc.invalidateQueries(['vendor-products']);
 };

 const openCreate = () => {
 setEditing(null); setForm(emptyForm());
 setEditImages([]); setEditVariants([]);
 setImageUrl(''); setVariantForm(emptyVariant());
 setShowVariantForm(false); setEditingVariantIdx(null);
 setActiveTab('info'); setShowModal(true);
 };

 const openEdit = (p) => {
 setEditing(p);
 setForm({
 name: p.name, sku: p.sku, price: String(p.price),
 discount_price: String(p.discount_price || ''),
 description: p.description || '', category_id: String(p.category_id || ''),
 brand: p.brand || '', status: p.status, is_featured: p.is_featured,
 tax_percent: String(p.tax_percent || 0), weight: String(p.weight || ''),
 dimensions: p.dimensions || '',
 });
 setEditImages(p.images || []);
 setEditVariants(p.variants || []);
 setImageUrl(''); setVariantForm(emptyVariant());
 setShowVariantForm(false); setEditingVariantIdx(null);
 setActiveTab('info'); setShowModal(true);
 };

 const handleInfoSubmit = (e) => {
 e.preventDefault();
 if (!form.price || parseFloat(form.price) <= 0) { showToast('error', 'Price must be greater than 0'); return; }
 const payload = {
 name: form.name, sku: form.sku.toUpperCase(),
 price: parseFloat(form.price),
 discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
 description: form.description || null,
 category_id: form.category_id ? parseInt(form.category_id) : null,
 brand: form.brand || null,
 tax_percent: parseFloat(form.tax_percent || '0'),
 weight: form.weight ? parseFloat(form.weight) : null,
 dimensions: form.dimensions || null,
 is_featured: form.is_featured,
 };
 if (!editing) { payload.status = form.status; createMut.mutate(payload); }
 else updateMut.mutate({ id: editing.id, d: payload });
 };

 const buildVariantPayload = () => {
 const attrs = {};
 if (variantForm.size) attrs.size = variantForm.size;
 if (variantForm.color) attrs.color = variantForm.color;
 if (variantForm.attributes) { try { Object.assign(attrs, JSON.parse(variantForm.attributes)); } catch {} }
 return {
 name: variantForm.name || `${variantForm.size || ''} ${variantForm.color || ''}`.trim() || 'Variant',
 sku: variantForm.sku.toUpperCase(),
 price: parseFloat(variantForm.price) || 0,
 stock: parseInt(variantForm.stock) || 0,
 attributes: Object.keys(attrs).length > 0 ? JSON.stringify(attrs) : null,
 is_active: true,
 };
 };

 const handleAddVariant = () => {
 if (!variantForm.sku) { showToast('error', 'Variant SKU is required'); return; }
 if (!variantForm.price || parseFloat(variantForm.price) <= 0) { showToast('error', 'Variant price must be > 0'); return; }
 const payload = buildVariantPayload();
 if (editing) {
 if (editingVariantIdx !== null) {
 const v = editVariants[editingVariantIdx];
 updateVariantMut.mutate({ pid: editing.id, vid: v.id, data: payload });
 } else {
 createVariantMut.mutate({ pid: editing.id, data: payload });
 }
 } else {
 if (editVariants.find(v => v.sku === payload.sku)) { showToast('error', 'Duplicate variant SKU'); return; }
 setEditVariants(prev => [...prev, { ...payload, id: Date.now() }]);
 setVariantForm(emptyVariant()); setShowVariantForm(false);
 }
 };

 const addImageLocal = () => {
 if (!imageUrl.trim()) { showToast('error', 'Enter an image URL'); return; }
 if (editing) {
 addImageMut.mutate({ pid: editing.id, data: { image_url: imageUrl.trim(), alt_text: '', is_primary: editImages.length === 0 } });
 } else {
 setEditImages(prev => [...prev, { id: Date.now(), image_url: imageUrl.trim(), alt_text: '', is_primary: prev.length === 0, sort_order: prev.length }]);
 }
 setImageUrl('');
 };

 const parseAttrs = (s) => { if (!s) return {}; try { return JSON.parse(s); } catch { return {}; } };

 const statusColor = (s) =>
 ({ ACTIVE: '#059669', INACTIVE: '#64748B', DRAFT: '#D97706', OUT_OF_STOCK: '#DC2626' }[s] || '#64748B');

 return (
 <div>
 {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} onClose={() => setToastMsg(null)} />}

 <div className="vendor-page-header">
 <div>
 <h1 className="vendor-page-title">My Products</h1>
 <p className="vendor-page-subtitle">{data?.total || 0} products</p>
 </div>
 <button className="vendor-btn vendor-btn-primary" onClick={openCreate}><Plus size={15} /> Add Product</button>
 </div>

 {/* Filters */}
 <div className="vendor-table-card">
 <div className="vendor-table-header">
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 9, padding: '8px 13px' }}>
 <Search size={15} style={{ color: '#94A3B8' }} />
 <input placeholder="Search name, SKU..." value={search}
 onChange={e => { setSearch(e.target.value); setPage(1); }}
 style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0F172A', outline: 'none', width: 180 }} />
 </div>
 <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
 style={{ padding: '8px 13px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 14, background: '#F8FAFC', cursor: 'pointer', outline: 'none', color: '#334155' }}>
 <option value="">All Status</option>
 {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
 </select>
 <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}
 style={{ padding: '8px 13px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 14, background: '#F8FAFC', cursor: 'pointer', outline: 'none', color: '#334155' }}>
 <option value="">All Categories</option>
 {rootCats.map(rc => (
 <optgroup key={rc.id} label={rc.name}>
 <option value={rc.id}>{rc.name} (All)</option>
 {subCats.filter(sc => sc.parent_id === rc.id).map(sc => (
 <option key={sc.id} value={sc.id}>&nbsp;&nbsp;{sc.name}</option>
 ))}
 </optgroup>
 ))}
 </select>
 </div>
 </div>

 {isLoading ? (
 <div style={{ padding: 16 }}>{Array(4).fill(0).map((_, i) => <div key={i} className="vendor-skeleton" style={{ height: 52, marginBottom: 8 }} />)}</div>
 ) : !data?.items?.length ? (
 <div className="vendor-empty">
 <div className="vendor-empty-icon"><Package size={28} /></div>
 <div className="vendor-empty-title">No products yet</div>
 <p style={{ fontSize: 13, color: '#94A3B8' }}>Create your first product to start selling</p>
 </div>
 ) : (
 <>
 <div style={{ overflowX: 'auto' }}>
 <table className="vendor-table">
 <thead>
 <tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Imgs</th><th>Variants</th><th>Status</th><th>Actions</th></tr>
 </thead>
 <tbody>
 {data.items.map((p) => (
 <tr key={p.id}>
 <td>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 {p.images?.[0] ? (
 <img src={p.images[0].image_url} alt={p.name}
 style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }}
 onError={e => { (e.target).style.display = 'none'; }} />
 ) : (
 <div style={{ width: 38, height: 38, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Package size={15} color="#94A3B8" />
 </div>
 )}
 <div>
 <div style={{ fontWeight: 600, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
 {p.brand && <div style={{ fontSize: 11, color: '#94A3B8' }}>{p.brand}</div>}
 </div>
 </div>
 </td>
 <td><code style={{ fontSize: 11, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>{p.sku}</code></td>
 <td style={{ fontSize: 12, color: '#64748B' }}>{catMap[p.category_id] ?? '—'}</td>
 <td>
 <div style={{ fontWeight: 700 }}>{fmt(p.price)}</div>
 {p.discount_price && <div style={{ fontSize: 11, color: '#10B981' }}>{fmt(p.discount_price)}</div>}
 </td>
 <td style={{ color: '#64748B', fontSize: 13 }}>{p.images?.length || 0}</td>
 <td>
 {p.variants?.length > 0 ? (
 <div>
 <span style={{ fontWeight: 600, fontSize: 13 }}>{p.variants.length}</span>
 <span style={{ marginLeft: 4, fontSize: 11, color: p.variants.some((v) => v.stock > 0) ? '#059669' : '#DC2626' }}>
 {p.variants.some((v) => v.stock > 0) ? '● Avail' : '● OOS'}
 </span>
 </div>
 ) : <span style={{ color: '#94A3B8', fontSize: 12 }}>None</span>}
 </td>
 <td>
 <select style={{ padding: '3px 8px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 11, background: '#F8FAFC', cursor: 'pointer', outline: 'none', color: statusColor(p.status), fontWeight: 600 }}
 value={p.status} onChange={e => statusMut.mutate({ id: p.id, s: e.target.value })}>
 {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
 </select>
 </td>
 <td>
 <button className="vendor-btn vendor-btn-secondary vendor-btn-icon" onClick={() => openEdit(p)} title="Edit">
 <Edit2 size={14} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="vendor-pagination">
 {Array.from({ length: data.total_pages || 1 }, (_, i) => i + 1).map(p => (
 <button key={p} className={`vendor-page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
 ))}
 </div>
 </>
 )}
 </div>

 {/* ── Create / Edit Modal ── */}
 {showModal && (
 <div className="vendor-modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
 <div className="vendor-modal" style={{ maxWidth: 620, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
 {/* Header */}
 <div className="vendor-modal-header">
 <div className="vendor-modal-title">{editing ? `Edit: ${editing.name}` : 'Add New Product'}</div>
 <button className="vendor-btn vendor-btn-secondary vendor-btn-icon" onClick={() => setShowModal(false)}><X size={15} /></button>
 </div>

 {/* Tabs */}
 <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9', padding: '0 24px', flexShrink: 0 }}>
 {(['info', 'images', 'variants']).map(tab => (
 <button key={tab} onClick={() => setActiveTab(tab)}
 style={{ padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: activeTab === tab ? '#7B2FF7' : '#64748B', borderBottom: activeTab === tab ? '2px solid #7B2FF7' : '2px solid transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}>
 {tab === 'info' && <><Package size={13} />Info</>}
 {tab === 'images' && <><Image size={13} />Images ({editImages.length})</>}
 {tab === 'variants' && <><Layers size={13} />Variants ({editVariants.length})</>}
 </button>
 ))}
 </div>

 <div style={{ flex: 1, overflowY: 'auto' }}>

 {/* ── TAB: Info ── */}
 {activeTab === 'info' && (
 <form id="vendor-product-form" onSubmit={handleInfoSubmit}>
 <div className="vendor-modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
 <div className="vendor-form-group" style={{ gridColumn: '1/-1' }}>
 <label className="vendor-form-label">Product Name *</label>
 <input className="vendor-form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
 </div>
 <div className="vendor-form-group">
 <label className="vendor-form-label">SKU * (auto UPPERCASE)</label>
 <input className="vendor-form-input" value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value.toUpperCase() }))} required placeholder="e.g. PROD-001" />
 </div>
 <div className="vendor-form-group">
 <label className="vendor-form-label">Brand</label>
 <input className="vendor-form-input" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} />
 </div>
 <div className="vendor-form-group" style={{ gridColumn: '1/-1' }}>
 <label className="vendor-form-label">Category</label>
 <select className="vendor-form-select" value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}>
 <option value="">— Select Category —</option>
 {rootCats.map(rc => (
 <optgroup key={rc.id} label={rc.name}>
 <option value={rc.id}>{rc.name} (All)</option>
 {subCats.filter(sc => sc.parent_id === rc.id).map(sc => (
 <option key={sc.id} value={sc.id}>&nbsp;&nbsp;{sc.name}</option>
 ))}
 </optgroup>
 ))}
 </select>
 </div>
 <div className="vendor-form-group">
 <label className="vendor-form-label">Selling Price (₹) *</label>
 <input className="vendor-form-input" type="number" step="0.01" min="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required />
 </div>
 <div className="vendor-form-group">
 <label className="vendor-form-label">MRP / Original Price (₹)</label>
 <input className="vendor-form-input" type="number" step="0.01" min="0" value={form.discount_price} onChange={e => setForm(p => ({ ...p, discount_price: e.target.value }))} placeholder="Optional" />
 </div>
 <div className="vendor-form-group">
 <label className="vendor-form-label">Tax %</label>
 <input className="vendor-form-input" type="number" step="0.01" min="0" value={form.tax_percent} onChange={e => setForm(p => ({ ...p, tax_percent: e.target.value }))} />
 </div>
 <div className="vendor-form-group">
 <label className="vendor-form-label">Status</label>
 <select className="vendor-form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
 {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
 </select>
 </div>
 <div className="vendor-form-group">
 <label className="vendor-form-label">Weight (kg)</label>
 <input className="vendor-form-input" type="number" step="0.001" min="0" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} placeholder="e.g. 0.5" />
 </div>
 <div className="vendor-form-group">
 <label className="vendor-form-label">Dimensions (L×W×H cm)</label>
 <input className="vendor-form-input" value={form.dimensions} onChange={e => setForm(p => ({ ...p, dimensions: e.target.value }))} placeholder="e.g. 30x20x10cm" />
 </div>
 <div className="vendor-form-group" style={{ gridColumn: '1/-1' }}>
 <label className="vendor-form-label">Description</label>
 <textarea className="vendor-form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your product..." />
 </div>
 </div>
 </form>
 )}

 {/* ── TAB: Images ── */}
 {activeTab === 'images' && (
 <div className="vendor-modal-body">
 <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
 <input className="vendor-form-input" style={{ flex: 1 }}
 placeholder="Paste image URL..." value={imageUrl}
 onChange={e => setImageUrl(e.target.value)}
 onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageLocal(); } }} />
 <button className="vendor-btn vendor-btn-primary" onClick={addImageLocal} disabled={addImageMut.isLoading}>
 <Plus size={14} /> Add
 </button>
 </div>

 {editImages.length === 0 ? (
 <div className="vendor-empty" style={{ padding: '28px 16px' }}>
 <div className="vendor-empty-icon"><Image size={22} /></div>
 <div className="vendor-empty-title">No images yet</div>
 <p style={{ fontSize: 13, color: '#94A3B8' }}>Paste an image URL and click Add</p>
 </div>
 ) : (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 10 }}>
 {editImages.map((img, idx) => (
 <div key={img.id || idx} style={{ borderRadius: 10, overflow: 'hidden', border: img.is_primary ? '2px solid #7B2FF7' : '1px solid #E2E8F0', position: 'relative' }}>
 <img src={img.image_url} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
 onError={e => { (e.target).src = 'https://placehold.co/120x110/F1F5F9/94A3B8?text=Error'; }} />
 {img.is_primary && (
 <div style={{ position: 'absolute', top: 5, left: 5, background: '#7B2FF7', color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>PRIMARY</div>
 )}
 <div style={{ display: 'flex', gap: 3, padding: 5, background: '#F8FAFC' }}>
 {!img.is_primary && (
 <button className="vendor-btn vendor-btn-secondary" style={{ flex: 1, padding: '3px 5px', fontSize: 9 }}
 onClick={() => editing ? primaryImageMut.mutate({ pid: editing.id, iid: img.id }) : setEditImages(prev => prev.map((x, i) => ({ ...x, is_primary: i === idx })))}>
 Primary
 </button>
 )}
 <button style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
 onClick={() => editing ? delImageMut.mutate({ pid: editing.id, iid: img.id }) : setEditImages(prev => prev.filter((_, i) => i !== idx))}>
 <X size={11} />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 10 }}>Min 1 image required. No maximum limit.</p>
 </div>
 )}

 {/* ── TAB: Variants ── */}
 {activeTab === 'variants' && (
 <div className="vendor-modal-body">
 <SizeVariantBuilder
 productSku={form.sku}
 productPrice={form.price}
 editVariants={editVariants}
 onAddVariants={(variants) => {
 if (editing) {
 variants.forEach(v => createVariantMut.mutate({ pid: editing.id, data: v }));
 } else {
 setEditVariants(prev => [...prev, ...variants.map(v => ({ ...v, id: Date.now() + Math.random() }))]);
 }
 }}
 onUpdateVariant={(idx, data) => {
 if (editing) {
 const v = editVariants[idx];
 updateVariantMut.mutate({ pid: editing.id, vid: v.id, data });
 } else {
 setEditVariants(prev => prev.map((v, i) => i === idx ? { ...v, ...data } : v));
 }
 }}
 onDeleteVariant={(idx) => {
 if (editing) {
 const v = editVariants[idx];
 delVariantMut.mutate({ pid: editing.id, vid: v.id });
 } else {
 setEditVariants(prev => prev.filter((_, i) => i !== idx));
 }
 }}
 showToast={showToast}
 />
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="vendor-modal-footer">
 <button className="vendor-btn vendor-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
 {activeTab === 'info' && (
 <button className="vendor-btn vendor-btn-primary" form="vendor-product-form" type="submit"
 disabled={createMut.isLoading || updateMut.isLoading}>
 {(createMut.isLoading || updateMut.isLoading) ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
 </button>
 )}
 {activeTab !== 'info' && (
 <button className="vendor-btn vendor-btn-secondary" onClick={() => setActiveTab('info')}>← Back to Info</button>
 )}
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default VendorProducts;
