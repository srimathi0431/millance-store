import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, User, LogOut, Menu, X, Bell } from 'lucide-react';
import { useVendorAuth } from '../contexts/VendorAuthContext';
import '../styles/vendor.css';

const NAV = [
 { section: 'Main', items: [
 { to: '/vendor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
 ]},
 { section: 'Store', items: [
 { to: '/vendor/products', icon: Package, label: 'My Products' },
 { to: '/vendor/orders', icon: ShoppingCart, label: 'Orders' },
 ]},
 { section: 'Account', items: [
 { to: '/vendor/profile', icon: User, label: 'Profile' },
 ]},
];

const VendorLayout= () => {
 const { vendor, logout } = useVendorAuth();
 const navigate = useNavigate();
 const [mobileOpen, setMobileOpen] = useState(false);
 const [profileOpen, setProfileOpen] = useState(false);

 const handleLogout = () => { logout(); navigate('/vendor/login'); };
 const initials = vendor?.email?.slice(0, 2).toUpperCase() || 'V';

 return (
 <div className="vendor-shell">
 {/* Mobile overlay */}
 {mobileOpen && (
 <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:99 }}
 onClick={() => setMobileOpen(false)} />
 )}

 {/* Sidebar */}
 <aside className={`vendor-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
 <div className="vendor-sidebar-logo">
 <div className="vendor-sidebar-logo-icon">M</div>
 <div>
 <h2>Millance</h2>
 <span>Vendor Panel</span>
 </div>
 </div>
 <nav className="vendor-nav">
 {NAV.map(section => (
 <div key={section.section}>
 <div className="vendor-nav-label">{section.section}</div>
 {section.items.map(item => (
 <NavLink
 key={item.to}
 to={item.to}
 className={({ isActive }) => `vendor-nav-item${isActive ? ' active' : ''}`}
 onClick={() => setMobileOpen(false)}
 >
 <item.icon size={17} />
 {item.label}
 </NavLink>
 ))}
 </div>
 ))}
 </nav>
 <div className="vendor-nav-bottom">
 <button className="vendor-nav-item" onClick={handleLogout}>
 <LogOut size={17} style={{ color:'#EF4444' }} />
 <span style={{ color:'#EF4444' }}>Logout</span>
 </button>
 </div>
 </aside>

 {/* Main */}
 <main className="vendor-main">
 {/* Header */}
 <header className="vendor-header">
 <div style={{ display:'flex', alignItems:'center', gap:12 }}>
 <button
 onClick={() => setMobileOpen(p => !p)}
 style={{ background:'none', border:'none', cursor:'pointer', color:'#64748B', display:'flex', padding:4 }}
 >
 {mobileOpen ? <X size={20} /> : <Menu size={20} />}
 </button>
 <span style={{ fontSize:15, fontWeight:700, color:'#0F172A' }}>Vendor Portal</span>
 </div>
 <div className="vendor-header-right">
 <button style={{ width:36,height:36,borderRadius:'50%',border:'none',background:'#F1F5F9',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748B' }}>
 <Bell size={17} />
 </button>
 <div style={{ position:'relative' }}>
 <div className="vendor-profile-chip" onClick={() => setProfileOpen(p => !p)}>
 <div className="vendor-profile-avatar">{initials}</div>
 <span style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>
 {vendor?.email?.split('@')[0] || 'Vendor'}
 </span>
 </div>
 {profileOpen && (
 <div style={{ position:'absolute',top:48,right:0,background:'white',border:'1px solid #E2E8F0',borderRadius:12,boxShadow:'0 8px 24px rgba(15,23,42,0.12)',minWidth:180,zIndex:200,overflow:'hidden' }}>
 <div style={{ padding:'12px 16px',borderBottom:'1px solid #F1F5F9' }}>
 <div style={{ fontSize:12,color:'#64748B' }}>{vendor?.email}</div>
 <span className="vendor-badge vendor-badge-purple" style={{ marginTop:4 }}>VENDOR</span>
 </div>
 <button onClick={() => { setProfileOpen(false); navigate('/vendor/profile'); }}
 style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 16px',width:'100%',border:'none',background:'transparent',cursor:'pointer',fontSize:13,color:'#334155' }}>
 <User size={14}/> Profile
 </button>
 <button onClick={handleLogout}
 style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 16px',width:'100%',border:'none',background:'transparent',cursor:'pointer',fontSize:13,color:'#EF4444' }}>
 <LogOut size={14}/> Logout
 </button>
 </div>
 )}
 </div>
 </div>
 </header>

 {/* Page content */}
 <div className="vendor-content">
 <Outlet />
 </div>
 </main>
 </div>
 );
};

export default VendorLayout;
