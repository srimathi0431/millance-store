import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, Package, Image, Layers, X } from 'lucide-react';
import { productsApi, categoriesApi } from '../services/api';
import { useToast } from '../components/Toast';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const STATUSES = ['ACTIVE', 'INACTIVE', 'DRAFT', 'OUT_OF_STOCK'];
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];

// ─── Size Variant Builder ────────────────────────────────────────
const SizeVariantBuilder: React.FC<{
  productSku: string;
  productPrice: string;
  editVariants: any[];
  onAddVariants: (v: any[]) => void;
  onUpdateVariant: (idx: number, data: any) => void;
  onDeleteVariant: (idx: number) => void;
  toast: (t: 'success' | 'error', m: string) => void;
}> = ({ productSku, productPrice, editVariants, onAddVariants, onUpdateVariant, onDeleteVariant, toast }) => {
  const [mode, setMode]               = useState<'sizes' | 'custom'>('sizes');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [color, setColor]             = useState('');
  const [sizeRows, setSizeRows]       = useState<Record<string, { stock: string; sku: string; price: string }>>({});
  const [customForm, setCustomForm]   = useState({ name: '', sku: '', price: '', stock: '0', color: '', attributes: '' });

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => {
      const isSelected = prev.includes(size);
      if (!isSelected) {
        const skuSuffix = size.replace(' ', '').toUpperCase();
        setSizeRows(r => ({ ...r, [size]: { stock: '0', sku: `${productSku || 'PROD'}-${skuSuffix}`, price: productPrice || '' } }));
      }
      return isSelected ? prev.filter(s => s !== size) : [...prev, size];
    });
  };

  const handleAddSizes = () => {
    if (!selectedSizes.length) { toast('error', 'Select at least one size'); return; }
    const variants: any[] = [];
    for (const size of selectedSizes) {
      const row = sizeRows[size];
      if (!row?.sku) { toast('error', `SKU required for size ${size}`); return; }
      if (!row.price || parseFloat(row.price) <= 0) { toast('error', `Price must be > 0 for size ${size}`); return; }
      const attrs: any = { size };
      if (color.trim()) attrs.color = color.trim();
      variants.push({
        name: color ? `${size} / ${color}` : size,
        sku: row.sku.toUpperCase(),
        price: parseFloat(row.price),
        stock: parseInt(row.stock) || 0,
        attributes: JSON.stringify(attrs),
        is_active: true,
      });
    }
    onAddVariants(variants);
    setSelectedSizes([]); setSizeRows({}); setColor('');
    toast('success', `${variants.length} size variant${variants.length > 1 ? 's' : ''} added`);
  };

  const handleAddCustom = () => {
    if (!customForm.sku) { toast('error', 'SKU required'); return; }
    if (!customForm.price || parseFloat(customForm.price) <= 0) { toast('error', 'Price must be > 0'); return; }
    const attrs: any = {};
    if (customForm.color) attrs.color = customForm.color;
    if (customForm.attributes) { try { Object.assign(attrs, JSON.parse(customForm.attributes)); } catch {} }
    onAddVariants([{
      name: customForm.name || customForm.color || 'Variant',
      sku: customForm.sku.toUpperCase(),
      price: parseFloat(customForm.price),
      stock: parseInt(customForm.stock) || 0,
      attributes: Object.keys(attrs).length > 0 ? JSON.stringify(attrs) : null,
      is_active: true,
    }]);
    setCustomForm({ name: '', sku: '', price: '', stock: '0', color: '', attributes: '' });
    toast('success', 'Variant added');
  };

  const parseAttrs = (s: string | null) => { if (!s) return {}; try { return JSON.parse(s); } catch { return {}; } };

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button className={`admin-btn ${mode === 'sizes' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => setMode('sizes')}>
          👕 Select Sizes
        </button>
        <button className={`admin-btn ${mode === 'custom' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => setMode('custom')}>
          ⚙ Custom Variant
        </button>
      </div>

      {/* Size selector */}
      {mode === 'sizes' && (
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 10 }}>1. Click to select sizes</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {CLOTHING_SIZES.map(size => {
              const sel = selectedSizes.includes(size);
              return (
                <button key={size} onClick={() => toggleSize(size)} style={{
                  padding: '8px 18px', borderRadius: 20,
                  border: sel ? '2px solid #FF7A00' : '1.5px solid #E2E8F0',
                  background: sel ? 'linear-gradient(135deg,#FF7A00,#FF3D8D)' : 'white',
                  color: sel ? 'white' : '#334155',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  boxShadow: sel ? '0 4px 12px rgba(255,122,0,0.3)' : 'none',
                  transition: 'all 0.15s',
                }}>
                  {size}
                </button>
              );
            })}
          </div>

          {selectedSizes.length > 0 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 8 }}>2. Color (optional, same for all)</div>
              <input className="admin-form-input" style={{ maxWidth: 240, marginBottom: 14 }}
                placeholder="e.g. Red, Navy Blue, Black"
                value={color} onChange={e => setColor(e.target.value)} />

              <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 10 }}>3. Stock · Price · SKU per size</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 10, marginBottom: 14 }}>
                {selectedSizes.map(size => {
                  const row = sizeRows[size] || { stock: '0', sku: '', price: productPrice || '' };
                  const inStock = parseInt(row.stock) > 0;
                  return (
                    <div key={size} style={{ background: 'white', border: '2px solid #FF7A00', borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: 16, color: '#FF7A00' }}>{size}{color ? ` / ${color}` : ''}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: inStock ? '#D1FAE5' : '#FEE2E2', color: inStock ? '#059669' : '#DC2626' }}>
                          {inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                        {(['stock', 'price', 'sku'] as const).map(field => (
                          <div key={field}>
                            <label style={{ fontSize: 11, color: '#64748B', display: 'block', marginBottom: 3, textTransform: 'capitalize' }}>{field === 'price' ? 'Price ₹' : field}</label>
                            <input className="admin-form-input" style={{ padding: '6px 8px', fontSize: 13 }}
                              type={field === 'sku' ? 'text' : 'number'}
                              min={field !== 'sku' ? '0' : undefined}
                              value={row[field]}
                              onChange={e => setSizeRows(prev => ({
                                ...prev,
                                [size]: { ...prev[size], [field]: field === 'sku' ? e.target.value.toUpperCase() : e.target.value }
                              }))} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="admin-btn admin-btn-primary" onClick={handleAddSizes}
                style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
                <Plus size={15} /> Add {selectedSizes.length} Size Variant{selectedSizes.length > 1 ? 's' : ''}
              </button>
            </>
          )}

          {selectedSizes.length === 0 && (
            <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
              Click the size buttons above to select which sizes this product comes in.
            </p>
          )}
        </div>
      )}

      {/* Custom variant */}
      {mode === 'custom' && (
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 12 }}>Custom Variant (e.g. 256GB Black, Large Blue)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Variant Name</label>
              <input className="admin-form-input" value={customForm.name}
                onChange={e => setCustomForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. 256GB Black" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">SKU *</label>
              <input className="admin-form-input" value={customForm.sku}
                onChange={e => setCustomForm(p => ({ ...p, sku: e.target.value.toUpperCase() }))} placeholder="e.g. PROD-256-BK" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Price (₹) *</label>
              <input className="admin-form-input" type="number" step="0.01" min="0.01" value={customForm.price}
                onChange={e => setCustomForm(p => ({ ...p, price: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Stock</label>
              <input className="admin-form-input" type="number" min="0" value={customForm.stock}
                onChange={e => setCustomForm(p => ({ ...p, stock: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Color</label>
              <input className="admin-form-input" value={customForm.color}
                onChange={e => setCustomForm(p => ({ ...p, color: e.target.value }))} placeholder="e.g. Midnight Black" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Extra attrs (JSON)</label>
              <input className="admin-form-input" value={customForm.attributes}
                onChange={e => setCustomForm(p => ({ ...p, attributes: e.target.value }))} placeholder='{"storage":"256GB"}' />
            </div>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={handleAddCustom} style={{ marginTop: 4 }}>
            <Plus size={14} /> Add Variant
          </button>
        </div>
      )}

      {/* Existing variants list */}
      <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 8 }}>
        Current Variants ({editVariants.length})
        {editVariants.length > 0 && (
          <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: editVariants.some(v => v.stock > 0) ? '#059669' : '#EF4444' }}>
            {editVariants.some(v => v.stock > 0) ? '● Available' : '● All Out of Stock'}
          </span>
        )}
      </div>
      {editVariants.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: 13, background: '#F8FAFC', borderRadius: 10 }}>
          No variants yet — select sizes above or add a custom variant
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Size / Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {editVariants.map((v: any, idx: number) => {
                const attrs = parseAttrs(v.attributes);
                return (
                  <VariantRow key={v.id || idx} v={v} idx={idx} attrs={attrs}
                    onUpdate={onUpdateVariant} onDelete={onDeleteVariant} />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Separate row component so each row has its own stock state
const VariantRow: React.FC<{
  v: any; idx: number; attrs: any;
  onUpdate: (idx: number, data: any) => void;
  onDelete: (idx: number) => void;
}> = ({ v, idx, attrs, onUpdate, onDelete }) => {
  const [editStock, setEditStock] = useState(String(v.stock));
  const fmt2 = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{v.name}</div>
        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {Object.entries(attrs).map(([k, val]) => (
            <span key={k} style={{ background: '#F1F5F9', padding: '1px 6px', borderRadius: 10 }}>{k}: {String(val)}</span>
          ))}
        </div>
      </td>
      <td><code style={{ fontSize: 11, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>{v.sku}</code></td>
      <td style={{ fontWeight: 600 }}>{fmt2(v.price)}</td>
      <td>
        <input type="number" min="0" value={editStock}
          onChange={e => setEditStock(e.target.value)}
          onBlur={() => {
            const n = parseInt(editStock);
            if (!isNaN(n) && n !== v.stock) onUpdate(idx, { stock: n });
          }}
          style={{ width: 64, padding: '5px 8px', border: '1.5px solid #E2E8F0', borderRadius: 7, fontSize: 14, fontWeight: 700, textAlign: 'center', outline: 'none' }} />
      </td>
      <td>
        <span style={{
          padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
          background: v.stock > 0 ? '#D1FAE5' : '#FEE2E2',
          color: v.stock > 0 ? '#059669' : '#DC2626',
        }}>
          {v.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </td>
      <td>
        <button className="admin-btn admin-btn-danger admin-btn-icon" style={{ width: 30, height: 30 }}
          onClick={() => onDelete(idx)}>
          <X size={12} />
        </button>
      </td>
    </tr>
  );
};

// ─── Main ProductsPage ───────────────────────────────────────────
const emptyForm = () => ({
  name: '', sku: '', price: '', discount_price: '', description: '',
  category_id: '', brand: '', status: 'DRAFT', is_featured: false,
  tax_percent: '0', weight: '', dimensions: '',
});

const ProductsPage: React.FC = () => {
  const qc = useQueryClient();
  const { toast } = useToast();

  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'variants'>('info');
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm]       = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [imageUrl, setImageUrl]   = useState('');
  const [editImages, setEditImages]   = useState<any[]>([]);
  const [editVariants, setEditVariants] = useState<any[]>([]);

  // ── category tree ──
  const { data: catsData } = useQuery({
    queryKey: ['admin-cats-all'],
    queryFn: () => categoriesApi.list({ page: 1, page_size: 200 }).then(r => r.data.data?.items || []),
  });
  const cats: any[]  = catsData || [];
  const rootCats     = cats.filter(c => !c.parent_id);
  const subCats      = cats.filter(c => !!c.parent_id);
  // Build id→name lookup from real categories (replaces MOCK_CATEGORIES)
  const catMap: Record<number, string> = Object.fromEntries(cats.map(c => [c.id, c.name]));

  // ── product list ──
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search, status, catFilter],
    queryFn: () => productsApi.list({ page, page_size: 15, search: search || undefined, status: status || undefined, category_id: catFilter || undefined }).then(r => r.data.data),
    keepPreviousData: true,
  });

  // ── mutations ──
  const createMut = useMutation({
    mutationFn: (d: any) => productsApi.create(d),
    onSuccess: async (res) => {
      const newId = res.data.data.id;
      for (const img of editImages) {
        try { await productsApi.addImage(newId, { image_url: img.image_url, alt_text: img.alt_text, is_primary: img.is_primary }); } catch {}
      }
      for (const v of editVariants) {
        try { await productsApi.createVariant(newId, v); } catch {}
      }
      qc.invalidateQueries(['admin-products']);
      setShowModal(false);
      toast('success', 'Product created');
    },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed to create product'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, d }: any) => productsApi.update(id, d),
    onSuccess: () => { qc.invalidateQueries(['admin-products']); setShowModal(false); toast('success', 'Product updated'); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed to update'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries(['admin-products']); setDeleteId(null); toast('success', 'Deleted'); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed to delete'),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, s }: any) => productsApi.updateStatus(id, s),
    onSuccess: () => { qc.invalidateQueries(['admin-products']); toast('success', 'Status updated'); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed'),
  });

  const addImageMut = useMutation({
    mutationFn: ({ pid, data }: any) => productsApi.addImage(pid, data),
    onSuccess: () => { fetchEditProduct(editing?.id); toast('success', 'Image added'); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed'),
  });

  const delImageMut = useMutation({
    mutationFn: ({ pid, iid }: any) => productsApi.deleteImage(pid, iid),
    onSuccess: () => { fetchEditProduct(editing?.id); toast('success', 'Image removed'); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed'),
  });

  const primaryImageMut = useMutation({
    mutationFn: ({ pid, iid }: any) => productsApi.setPrimaryImage(pid, iid),
    onSuccess: () => { fetchEditProduct(editing?.id); },
  });

  const createVariantMut = useMutation({
    mutationFn: ({ pid, data }: any) => productsApi.createVariant(pid, data),
    onSuccess: () => { fetchEditProduct(editing?.id); qc.invalidateQueries(['admin-products']); toast('success', 'Variant added'); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed'),
  });

  const updateVariantMut = useMutation({
    mutationFn: ({ pid, vid, data }: any) => productsApi.updateVariant(pid, vid, data),
    onSuccess: () => { fetchEditProduct(editing?.id); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed'),
  });

  const delVariantMut = useMutation({
    mutationFn: ({ pid, vid }: any) => productsApi.deleteVariant(pid, vid),
    onSuccess: () => { fetchEditProduct(editing?.id); qc.invalidateQueries(['admin-products']); toast('success', 'Variant deleted'); },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed'),
  });

  const fetchEditProduct = async (id: number) => {
    if (!id) return;
    try {
      const res = await productsApi.get(id);
      const p = res.data.data;
      setEditImages(p.images || []);
      setEditVariants(p.variants || []);
    } catch {}
  };

  const openCreate = () => {
    setEditing(null); setForm(emptyForm());
    setEditImages([]); setEditVariants([]);
    setImageUrl(''); setActiveTab('info'); setShowModal(true);
  };

  const openEdit = async (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, sku: p.sku, price: String(p.price),
      discount_price: String(p.discount_price || ''),
      description: p.description || '',
      category_id: String(p.category_id || ''),
      brand: p.brand || '', status: p.status,
      is_featured: p.is_featured,
      tax_percent: String(p.tax_percent || 0),
      weight: String(p.weight || ''),
      dimensions: p.dimensions || '',
    });
    setEditImages(p.images || []);
    setEditVariants(p.variants || []);
    setImageUrl(''); setActiveTab('info'); setShowModal(true);
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
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

  const addImageLocal = () => {
    if (!imageUrl.trim()) { toast('error', 'Enter an image URL'); return; }
    if (editing) {
      addImageMut.mutate({ pid: editing.id, data: { image_url: imageUrl.trim(), alt_text: '', is_primary: editImages.length === 0 } });
    } else {
      setEditImages(prev => [...prev, { id: Date.now(), image_url: imageUrl.trim(), alt_text: '', is_primary: prev.length === 0, sort_order: prev.length }]);
    }
    setImageUrl('');
  };

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">{data?.total || 0} products total</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div className="admin-table-filters">
            <div className="admin-search-input">
              <Search size={15} style={{ color: '#94A3B8' }} />
              <input placeholder="Search name, SKU..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="admin-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="admin-select" value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
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
          <div style={{ padding: 20 }}>{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />)}</div>
        ) : !data?.items?.length ? (
          <div className="admin-empty">
            <div className="admin-empty-icon"><Package size={28} /></div>
            <div className="admin-empty-title">No products found</div>
            <div className="admin-empty-text">Create your first product to get started</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Imgs</th><th>Variants</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {data.items.map((p: any) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {p.images?.[0] ? (
                            <img src={p.images[0].image_url} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Package size={16} color="#94A3B8" />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
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
                        {(p.variants?.length || 0) > 0 ? (
                          <span style={{ fontWeight: 700, fontSize: 13 }}>
                            {p.variants.length}
                            <span style={{ marginLeft: 4, fontSize: 11, color: p.variants.some((v: any) => v.stock > 0) ? '#059669' : '#DC2626' }}>
                              {p.variants.some((v: any) => v.stock > 0) ? '●' : '○'}
                            </span>
                          </span>
                        ) : <span style={{ color: '#94A3B8', fontSize: 12 }}>—</span>}
                      </td>
                      <td>
                        <select className="admin-select" style={{ padding: '3px 8px', fontSize: 11 }}
                          value={p.status} onChange={e => statusMut.mutate({ id: p.id, s: e.target.value })}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => openEdit(p)}><Edit2 size={14} /></button>
                          <button className="admin-btn admin-btn-danger admin-btn-icon" onClick={() => setDeleteId(p.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-pagination">
              {Array.from({ length: data.total_pages || 1 }, (_, i) => i + 1).map(p => (
                <button key={p} className={`admin-page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Create/Edit Modal ── */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="admin-modal" style={{ maxWidth: 660, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="admin-modal-header">
              <div className="admin-modal-title">{editing ? `Edit: ${editing.name}` : 'Add Product'}</div>
              <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9', padding: '0 24px', flexShrink: 0 }}>
              {(['info', 'images', 'variants'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  color: activeTab === tab ? '#FF7A00' : '#64748B',
                  borderBottom: activeTab === tab ? '2px solid #FF7A00' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  {tab === 'info'     && <><Package size={13} />Info</>}
                  {tab === 'images'   && <><Image size={13} />Images ({editImages.length})</>}
                  {tab === 'variants' && <><Layers size={13} />Variants ({editVariants.length})</>}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>

              {/* INFO TAB */}
              {activeTab === 'info' && (
                <form id="product-info-form" onSubmit={handleInfoSubmit}>
                  <div className="admin-modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="admin-form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="admin-form-label">Product Name *</label>
                      <input className="admin-form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">SKU * (auto UPPERCASE)</label>
                      <input className="admin-form-input" value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value.toUpperCase() }))} required placeholder="e.g. PROD-001" />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Brand</label>
                      <input className="admin-form-input" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} />
                    </div>
                    <div className="admin-form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="admin-form-label">Category</label>
                      <select className="admin-form-select" value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}>
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
                    <div className="admin-form-group">
                      <label className="admin-form-label">Selling Price (₹) *</label>
                      <input className="admin-form-input" type="number" step="0.01" min="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Discount / MRP Price (₹)</label>
                      <input className="admin-form-input" type="number" step="0.01" min="0" value={form.discount_price} onChange={e => setForm(p => ({ ...p, discount_price: e.target.value }))} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Tax %</label>
                      <input className="admin-form-input" type="number" step="0.01" min="0" value={form.tax_percent} onChange={e => setForm(p => ({ ...p, tax_percent: e.target.value }))} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Status</label>
                      <select className="admin-form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Weight (kg)</label>
                      <input className="admin-form-input" type="number" step="0.001" min="0" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} placeholder="e.g. 0.5" />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Dimensions (L×W×H cm)</label>
                      <input className="admin-form-input" value={form.dimensions} onChange={e => setForm(p => ({ ...p, dimensions: e.target.value }))} placeholder="e.g. 30x20x10cm" />
                    </div>
                    <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 22 }}>
                      <input type="checkbox" id="is-featured" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} style={{ width: 16, height: 16 }} />
                      <label htmlFor="is-featured" className="admin-form-label" style={{ margin: 0 }}>Featured product</label>
                    </div>
                    <div className="admin-form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="admin-form-label">Description</label>
                      <textarea className="admin-form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Product description..." />
                    </div>
                  </div>
                </form>
              )}

              {/* IMAGES TAB */}
              {activeTab === 'images' && (
                <div className="admin-modal-body">
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <input className="admin-form-input" style={{ flex: 1 }} placeholder="Paste image URL here..."
                      value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageLocal(); } }} />
                    <button className="admin-btn admin-btn-primary" onClick={addImageLocal} disabled={addImageMut.isLoading}>
                      <Plus size={15} /> Add
                    </button>
                  </div>
                  {editImages.length === 0 ? (
                    <div className="admin-empty" style={{ padding: '32px 20px' }}>
                      <div className="admin-empty-icon"><Image size={24} /></div>
                      <div className="admin-empty-title">No images yet</div>
                      <div className="admin-empty-text">Paste an image URL above and click Add</div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 12 }}>
                      {editImages.map((img: any, idx: number) => (
                        <div key={img.id || idx} style={{ borderRadius: 10, overflow: 'hidden', border: img.is_primary ? '2px solid #FF7A00' : '1px solid #E2E8F0' }}>
                          <img src={img.image_url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
                            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/130x120/F1F5F9/94A3B8?text=Error'; }} />
                          {img.is_primary && (
                            <div style={{ position: 'absolute', marginTop: -20, marginLeft: 4, background: '#FF7A00', color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>PRIMARY</div>
                          )}
                          <div style={{ display: 'flex', gap: 4, padding: 5, background: '#F8FAFC' }}>
                            {!img.is_primary && (
                              <button className="admin-btn admin-btn-secondary" style={{ flex: 1, padding: '3px 5px', fontSize: 10 }}
                                onClick={() => editing ? primaryImageMut.mutate({ pid: editing.id, iid: img.id }) : setEditImages(prev => prev.map((x, i) => ({ ...x, is_primary: i === idx })))}>
                                Primary
                              </button>
                            )}
                            <button className="admin-btn admin-btn-danger admin-btn-icon" style={{ width: 26, height: 26 }}
                              onClick={() => editing ? delImageMut.mutate({ pid: editing.id, iid: img.id }) : setEditImages(prev => prev.filter((_, i) => i !== idx))}>
                              <X size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 12 }}>Minimum 1 image required. No maximum limit.</p>
                </div>
              )}

              {/* VARIANTS TAB */}
              {activeTab === 'variants' && (
                <div className="admin-modal-body">
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
                    toast={toast}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              {activeTab === 'info' && (
                <button className="admin-btn admin-btn-primary" form="product-info-form" type="submit"
                  disabled={createMut.isLoading || updateMut.isLoading}>
                  {(createMut.isLoading || updateMut.isLoading) ? 'Saving...' : editing ? 'Update Info' : 'Create Product'}
                </button>
              )}
              {activeTab !== 'info' && (
                <button className="admin-btn admin-btn-secondary" onClick={() => setActiveTab('info')}>← Back to Info</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 380 }}>
            <div className="admin-modal-header"><div className="admin-modal-title">Delete Product</div></div>
            <div className="admin-modal-body"><p style={{ color: '#334155', margin: 0 }}>This cannot be undone. All images and variants will also be deleted.</p></div>
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

export default ProductsPage;
