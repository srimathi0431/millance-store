import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '../services/api';
import { useToast } from '../components/Toast';

const fmt = (n) =>
 new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const STATUS_TABS = [
 { key: 'ALL', label: 'All', color: '#334155' },
 { key: 'ACTIVE', label: 'Active', color: '#059669' },
 { key: 'INACTIVE', label: 'Inactive', color: '#64748B' },
 { key: 'OUT_OF_STOCK', label: 'Out of Stock', color: '#DC2626' },
 { key: 'DRAFT', label: 'Draft', color: '#D97706' },
];

const statusBadge = (s) => {
 const map = {
 ACTIVE: { bg: '#D1FAE5', color: '#059669' },
 INACTIVE: { bg: '#F1F5F9', color: '#64748B' },
 OUT_OF_STOCK: { bg: '#FEE2E2', color: '#DC2626' },
 DRAFT: { bg: '#FEF3C7', color: '#D97706' },
 };
 const st = map[s] || { bg: '#F1F5F9', color: '#64748B' };
 return (
 <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
 {s.replace('_', ' ')}
 </span>
 );
};

const PAGE_SIZE = 10;

const CategoryProductsPage= () => {
 const { catId, subId } = useParams();
 const navigate = useNavigate();
 const qc = useQueryClient();
 const { toast } = useToast();

 const catIdNum = parseInt(catId || '0');
 const subIdNum = parseInt(subId || '0');

 // Fetch category names from real API
 const { data: catsData } = useQuery({
 queryKey: ['admin-categories-all'],
 queryFn: () => categoriesApi.list({ page: 1, page_size: 200 }).then(r => r.data.data?.items || []),
 });
 const allCats = catsData || [];
 const rootCat = allCats.find(c => c.id === catIdNum);
 const subCat = allCats.find(c => c.id === subIdNum);

 // Fetch real products filtered by this subcategory
 const { data: productsData, isLoading } = useQuery({
 queryKey: ['admin-products-subcat', subIdNum],
 queryFn: () => productsApi.list({ page: 1, page_size: 200, category_id: subIdNum }).then(r => r.data.data?.items || []),
 enabled: subIdNum > 0,
 });
 const allProducts = productsData || [];

 const [activeTab, setActiveTab] = useState('ALL');
 const [search, setSearch] = useState('');
 const [page, setPage] = useState(1);
 const [deleteId, setDeleteId] = useState(null);

 const filtered = useMemo(() => {
 let list = allProducts;
 if (activeTab !== 'ALL') list = list.filter(p => p.status === activeTab);
 if (search.trim()) {
 const q = search.toLowerCase();
 list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
 }
 return list;
 }, [allProducts, activeTab, search]);

 const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
 const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

 const counts = useMemo(() => {
 const c = { ALL: allProducts.length };
 STATUS_TABS.slice(1).forEach(t => { c[t.key] = allProducts.filter(p => p.status === t.key).length; });
 return c;
 }, [allProducts]);

 const statusMut = useMutation({
 mutationFn: ({ id, s }) => productsApi.updateStatus(id, s),
 onSuccess: () => { qc.invalidateQueries(['admin-products-subcat']); toast('success', 'Status updated'); },
 onError: (e) => toast('error', e?.response?.data?.message || 'Failed'),
 });

 const deleteMut = useMutation({
 mutationFn: (id) => productsApi.delete(id),
 onSuccess: () => { qc.invalidateQueries(['admin-products-subcat']); setDeleteId(null); toast('success', 'Product deleted'); },
 onError: (e) => toast('error', e?.response?.data?.message || 'Failed'),
 });

 return (
 <div>
 {/* Breadcrumb */}
 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
 <button onClick={() => navigate('/admin/categories')}
 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, padding: 0 }}>
 <ChevronLeft size={16} /> Categories
 </button>
 <span style={{ color: '#CBD5E1' }}>/</span>
 <button onClick={() => navigate(`/admin/categories/${catIdNum}`)}
 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 14, padding: 0 }}>
 {rootCat?.name || `Category #${catIdNum}`}
 </button>
 <span style={{ color: '#CBD5E1' }}>/</span>
 <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 14 }}>{subCat?.name || `Subcategory #${subIdNum}`}</span>
 </div>

 <div className="admin-page-header">
 <div>
 <h1 className="admin-page-title">{subCat?.name || 'Products'}</h1>
 <p className="admin-page-subtitle">
 {rootCat?.name} › {subCat?.name} · {allProducts.length} products
 </p>
 </div>
 <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/products')}>
 <Plus size={15} /> Add Product
 </button>
 </div>

 {/* Status tabs */}
 <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
 {STATUS_TABS.map(tab => (
 <button key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); }}
 style={{ flex: 1, padding: '13px 8px', border: 'none', cursor: 'pointer', background: activeTab === tab.key ? tab.color : 'white', color: activeTab === tab.key ? 'white' : '#64748B', fontWeight: 700, fontSize: 13, borderRight: '1px solid #F1F5F9', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
 <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{counts[tab.key] || 0}</span>
 <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tab.label}</span>
 </button>
 ))}
 </div>

 <div className="admin-table-card">
 <div className="admin-table-header">
 <div className="admin-table-title" style={{ fontSize: 15 }}>
 {activeTab === 'ALL' ? 'All Products' : `${activeTab.replace('_', ' ')} Products`}
 <span style={{ marginLeft: 8, fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>({filtered.length} items)</span>
 </div>
 <div className="admin-search-input">
 <Search size={15} style={{ color: '#94A3B8' }} />
 <input placeholder="Search name or SKU..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
 </div>
 </div>

 {isLoading ? (
 <div style={{ padding: 20 }}>{Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />)}</div>
 ) : pageItems.length === 0 ? (
 <div className="admin-empty">
 <div className="admin-empty-icon"><Package size={28} /></div>
 <div className="admin-empty-title">No products found</div>
 <div className="admin-empty-text">{search ? 'Try a different search term' : `No products in this subcategory yet`}</div>
 </div>
 ) : (
 <>
 <div style={{ overflowX: 'auto' }}>
 <table className="admin-table">
 <thead>
 <tr><th>Product</th><th>SKU</th><th>Price</th><th>Variants</th><th>Status</th><th>Actions</th></tr>
 </thead>
 <tbody>
 {pageItems.map((p) => (
 <tr key={p.id}>
 <td>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 {p.images?.[0] ? (
 <img src={p.images[0].image_url} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }}
 onError={e => { (e.target).style.display = 'none'; }} />
 ) : (
 <div style={{ width: 44, height: 44, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Package size={18} color="#94A3B8" />
 </div>
 )}
 <div>
 <div style={{ fontWeight: 600, fontSize: 14, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
 {p.brand && <div style={{ fontSize: 12, color: '#94A3B8' }}>{p.brand}</div>}
 </div>
 </div>
 </td>
 <td><code style={{ fontSize: 12, background: '#F1F5F9', padding: '2px 7px', borderRadius: 4 }}>{p.sku}</code></td>
 <td>
 <div style={{ fontWeight: 700 }}>{fmt(p.price)}</div>
 {p.discount_price && <div style={{ fontSize: 12, color: '#10B981' }}>{fmt(p.discount_price)}</div>}
 </td>
 <td style={{ color: '#64748B', fontSize: 13 }}>
 {(p.variants?.length || 0) > 0
 ? <span style={{ fontWeight: 700, color: '#0F172A' }}>{p.variants.length}</span>
 : <span style={{ color: '#94A3B8' }}>—</span>}
 </td>
 <td>{statusBadge(p.status)}</td>
 <td>
 <div style={{ display: 'flex', gap: 6 }}>
 <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => navigate('/admin/products')} title="Edit"><Edit2 size={14} /></button>
 <button className="admin-btn admin-btn-danger admin-btn-icon" onClick={() => setDeleteId(p.id)} title="Delete"><Trash2 size={14} /></button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {totalPages > 1 && (
 <div className="admin-pagination">
 <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ opacity: page === 1 ? 0.4 : 1 }}>‹</button>
 {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
 <button key={p} className={`admin-page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
 ))}
 <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ opacity: page === totalPages ? 0.4 : 1 }}>›</button>
 </div>
 )}

 <div style={{ padding: '10px 20px', fontSize: 13, color: '#94A3B8', borderTop: '1px solid #F8FAFC' }}>
 Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products
 </div>
 </>
 )}
 </div>

 {deleteId && (
 <div className="admin-modal-overlay">
 <div className="admin-modal" style={{ maxWidth: 380 }}>
 <div className="admin-modal-header"><div className="admin-modal-title">Delete Product</div></div>
 <div className="admin-modal-body"><p style={{ color: '#334155', margin: 0 }}>Are you sure? This cannot be undone.</p></div>
 <div className="admin-modal-footer">
 <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
 <button className="admin-btn admin-btn-primary" style={{ background: '#EF4444' }}
 onClick={() => deleteMut.mutate(deleteId)} disabled={deleteMut.isLoading}>
 {deleteMut.isLoading ? 'Deleting...' : 'Delete'}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default CategoryProductsPage;
