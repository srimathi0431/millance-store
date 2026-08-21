import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
 LayoutDashboard, Package, Tag, Warehouse, ShoppingCart,
 Users, CreditCard, Ticket, Star, BarChart2, LogOut,
 Menu, X, ChevronLeft, ChevronRight, Settings, Bell
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import '../styles/admin.css';

const NAV = [
 { section: 'Main', items: [
 { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
 ]},
 { section: 'Catalogue', items: [
 { to: '/admin/products', icon: Package, label: 'Products' },
 { to: '/admin/categories', icon: Tag, label: 'Categories' },
 { to: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
 ]},
 { section: 'Sales', items: [
 { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
 { to: '/admin/customers', icon: Users, label: 'Customers' },
 { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
 ]},
 { section: 'Marketing', items: [
 { to: '/admin/coupons', icon: Ticket, label: 'Coupons' },
 { to: '/admin/reviews', icon: Star, label: 'Reviews' },
 ]},
 { section: 'Analytics', items: [
 { to: '/admin/reports', icon: BarChart2, label: 'Reports' },
 ]},
];

const AdminLayout= () => {
 const { admin, logout } = useAdminAuth();
 const navigate = useNavigate();
 const [collapsed, setCollapsed] = useState(false);
 const [mobileOpen, setMobileOpen] = useState(false);
 const [profileOpen, setProfileOpen] = useState(false);

 const handleLogout = async () => {
 await logout();
 navigate('/admin/login');
 };

 const initials = admin?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || 'A';

 return (
 <div className="admin-shell">
 {/* Mobile overlay */}
 <div
 className={`admin-sidebar-overlay ${mobileOpen ? 'show' : ''}`}
 onClick={() => setMobileOpen(false)}
 />

 {/* Sidebar */}
 <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
 {/* Logo */}
 <div className="admin-sidebar-logo">
 <div className="admin-sidebar-logo-icon">M</div>
 <div className="admin-sidebar-logo-text">
 <h2>Millance</h2>
 <span>Admin Panel</span>
 </div>
 </div>

 {/* Nav */}
 <nav className="admin-nav">
 {NAV.map(section => (
 <div key={section.section} className="admin-nav-section">
 <div className="admin-nav-label">{section.section}</div>
 {section.items.map(item => (
 <NavLink
 key={item.to}
 to={item.to}
 className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
 onClick={() => setMobileOpen(false)}
 >
 <item.icon className="nav-icon" />
 <span className="nav-text">{item.label}</span>
 </NavLink>
 ))}
 </div>
 ))}
 </nav>

 {/* Bottom */}
 <div className="admin-nav-bottom">
 <button className="admin-nav-item" onClick={handleLogout}>
 <LogOut className="nav-icon" style={{ color: '#EF4444' }} />
 <span className="nav-text" style={{ color: '#EF4444' }}>Logout</span>
 </button>
 </div>

 </aside>

 {/* Main */}
 <main className={`admin-main ${collapsed ? 'collapsed' : ''}`}>
 {/* Header */}
 <header className="admin-header">
 <div className="admin-header-left">
 <button
 className="admin-header-btn admin-menu-btn"
 onClick={() => setMobileOpen(p => !p)}
 >
 {mobileOpen ? <X size={18} /> : <Menu size={18} />}
 </button>
 </div>
 <div className="admin-header-right">
 <button className="admin-header-btn">
 <Bell size={18} />
 </button>
 <div style={{ position: 'relative' }}>
 <div className="admin-profile-chip" onClick={() => setProfileOpen(p => !p)}>
 <div className="admin-profile-avatar">{initials}</div>
 <span className="admin-profile-name">{admin?.name || 'Admin'}</span>
 </div>
 {profileOpen && (
 <div className="admin-profile-dropdown">
 <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9' }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{admin?.name}</div>
 <div style={{ fontSize: 11, color: '#64748B' }}>{admin?.email}</div>
 <span className="badge badge-orange" style={{ marginTop: 4 }}>{admin?.role}</span>
 </div>
 <button className="admin-profile-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/admin/settings'); }}>
 <Settings size={15} /> Settings
 </button>
 <button className="admin-profile-dropdown-item danger" onClick={handleLogout}>
 <LogOut size={15} /> Logout
 </button>
 </div>
 )}
 </div>
 </div>
 </header>

 {/* Page content */}
 <div className="admin-content">
 <Outlet />
 </div>
 </main>
 </div>
 );
};

export default AdminLayout;
