import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { Download, Monitor, Smartphone, Shield, Server, ArrowRight, UserPlus, Trash2 } from 'lucide-react';
import './index.css';

function Home() {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">RestoPOS<span>Pro</span></div>
        <nav>
          <a href="#features">Özellikler</a>
          <a href="#download">İndir</a>
          <Link to="/admin" className="btn-admin">Lisans Paneli</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>Restoranınızı Yerel Ağ Hızıyla, Bulut Güvencesiyle Yönetin</h1>
          <p>Windows Ana Kasa ve Android Tabletler internete ihtiyaç duymadan yerel ağınızda (Wi-Fi) senkronize çalışır. Sadece giriş yaparken lisans onayı alır.</p>
          <div className="hero-buttons">
            <a href="#download" className="btn-primary">Hemen İndir <ArrowRight size={18}/></a>
          </div>
        </section>

        <section id="features" className="features">
          <div className="feature-card">
            <Server size={32} color="#6366f1"/>
            <h3>Yerel Sunucu Mimarisi</h3>
            <p>Windows bilgisayarınız Ana Sunucu (Server) olur. Verileriniz kendi bilgisayarınızda güvende kalır.</p>
          </div>
          <div className="feature-card">
            <Smartphone size={32} color="#10b981"/>
            <h3>Tablet Senkronizasyonu</h3>
            <p>Garson tabletleri, restoranın kendi ağı üzerinden Ana Kasa'ya milisaniyeler içinde bağlanır.</p>
          </div>
          <div className="feature-card">
            <Shield size={32} color="#f59e0b"/>
            <h3>Bulut Lisans Koruması</h3>
            <p>Cihazlar açıldığında Google hesabınız üzerinden lisans sürenizi kontrol eder, korsan kullanımı engeller.</p>
          </div>
        </section>

        <section id="download" className="download-section">
          <h2>Uygulamaları İndir</h2>
          <div className="download-grid">
            <div className="download-card">
              <Monitor size={48} color="#0078D4"/>
              <h3>Windows Ana Kasa</h3>
              <p>Restoranın ana bilgisayarına kurulacak sunucu ve kasiyer uygulaması.</p>
              <a href="/RestoPOS Setup 1.0.0.exe" download className="btn-download" style={{ display: 'block', textDecoration: 'none' }}>Setup.exe İndir (v1.0)</a>
            </div>
            <div className="download-card">
              <Smartphone size={48} color="#3DDC84"/>
              <h3>Android Tablet</h3>
              <p>Garsonların sipariş almak için kullanacağı mobil uygulama.</p>
              <a href="/RestoPOS_Tablet.apk" download className="btn-download" style={{ display: 'block', textDecoration: 'none' }}>Tablet.apk İndir (v1.0)</a>
            </div>
          </div>
        </section>
      </main>
      
      <footer>
        <p>&copy; 2026 RestoPOS Pro. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

function AdminPanel() {
  const [email, setEmail] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [licenses, setLicenses] = useState([
    { id: 1, email: 'ornek@restoran.com', expireDate: '2026-12-31' }
  ]);

  const addLicense = () => {
    if(!email || !expireDate) return;
    setLicenses([...licenses, { id: Date.now(), email, expireDate }]);
    setEmail('');
    setExpireDate('');
  };

  const removeLicense = (id) => {
    setLicenses(licenses.filter(l => l.id !== id));
  };

  return (
    <div className="admin-page">
      <header className="header">
        <div className="logo">Lisans<span>Paneli</span></div>
        <Link to="/" className="btn-admin">Geri Dön</Link>
      </header>
      <main className="admin-main">
        <h2>Aktif Lisans Yönetimi</h2>
        <p className="admin-subtitle">Uygulamaya giriş yapmasına izin verilen Gmail hesaplarını buradan ekleyin.</p>
        
        <div className="admin-card">
          <div className="form-row">
            <input type="email" placeholder="Gmail Adresi" value={email} onChange={e=>setEmail(e.target.value)}/>
            <input type="date" value={expireDate} onChange={e=>setExpireDate(e.target.value)}/>
            <button className="btn-primary" onClick={addLicense}><UserPlus size={16}/> Lisans Tanımla</button>
          </div>

          <table className="license-table">
            <thead>
              <tr>
                <th>Gmail Adresi</th>
                <th>Bitiş Tarihi</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(l => (
                <tr key={l.id}>
                  <td>{l.email}</td>
                  <td>{l.expireDate}</td>
                  <td><span className="badge-active">Aktif</span></td>
                  <td><button className="btn-danger" onClick={()=>removeLicense(l.id)}><Trash2 size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
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
