import React from 'react';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

export default function Settings() {
  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ color: '#fff', marginBottom: '30px' }}>إعدادات الحساب</h2>
      
      <div style={{ background: '#0f172a', padding: '25px', borderRadius: '12px', border: '1px solid rgba(241, 201, 145, 0.1)' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiUser color="#f1c991" />
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '5px' }}>الاسم الكامل</label>
            <input type="text" defaultValue="jjilamin882" style={{ ...inputStyle }} />
          </div>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiMail color="#f1c991" />
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '5px' }}>البريد الإلكتروني</label>
            <input type="email" defaultValue="test@example.com" style={{ ...inputStyle }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiPhone color="#f1c991" />
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '5px' }}>رقم الهاتف</label>
            <input type="tel" placeholder="0555 123 456" style={{ ...inputStyle }} />
          </div>
        </div>

        <button style={{ 
          marginTop: '25px', width: '100%', padding: '12px', background: '#f1c991', 
          color: '#0a0f18', border: 'none', borderRadius: '8px', fontWeight: 'bold', 
          fontSize: '16px', cursor: 'pointer' 
        }}>
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155',
  borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none'
};