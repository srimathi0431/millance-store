import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Tag, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../services/api';
import { useToast } from '../components/Toast';

const PAGE_SIZE = 10;

const CAT_ICONS: Record<string, string> = {
  'Men':'👔','Women':'👗','Kids':'🧒','Electronics':'📱','Footwear':'👟',
  'Beauty':'💄','Home & Kitchen':'🏠','Accessories':'👜','Sports':'⚽',
  'Books':'📚','Grocery':'🛒','Toys & Games':'🎮','Automotive':'🚗',
  'Furniture':'🛋️','Jewellery':'💍','Health':'💊','Pet Supplies':'🐾',
  'Music':'🎸','Office':'💼','Garden':'🌱','Appliances':'🔌',
  'Luggage':'🧳','Baby':'🍼','Cameras':'📷','Gaming':'🎯',
};
const CAT_COLORS = [
  '#FF7A00','#7B2FF7','#FF3D8D','#059669','#2563EB',
  '#D97706','#DC2626','#0891B2','#7C3AED','#EA580C',
  '#16A34A','#9333EA','#E11D48','#0284C7','#CA8A04',
  '#0F766E','#BE185D','#1D4ED8','#B45309','#047857',
  '#6D28D9','#B91C1C','#0369A1','#92400E','#065F46',
];

const CategoriesPage: React.FC = () => {
  const navigate  = useNavigate();
  const qc        = useQueryClient();
  const { toast } = useToast();

  // Fetch all categories from real API
  const { data: catsData, isLoading } = useQuery({
    queryKey: ['admin-categories-all'],
    queryFn: () => categoriesApi.list({ page: 1, page_size: 200 }).then(r => r.data.data?.items || []),
  });
  const allCats: any[] = catsData || [];
  const rootCats = allCats.filter(c => !c.parent_id).sort((a, b) => (a.sort_order - b.sort_order) || a.name.localeCompare(b.name));

  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [deleteId,  setDeleteId]  = useState<number | null>(null);
  const emptyForm = { name: '', description: '', sort_order: '0', is_active: true };
  const [form,      setForm]      = useState(emptyForm);

  const filtered   = rootCats.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const createMut = useMutation({
    mutationFn: (d: any) => categoriesApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['admin-categories-all']); setShowModal(false); toast('success', 'Category created'); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed'),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, d }: any) => categoriesApi.update(id, d),
    onSuccess: () => { qc.invalidateQueries(['admin-categories-all']); setShowModal(false); toast('success', 'Updated'); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries(['admin-categories-all']); setDeleteId(null); toast('success', 'Deleted'); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Cannot delete — subcategories or products depend on it'),
  });
  const statusMut = useMutation({
    mutationFn: ({ id, v }: any) => categoriesApi.updateStatus(id, v),
    onSuccess: () => { qc.invalidateQueries(['admin-categories-all']); toast('success', 'Status updated'); },
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit   = (c: any) => { setEditing(c); setForm({ name: c.name, description: c.description || '', sort_order: String(c.sort_order || 0), is_active: c.is_active }); setShowModal(true); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, parent_id: null, sort_order: parseInt(form.sort_order || '0') };
    editing ? updateMut.mutate({ id: editing.id, d: payload }) : createMut.mutate(payload);
  };

  const colorFor = (idx: number) => CAT_COLORS[idx % CAT_COLORS.length];
  const iconFor  = (name: string) => CAT_ICONS[name] || '📦';

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">{rootCats.length} categories · click any category to view subcategories</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="admin-search-input" style={{ maxWidth: 320 }}>
          <Search size={15} style={{ color: '#94A3B8' }} />
          <input placeholder="Search categories..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
          {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 18 }} />)}
        </div>
      ) : pageItems.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><Tag size={28} /></div>
          <div className="admin-empty-title">No categories found</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18, marginBottom: 28 }}>
            {pageItems.map((cat: any, idx: number) => {
              const color   = colorFor(idx);
              // Sub-categories from the same real fetch
              const subCats = allCats.filter(c => c.parent_id === cat.id);

              return (
                <div key={cat.id}
                  style={{ background: 'white', borderRadius: 18, border: '1px solid #E2E8F0', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 1px 4px rgba(15,23,42,0.05)' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 12px 32px rgba(15,23,42,0.12)`; el.style.borderColor = color; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 1px 4px rgba(15,23,42,0.05)'; el.style.borderColor = '#E2E8F0'; }}
                  onClick={() => navigate(`/admin/categories/${cat.id}`)}
                >
                  <div style={{ height: 8, background: color }} />
                  <div style={{ padding: '20px 20px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                          {iconFor(cat.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>{cat.name}</div>
                          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>{subCats.length} subcategories</div>
                        </div>
                      </div>
                      <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cat.is_active ? '#D1FAE5' : '#F1F5F9', color: cat.is_active ? '#059669' : '#94A3B8' }}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {cat.description && (
                      <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 12px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {cat.description}
                      </p>
                    )}

                    {/* Subcategory pills */}
                    {subCats.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                        {subCats.slice(0, 4).map((sc: any) => (
                          <span key={sc.id} style={{ padding: '3px 9px', borderRadius: 20, background: `${color}15`, color, fontSize: 11, fontWeight: 600 }}>{sc.name}</span>
                        ))}
                        {subCats.length > 4 && (
                          <span style={{ padding: '3px 9px', borderRadius: 20, background: '#F1F5F9', color: '#64748B', fontSize: 11, fontWeight: 600 }}>+{subCats.length - 4} more</span>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: 13, color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        View Subcategories <ChevronRight size={14} />
                      </span>
                      <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                        <button className="admin-btn admin-btn-secondary admin-btn-icon" style={{ width: 30, height: 30 }}
                          onClick={e => { e.stopPropagation(); openEdit(cat); }}><Edit2 size={13} /></button>
                        <button className="admin-btn admin-btn-danger admin-btn-icon" style={{ width: 30, height: 30 }}
                          onClick={e => { e.stopPropagation(); setDeleteId(cat.id); }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
        </>
      )}

      {/* Create / Edit modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="admin-modal" style={{ maxWidth: 460 }}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">{editing ? 'Edit Category' : 'Add Root Category'}</div>
              <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Category Name *</label>
                  <input className="admin-form-input" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea className="admin-form-textarea" value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sort Order</label>
                    <input className="admin-form-input" type="number" min="0" value={form.sort_order}
                      onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} />
                  </div>
                  <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
                    <input type="checkbox" id="cat-active" checked={form.is_active}
                      onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} style={{ width: 16, height: 16 }} />
                    <label htmlFor="cat-active" className="admin-form-label" style={{ margin: 0 }}>Active</label>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={createMut.isLoading || updateMut.isLoading}>
                  {createMut.isLoading || updateMut.isLoading ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 380 }}>
            <div className="admin-modal-header"><div className="admin-modal-title">Delete Category</div></div>
            <div className="admin-modal-body"><p style={{ color: '#334155', margin: 0 }}>This will fail if subcategories or products depend on it.</p></div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" style={{ background: '#EF4444' }}
                onClick={() => deleteMut.mutate(deleteId!)} disabled={deleteMut.isLoading}>
                {deleteMut.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
