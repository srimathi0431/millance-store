import React from 'react';
import { useVendorAuth } from '../contexts/VendorAuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const VendorProfile: React.FC = () => {
  const { vendor, logout } = useVendorAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/vendor/login'); };

  return (
    <div>
      <div className="vendor-page-header">
        <div><h1 className="vendor-page-title">Profile</h1><p className="vendor-page-subtitle">Your vendor account details</p></div>
      </div>

      <div style={{ maxWidth:480 }}>
        <div style={{ background:'white', borderRadius:16, border:'1px solid #E2E8F0', overflow:'hidden' }}>
          {/* Avatar banner */}
          <div style={{ height:80, background:'linear-gradient(135deg,#7B2FF7,#FF3D8D)', position:'relative' }}>
            <div style={{ position:'absolute', bottom:-28, left:24, width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#7B2FF7,#FF3D8D)', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color:'white' }}>
              {vendor?.email?.slice(0,2).toUpperCase() || 'V'}
            </div>
          </div>

          <div style={{ padding:'36px 24px 24px' }}>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:18, fontWeight:700, color:'#0F172A' }}>
                {vendor?.email?.split('@')[0] || 'Vendor'}
              </div>
              <div style={{ fontSize:13, color:'#64748B', marginTop:2 }}>{vendor?.email}</div>
              <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:'#EDE9FE', color:'#7C3AED', marginTop:6 }}>
                {vendor?.role?.toUpperCase() || 'VENDOR'}
              </span>
            </div>

            <div style={{ display:'grid', gap:12, marginBottom:24 }}>
              {[
                ['Email', vendor?.email || '—'],
                ['Role', vendor?.role || 'vendor'],
                ['Status', 'Active'],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 14px', background:'#F8FAFC', borderRadius:8 }}>
                  <span style={{ fontSize:13, color:'#64748B' }}>{k}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{v}</span>
                </div>
              ))}
            </div>

            <button className="vendor-btn vendor-btn-primary" style={{ width:'100%', justifyContent:'center', background:'linear-gradient(135deg,#EF4444,#DC2626)', boxShadow:'0 4px 12px rgba(239,68,68,0.3)' }} onClick={handleLogout}>
              <LogOut size={16}/> Sign Out
            </button>
          </div>
        </div>

        <div style={{ marginTop:16, padding:'12px 16px', background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:10, fontSize:13, color:'#92400E' }}>
          For account changes, contact your Millance Store administrator.
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
