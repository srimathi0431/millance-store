import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart2 } from 'lucide-react';
import { reportsApi } from '../services/api';

const fmt = (n) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);

const ReportsPage= () => {
 const [tab, setTab] = useState('sales');
 const [period, setPeriod] = useState('daily');
 const [dateFrom, setDateFrom] = useState('');
 const [dateTo, setDateTo] = useState('');

 const params = { period, date_from:dateFrom||undefined, date_to:dateTo||undefined };

 const { data: salesData, isLoading: sLoading } = useQuery({ queryKey:['report-sales',params], queryFn:()=>reportsApi.sales(params).then(r=>r.data.data), enabled:tab==='sales' });
 const { data: ordersData, isLoading: oLoading } = useQuery({ queryKey:['report-orders',params], queryFn:()=>reportsApi.orders(params).then(r=>r.data.data), enabled:tab==='orders' });
 const { data: productsData, isLoading: pLoading } = useQuery({ queryKey:['report-products',params], queryFn:()=>reportsApi.products(params).then(r=>r.data.data), enabled:tab==='products' });
 const { data: customersData, isLoading: cLoading } = useQuery({ queryKey:['report-customers',params], queryFn:()=>reportsApi.customers(params).then(r=>r.data.data), enabled:tab==='customers' });

 const isLoading = sLoading||oLoading||pLoading||cLoading;
 const TABS = ['sales','orders','products','customers'];

 return (
 <div>
 <div className="admin-page-header">
 <div><h1 className="admin-page-title">Reports</h1><p className="admin-page-subtitle">Analytics and insights</p></div>
 </div>

 {/* Filters */}
 <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
 {TABS.map(t=>(
 <button key={t} onClick={()=>setTab(t)} className={`admin-btn ${tab===t?'admin-btn-primary':'admin-btn-secondary'}`}>
 {t.charAt(0).toUpperCase()+t.slice(1)}
 </button>
 ))}
 <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
 {tab==='sales' && (
 <select className="admin-select" value={period} onChange={e=>setPeriod(e.target.value)}>
 {['daily','weekly','monthly','yearly'].map(p=><option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
 </select>
 )}
 <input className="admin-select" type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{cursor:'pointer'}}/>
 <span style={{color:'#94A3B8',fontSize:13}}>to</span>
 <input className="admin-select" type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{cursor:'pointer'}}/>
 </div>
 </div>

 <div className="admin-table-card">
 {isLoading ? <div style={{padding:20}}>{Array(5).fill(0).map((_,i)=><div key={i} className="skeleton" style={{height:48,marginBottom:8}}/>)}</div>
 : (
 <>
 {/* Sales Report */}
 {tab==='sales' && (!salesData||!salesData.length ? (
 <div className="admin-empty"><div className="admin-empty-icon"><BarChart2 size={28}/></div><div className="admin-empty-title">No sales data</div></div>
 ) : (
 <table className="admin-table">
 <thead><tr><th>Period</th><th>Transactions</th><th>Revenue</th></tr></thead>
 <tbody>{salesData.map((r,i)=><tr key={i}><td style={{color:'#64748B'}}>{String(r.period).substring(0,16)}</td><td style={{fontWeight:600}}>{r.transactions}</td><td style={{fontWeight:700,color:'#FF7A00'}}>{fmt(r.revenue)}</td></tr>)}</tbody>
 </table>
 ))}

 {/* Orders Report */}
 {tab==='orders' && (
 <div style={{padding:20}}>
 {!ordersData||!Object.keys(ordersData).length ? <div className="admin-empty"><div className="admin-empty-title">No order data</div></div>
 : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14}}>
 {Object.entries(ordersData).map(([status,count])=>(
 <div key={status} style={{padding:'14px 16px',background:'#F8FAFC',borderRadius:10,border:'1px solid #F1F5F9'}}>
 <div style={{fontSize:24,fontWeight:800,color:'#0F172A'}}>{count}</div>
 <div style={{fontSize:12,color:'#64748B',marginTop:2}}>{status}</div>
 </div>
 ))}
 </div>}
 </div>
 )}

 {/* Products Report */}
 {tab==='products' && (!productsData||!productsData.length ? (
 <div className="admin-empty"><div className="admin-empty-title">No product data</div></div>
 ) : (
 <table className="admin-table">
 <thead><tr><th>#</th><th>Product</th><th>Units Sold</th><th>Revenue</th></tr></thead>
 <tbody>{productsData.map((p,i)=><tr key={i}><td style={{color:'#94A3B8',fontWeight:700}}>{i+1}</td><td style={{fontWeight:600,maxWidth:240,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.product_name}</td><td>{p.total_sold}</td><td style={{fontWeight:700,color:'#FF7A00'}}>{fmt(p.total_revenue)}</td></tr>)}</tbody>
 </table>
 ))}

 {/* Customers Report */}
 {tab==='customers' && (
 <div style={{padding:20}}>
 {!customersData ? <div className="admin-empty"><div className="admin-empty-title">No data</div></div>
 : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14}}>
 {[['Total Customers',customersData.total_customers],['Active',customersData.active_customers],['Blocked',customersData.blocked_customers],['New in Range',customersData.new_in_range]].map(([k,v])=>(
 <div key={k} style={{padding:'14px 16px',background:'#F8FAFC',borderRadius:10,border:'1px solid #F1F5F9'}}>
 <div style={{fontSize:24,fontWeight:800,color:'#0F172A'}}>{v}</div>
 <div style={{fontSize:12,color:'#64748B',marginTop:2}}>{k}</div>
 </div>
 ))}
 </div>}
 </div>
 )}
 </>
 )}
 </div>
 </div>
 );
};

export default ReportsPage;
