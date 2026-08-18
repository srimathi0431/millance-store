import React from 'react';
import { useNavigate } from 'react-router-dom';

const PortalSelect: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1040 50%, #0F172A 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          width: 68, height: 68,
          background: 'linear-gradient(135deg, #FF7A00, #FF3D8D, #7B2FF7)',
          borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 900, color: 'white',
          margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(123,47,247,0.4)',
        }}>M</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: '0 0 6px' }}>
          Millance Store
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0, letterSpacing: 1, textTransform: 'uppercase' }}>
          Select Your Portal
        </p>
      </div>

      {/* Portal Cards */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 600, width: '100%' }}>

        {/* Admin Card */}
        <div
          onClick={() => navigate('/admin/login')}
          style={{
            flex: 1, minWidth: 220, maxWidth: 260,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,122,0,0.3)',
            borderRadius: 20, padding: '32px 28px',
            cursor: 'pointer', textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,122,0,0.12)';
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,122,0,0.7)';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(255,122,0,0.2)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,122,0,0.3)';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          }}
        >
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: 'linear-gradient(135deg, #FF7A00, #FF3D8D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(255,122,0,0.35)',
          }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'white', margin: '0 0 8px' }}>Admin Panel</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 20px', lineHeight: 1.5 }}>
            Manage products, orders, customers, inventory and reports
          </p>
          <div style={{
            padding: '10px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #FF7A00, #FF3D8D)',
            color: 'white', fontWeight: 700, fontSize: 13,
            boxShadow: '0 4px 14px rgba(255,122,0,0.4)',
          }}>
            Enter Admin Portal →
          </div>
        </div>

        {/* Vendor Card */}
        <div
          onClick={() => navigate('/vendor/login')}
          style={{
            flex: 1, minWidth: 220, maxWidth: 260,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(123,47,247,0.3)',
            borderRadius: 20, padding: '32px 28px',
            cursor: 'pointer', textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(123,47,247,0.12)';
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(123,47,247,0.7)';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(123,47,247,0.2)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(123,47,247,0.3)';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          }}
        >
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: 'linear-gradient(135deg, #7B2FF7, #FF3D8D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(123,47,247,0.35)',
          }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'white', margin: '0 0 8px' }}>Vendor Panel</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 20px', lineHeight: 1.5 }}>
            Manage your store products, track orders and view performance
          </p>
          <div style={{
            padding: '10px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #7B2FF7, #FF3D8D)',
            color: 'white', fontWeight: 700, fontSize: 13,
            boxShadow: '0 4px 14px rgba(123,47,247,0.4)',
          }}>
            Enter Vendor Portal →
          </div>
        </div>
      </div>

      {/* Back to store */}
      <div style={{ marginTop: 36, textAlign: 'center' }}>
        <button onClick={() => navigate('/')}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
        >
          ← Back to Millance Store
        </button>
      </div>
    </div>
  );
};

export default PortalSelect;
