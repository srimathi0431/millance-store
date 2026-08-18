import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Warehouse, AlertTriangle, XCircle, History, X } from 'lucide-react';
import { inventoryApi } from '../services/api';
import { useToast } from '../components/Toast';

type Tab = 'all' | 'low' | 'out';
const TX_TYPES = [
  { value: 'STOCK_IN',  label: 'STOCK_IN — Add stock' },
  { value: 'STOCK_OUT', label: 'STOCK_OUT — Remove stock' },
  { value: 'ADJUSTMENT',label: 'ADJUSTMENT — Set absolute value' },
];

const InventoryPage: React.FC = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('all');
  const [page, setPage] = useState(1);
  const [adjustProduct, setAdjustProduct] = useState<any>(null);
  const [historyProduct, setHistoryProduct] = useState<any>(null);
  const [thresholdProduct, setThresholdProduct] = useState<any>(null);
  const [adjustForm, setAdjustForm] = useState({ transaction_type: 'STOCK_IN', quantity: '', notes: '' });
  const [thresholdVal, setThresholdVal] = useState('');

  const fetcher = tab === 'low' ? inventoryApi.lowStock : tab === 'out' ? inventoryApi.outOfStock : inventoryApi.list;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory', tab, page],
    queryFn: () => fetcher({ page, page_size: 15 }).then(r => r.data.data),
    keepPreviousData: true,
  });

  const { data: histData } = useQuery({
    queryKey: ['admin-inv-history', historyProduct?.product_id],
    queryFn: () => historyProduct ? inventoryApi.history(historyProduct.product_id, { page: 1, page_size: 20 }).then(r => r.data.data) : null,
    enabled: !!historyProduct,
  });

  const adjustMut = useMutation({
    mutationFn: ({ id, d }: any) => inventoryApi.adjust(id, d),
    onSuccess: () => {
      qc.invalidateQueries(['admin-inventory']);
      setAdjustProduct(null);
      setAdjustForm({ transaction_type: 'STOCK_IN', quantity: '', notes: '' });
      toast('success', 'Stock adjusted');
    },
    onError: (e: any) => toast('error', e?.response?.data?.message || 'Failed to adjust stock'),
  });

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(adjustForm.quantity);
    if (!qty || qty <= 0) { toast('error', 'Quantity must be > 0'); return; }
    adjustMut.mutate({ id: adjustProduct.product_id, d: { transaction_type: adjustForm.transaction_type, quantity: qty, notes: adjustForm.notes || null } });
  };

  const TABS = [
    { key: 'all', label: 'All Inventory', icon: Warehouse },
    { key: 'low', label: 'Low Stock',     icon: AlertTriangle },
    { key: 'out', label: 'Out of Stock',  icon: XCircle },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Inventory</h1><p className="admin-page-subtitle">Monitor and adjust stock levels</p></div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key as Tab); setPage(1); }}
            className={`admin-btn ${tab === t.key ? 'admin-btn-primary' : 'admin-btn-secondary'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="admin-table-card">
        {isLoading
          ? <div style={{ padding: 20 }}>{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />)}</div>
          : !data?.items?.length
            ? <div className="admin-empty"><div className="admin-empty-icon"><Warehouse size={28} /></div><div className="admin-empty-title">No inventory records</div></div>
            : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th><th>SKU</th><th>Total</th>
                        <th>Reserved</th><th>Available</th><th>Threshold</th>
                        <th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((inv: any) => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inv.product_name || `Product #${inv.product_id}`}
                          </td>
                          <td>
                            <code style={{ fontSize: 11, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>
                              {inv.product_sku || `#${inv.product_id}`}
                            </code>
                          </td>
                          <td style={{ fontWeight: 700 }}>{inv.total_stock}</td>
                          <td style={{ color: '#F59E0B' }}>{inv.reserved_stock}</td>
                          <td style={{ fontWeight: 700, color: inv.is_out_of_stock ? '#DC2626' : inv.is_low_stock ? '#D97706' : '#059669' }}>
                            {inv.available_stock}
                          </td>
                          <td style={{ color: '#94A3B8' }}>{inv.low_stock_threshold}</td>
                          <td>
                            {inv.is_out_of_stock
                              ? <span className="badge badge-danger">Out of Stock</span>
                              : inv.is_low_stock
                                ? <span className="badge badge-warning">Low Stock</span>
                                : <span className="badge badge-success">In Stock</span>}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 5 }}>
                              <button className="admin-btn admin-btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}
                                onClick={() => { setAdjustProduct(inv); setAdjustForm({ transaction_type: 'STOCK_IN', quantity: '', notes: '' }); }}>
                                Adjust
                              </button>
                              <button className="admin-btn admin-btn-secondary admin-btn-icon" title="History"
                                onClick={() => setHistoryProduct(inv)}>
                                <History size={14} />
                              </button>
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

      {/* Adjust Modal */}
      {adjustProduct && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setAdjustProduct(null)}>
          <div className="admin-modal" style={{ maxWidth: 440 }}>
            <div className="admin-modal-header">
              <div>
                <div className="admin-modal-title">Adjust Stock</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  {adjustProduct.product_name || `Product #${adjustProduct.product_id}`}
                  {adjustProduct.product_sku && <> · <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: 3 }}>{adjustProduct.product_sku}</code></>}
                </div>
              </div>
              <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => setAdjustProduct(null)}><X size={15} /></button>
            </div>
            <form onSubmit={handleAdjust}>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14, padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>TOTAL</div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{adjustProduct.total_stock}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>RESERVED</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: '#F59E0B' }}>{adjustProduct.reserved_stock}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>AVAILABLE</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: adjustProduct.is_out_of_stock ? '#DC2626' : '#059669' }}>{adjustProduct.available_stock}</div>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Transaction Type</label>
                  <select className="admin-form-select" value={adjustForm.transaction_type}
                    onChange={e => setAdjustForm(p => ({ ...p, transaction_type: e.target.value }))}>
                    {TX_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Quantity *
                    {adjustForm.transaction_type === 'ADJUSTMENT' && <span style={{ color: '#64748B', fontWeight: 400 }}> (sets absolute stock value)</span>}
                  </label>
                  <input className="admin-form-input" type="number" min="1" value={adjustForm.quantity}
                    onChange={e => setAdjustForm(p => ({ ...p, quantity: e.target.value }))} required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Notes (optional)</label>
                  <input className="admin-form-input" value={adjustForm.notes}
                    onChange={e => setAdjustForm(p => ({ ...p, notes: e.target.value }))} placeholder="Reason for adjustment..." />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setAdjustProduct(null)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={adjustMut.isLoading}>
                  {adjustMut.isLoading ? 'Adjusting...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyProduct && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setHistoryProduct(null)}>
          <div className="admin-modal" style={{ maxWidth: 600, display: 'flex', flexDirection: 'column' }}>
            <div className="admin-modal-header">
              <div>
                <div className="admin-modal-title">Stock History</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  {historyProduct.product_name || `Product #${historyProduct.product_id}`}
                </div>
              </div>
              <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => setHistoryProduct(null)}><X size={15} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {!histData?.items?.length
                ? <div className="admin-empty"><div className="admin-empty-title">No transactions yet</div></div>
                : (
                  <table className="admin-table">
                    <thead>
                      <tr><th>Type</th><th>Qty</th><th>Before</th><th>After</th><th>Notes</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {histData.items.map((t: any) => (
                        <tr key={t.id}>
                          <td>
                            <span className={`badge badge-${t.transaction_type.includes('IN') || t.transaction_type.includes('RESTORED') ? 'success' : t.transaction_type.includes('OUT') || t.transaction_type.includes('DEDUCTED') ? 'danger' : 'info'}`}>
                              {t.transaction_type}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700 }}>{t.quantity}</td>
                          <td>{t.previous_stock}</td>
                          <td style={{ fontWeight: 700 }}>{t.new_stock}</td>
                          <td style={{ fontSize: 12, color: '#94A3B8', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.notes || '—'}</td>
                          <td style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
