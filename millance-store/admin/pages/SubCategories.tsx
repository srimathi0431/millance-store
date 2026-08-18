import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Tag, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../services/api';
import { useToast } from '../components/Toast';

const PAGE_SIZE = 10;

const CAT_COLORS = [
  '#FF7A00','#7B2FF7','#FF3D8D','#059669','#2563EB',
  '#D97706','#DC2626','#0891B2','#7C3AED','#EA580C',
  '#16A34A','#9333EA','#E11D48','#0284C7','#CA8A04',
];

const SubCategoriesPage: React.FC = () => {
  const { catId } = useParams<{ catId: string }>();
  const navigate   = useNavigate();
  const qc         = useQueryClient();
  const { toast }  = useToast();
  const catIdNum   = parseInt(catId || '0');

  // Fetch all categories from real API
  const { data: catsData } = useQuery({
    queryKey: ['admin-categories-all'],
    queryFn: () => categoriesApi.list({ page: 1, page_size: 200 }).then(r => r.data.data?.items || []),
  });
  const allCats: any[] = catsData || [];
  const rootCat  = allCats.find(c => c.id === catIdNum);
  const subCats  = allCats.filter(c => c.parent_id === catIdNum).sort((a, b) => (a.sort_order - b.sort_order) || a.name.localeCompare(b.name));

  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [deleteId,  setDeleteId]  = useState<number | null>(null);
  const emptyForm = { name: '', description: '', sort_order: '0', is_active: true };
  const [form, setForm] = useState(emptyForm);

  const filtered   = subCats.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const createMut = useMutation({
    mutationFn: (d: any) => categoriesApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['admin-categories-all']); setShowModal(false); toast('success', 'Subcategory created'); },
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
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Cannot delete — products depend on this subcategory'),
  });
  const statusMut = useMutation({
    mutationFn: ({ id, v }: any) => categoriesApi.updateStatus(id, v),
    onSuccess: () => { qc.invalidateQueries(['admin-categories-all']); toast('success', 'Status updated'); },
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit   = (c: any) => { setEditing(c); setForm({ name: c.name, description: c.description || '', sort_order: String(c.sort_order || 0), is_active: c.is_active }); setShowModal(true); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, parent_id: catIdNum, sort_order: parseInt(form.sort_order || '0') };
    editing ? updateMut.mutate({ id: editing.id, d: payload }) : createMut.mutate(payload);
  };

  const colorFor = (idx: number) => CAT_COLORS[idx % CAT_COLORS.length];

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button onClick={() => navigate('/admin/categories')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, padding: 0 }}>
          <ChevronLeft size={16} /> Categories
        </button>
        <span style={{ color: '#CBD5E1' }}>/</span>
        <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 14 }}>{rootCat?.name || `Category #${catIdNum}`}</span>
      </div>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{rootCat?.name || 'Category'} — Subcategories</h1>
          <p className="admin-page-subtitle">{subCats.length} subcategories · click any to view products</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={15} /> Add Subcategory
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="admin-search-input" style={{ maxWidth: 320 }}>
          <Search size={15} style={{ color: '#94A3B8' }} />
          <input placeholder="Search subcategories..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      {pageItems.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><Tag size={28} /></div>
          <div className="admin-empty-title">No subcategories found</div>
          <div className="admin-empty-text">Add subcategories to organise products under {rootCat?.name}</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
            {pageItems.map((sc: any, idx: number) => {
              const color = colorFor(idx);
              return (
                <div key={sc.id}
                  style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', transition: 'all 0.25s', cursor: 'pointer', boxShadow: '0 1px 4px rgba(15,23,42,0.05)' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = `0 8px 24px rgba(15,23,42,0.12)`; el.style.borderColor = color; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 1px 4px rgba(15,23,42,0.05)'; el.style.borderColor = '#E2E8F0'; }}
                  onClick={() => navigate(`/admin/categories/${catIdNum}/${sc.id}/products`)}
                >
                  <div style={{ height: 6, background: color }} />
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', marginBottom: 2 }}>{sc.name}</div>
                        {sc.description && <div style={{ fontSize: 12, color: '#94A3B8' }}>{sc.description}</div>}
                      </div>
                      <span style={{ padding: '2px 8px', borderRadius: 20, background: sc.is_active ? '#D1FAE5' : '#F1F5F9', color: sc.is_active ? '#059669' : '#94A3B8', fontSize: 11, fontWeight: 700 }}>
                        {sc.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: 13, color, fontWeight: 700 }}>View Products →</span>
                      <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                        <button className="admin-btn admin-btn-secondary admin-btn-icon" style={{ width: 28, height: 28 }}
                          onClick={e => { e.stopPropagation(); openEdit(sc); }}><Edit2 size={12} /></button>
                        <button className="admin-btn admin-btn-danger admin-btn-icon" style={{ width: 28, height: 28 }}
                          onClick={e => { e.stopPropagation(); setDeleteId(sc.id); }}><Trash2 size={12} /></button>
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

      {showModal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="admin-modal" style={{ maxWidth: 440 }}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">{editing ? 'Edit Subcategory' : `Add Subcategory under ${rootCat?.name}`}</div>
              <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Subcategory Name *</label>
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
                    <input type="checkbox" id="sub-active" checked={form.is_active}
                      onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} style={{ width: 16, height: 16 }} />
                    <label htmlFor="sub-active" className="admin-form-label" style={{ margin: 0 }}>Active</label>
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
            <div className="admin-modal-header"><div className="admin-modal-title">Delete Subcategory</div></div>
            <div className="admin-modal-body"><p style={{ color: '#334155', margin: 0 }}>This will fail if products depend on this subcategory.</p></div>
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

export default SubCategoriesPage;
