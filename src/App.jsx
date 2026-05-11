import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Shield, Server, ArrowRight, UserPlus, Trash2, Lock, LogOut, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import './index.css';

// ============================================================
// ADMIN ŞİFRESİ - Buradan değiştirabilirsiniz
const ADMIN_PASSWORD = 'Restopos2026!';
// ============================================================

// LocalStorage key for licenses (Vercel'de kalıcı olmaz, ama bu örnek için)
// Gerçek üretimde Supabase veya başka bir DB kullanılmalı
const LS_KEY = 'restopos_licenses';

function loadLicenses() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [{ id: 1, email: 'demo@restoran.com', expireDate: '2026-12-31', active: true }];
}

function saveLicenses(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

// ── Ana Sayfa ──────────────────────────────────────────────
function Home() {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">RestoPOS<span>Pro</span></div>
        <nav>
          <a href="#features">Özellikler</a>
          <a href="#download">İndir</a>
          <Link to="/admin" className="btn-admin">Yönetici Paneli</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-badge">🚀 v1.0 Yayında</div>
          <h1>Restoranınızı Profesyonel Yazarkasa ile Yönetin</h1>
          <p>Windows Ana Kasa ve Android Tabletler internete ihtiyaç duymadan yerel ağınızda senkronize çalışır. Lisans ile güvende.</p>
          <div className="hero-buttons">
            <a href="#download" className="btn-primary">Hemen İndir <ArrowRight size={18}/></a>
          </div>
        </section>

        <section id="features" className="features">
          <div className="feature-card">
            <Server size={32} color="#6366f1"/>
            <h3>Yerel Sunucu Mimarisi</h3>
            <p>Verileriniz kendi bilgisayarınızda güvende kalır. İnternet kesilse bile çalışmaya devam eder.</p>
          </div>
          <div className="feature-card">
            <Smartphone size={32} color="#10b981"/>
            <h3>Tablet Senkronizasyonu</h3>
            <p>Garson tabletleri, restoranın kendi ağı üzerinden Ana Kasa'ya milisaniyeler içinde bağlanır.</p>
          </div>
          <div className="feature-card">
            <Shield size={32} color="#f59e0b"/>
            <h3>Gmail Lisans Koruması</h3>
            <p>Sadece sizin yetkilendirdiğiniz Gmail hesapları uygulamayı açabilir. Korsan kullanım önlenir.</p>
          </div>
        </section>

        <section id="download" className="download-section">
          <h2>Uygulamaları İndir</h2>
          <div className="download-grid">
            <div className="download-card">
              <Monitor size={48} color="#0078D4"/>
              <h3>Windows Ana Kasa</h3>
              <p>Restoranın ana bilgisayarına kurulacak sunucu ve kasiyer uygulaması. ZIP dosyasını indirin, açın ve RestoPOS.exe'yi çalıştırın.</p>
              <a
                href="https://drive.google.com/file/d/1eRQ0IMYKf_D-LhMbGVCIpjWNAOWf3NZj/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
              >
                ⬇️ Windows İndir (.zip)
              </a>
              <p className="download-note">ZIP açın → RestoPOS.exe çalıştırın</p>
            </div>
            <div className="download-card">
              <Smartphone size={48} color="#3DDC84"/>
              <h3>Android Tablet</h3>
              <p>Garsonların sipariş almak için kullanacağı Android tabletlere kurulacak mobil uygulama.</p>
              <a
                href="/RestoPOS_Tablet.apk"
                download
                className="btn-download"
              >
                ⬇️ Android İndir (.apk)
              </a>
              <p className="download-note">APK indirin → "Bilinmeyen kaynak" onaylayın → Kurun</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 RestoPOS Pro. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

// ── Admin Giriş Ekranı ─────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Şifre yanlış!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="license-screen">
      <div className={`login-card ${shake ? 'shake' : ''}`}>
        <div className="login-icon">
          <Lock size={36} color="#6366f1" />
        </div>
        <h2>Yönetici Girişi</h2>
        <p>Bu alan sadece sistem yöneticileri içindir.</p>

        <div className="form-group-login">
          <input
            type="password"
            className="login-input"
            placeholder="Admin Şifresi"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button className="btn-login" onClick={handleLogin}>
            Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Admin Panel ────────────────────────────────────────────
function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [licenses, setLicenses] = useState(loadLicenses());
  const [saved, setSaved] = useState(false);

  const handleAdd = () => {
    if (!email || !expireDate) return;
    if (!email.includes('@')) return alert('Geçerli bir Gmail adresi girin!');
    const newList = [...licenses, {
      id: Date.now(),
      email: email.toLowerCase().trim(),
      expireDate,
      active: true
    }];
    setLicenses(newList);
    saveLicenses(newList);
    setEmail('');
    setExpireDate('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemove = (id) => {
    if (!window.confirm('Bu lisansı silmek istediğinizden emin misiniz?')) return;
    const newList = licenses.filter(l => l.id !== id);
    setLicenses(newList);
    saveLicenses(newList);
  };

  const toggleActive = (id) => {
    const newList = licenses.map(l => l.id === id ? { ...l, active: !l.active } : l);
    setLicenses(newList);
    saveLicenses(newList);
  };

  const isExpired = (date) => new Date(date) < new Date();

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  return (
    <div className="admin-page">
      <header className="header">
        <div className="logo">Lisans<span>Paneli</span></div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/" className="btn-admin">Ana Sayfa</Link>
          <button className="btn-admin" onClick={() => setAuthed(false)} style={{ cursor: 'pointer', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}>
            <LogOut size={14} style={{ marginRight: 4 }} /> Çıkış
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-header-row">
          <div>
            <h2>Lisans Yönetimi</h2>
            <p className="admin-subtitle">Uygulamaya giriş yapmasına izin verilen Gmail adreslerini yönetin.</p>
          </div>
          <div className="stats-row">
            <div className="stat-chip green">
              <CheckCircle size={14} /> {licenses.filter(l => l.active && !isExpired(l.expireDate)).length} Aktif
            </div>
            <div className="stat-chip red">
              <XCircle size={14} /> {licenses.filter(l => !l.active || isExpired(l.expireDate)).length} Pasif
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 style={{ marginBottom: 16, color: '#94a3b8', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Yeni Lisans Ekle</h3>
          <div className="form-row">
            <input
              type="email"
              placeholder="ornek@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <input
              type="date"
              value={expireDate}
              onChange={e => setExpireDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <button className="btn-primary" onClick={handleAdd}>
              <UserPlus size={16} /> {saved ? '✅ Eklendi!' : 'Lisans Ekle'}
            </button>
          </div>

          <div className="table-wrapper">
            <table className="license-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Gmail Adresi</th>
                  <th>Bitiş Tarihi</th>
                  <th>Durum</th>
                  <th>Aktif/Pasif</th>
                  <th>Sil</th>
                </tr>
              </thead>
              <tbody>
                {licenses.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: 32 }}>Henüz lisans eklenmedi.</td></tr>
                )}
                {licenses.map((l, i) => {
                  const expired = isExpired(l.expireDate);
                  return (
                    <tr key={l.id} className={!l.active || expired ? 'row-inactive' : ''}>
                      <td style={{ color: '#64748b' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{l.email}</td>
                      <td style={{ color: expired ? '#ef4444' : '#94a3b8' }}>
                        {l.expireDate} {expired && '⚠️ Süresi Dolmuş'}
                      </td>
                      <td>
                        {l.active && !expired
                          ? <span className="badge-active">✅ Aktif</span>
                          : <span className="badge-inactive">🚫 Pasif</span>
                        }
                      </td>
                      <td>
                        <button
                          className={`btn-toggle ${l.active ? 'on' : 'off'}`}
                          onClick={() => toggleActive(l.id)}
                        >
                          {l.active ? 'Durdur' : 'Aktifleştir'}
                        </button>
                      </td>
                      <td>
                        <button className="btn-danger" onClick={() => handleRemove(l.id)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 24, background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
          <h3 style={{ color: '#6366f1', marginBottom: 8 }}>📋 Nasıl Çalışır?</h3>
          <ol style={{ color: '#94a3b8', fontSize: 14, lineHeight: 2, paddingLeft: 20 }}>
            <li>Müşteri RestoPOS uygulamasını kurar ve açar.</li>
            <li>Uygulama açılışında o kişinin Gmail adresi bu listeyle karşılaştırılır.</li>
            <li>Listede <strong>Aktif</strong> ve süresi geçmemiş bir lisans varsa giriş yapabilir.</li>
            <li>Lisans yoksa, süresi dolduysa veya "Durdurulduysa" uygulama açılmaz.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
