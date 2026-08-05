import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function predictPrice(data) {
  const r = await fetch(`${API}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error('Failed');
  return r.json();
}

function PredictionForm() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({
    location: '', carpet_area_sqft: '', floor_num: '',
    bathroom: 1, balcony: 0, furnishing: '',
    transaction: '', ownership: '', facing: '', status: ''
  });

  const onChange = (e) => {
    const { name, value, type } = e.target;
    setForm(p => ({...p, [name]: type === 'number' ? Number(value) : value}));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.carpet_area_sqft || form.carpet_area_sqft <= 0) {
      setErr('Area must be > 0'); return;
    }
    if (!form.location) { setErr('Select location'); return; }
    setErr(''); setLoading(true);
    try {
      const r = await predictPrice({
        location: form.location,
        carpet_area_sqft: Number(form.carpet_area_sqft),
        floor_num: Number(form.floor_num) || 0,
        bathroom: Number(form.bathroom),
        balcony: Number(form.balcony),
        furnishing: form.furnishing,
        transaction: form.transaction,
        ownership: form.ownership,
        facing: form.facing,
        status: form.status
      });
      nav('/result', { state: { price: r.predicted_price, form } });
    } catch {
      setErr('API Error');
    } finally {
      setLoading(false);
    }
  };

  const sel = (name, opts) => (
    <select name={name} value={form[name]} onChange={onChange} style={{width: '100%', padding: 8}}>
      <option value=''>Select...</option>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  const LOC = ['other'], FURN = ['Furnished','Semi-Furnished','Unfurnished'];
  const TRANS = ['New Property','Resale'], OWN = ['Freehold','Leasehold'];
  const FACE = ['North','South','East','West','North-East','North-West','South-East','South-West'];
  const STAT = ['Ready to Move','Under Construction'];

  return (
    <form onSubmit={onSubmit} style={{maxWidth: 500, margin: '40px auto', padding: 30, background: 'white', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
      <h2 style={{textAlign: 'center'}}>House Price Prediction</h2>
      {err && <div style={{color: 'red', marginBottom: 15, padding: 10, background: '#ffebee', borderRadius: 6}}>{err}</div>}
      <div style={{marginBottom: 12}}><label>Location</label>{sel('location', LOC)}</div>
      <div style={{marginBottom: 12}}><label>Area (sqft)</label><input type='number' name='carpet_area_sqft' value={form.carpet_area_sqft} onChange={onChange} min={1} style={{width: '100%', padding: 8}} /></div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12}}>
        <div><label>Floor</label><input type='number' name='floor_num' value={form.floor_num} onChange={onChange} style={{width: '100%', padding: 8}} /></div>
        <div><label>Bathrooms</label><input type='number' name='bathroom' value={form.bathroom} onChange={onChange} min={0} style={{width: '100%', padding: 8}} /></div>
      </div>
      <div style={{marginBottom: 12}}><label>Balconies</label><input type='number' name='balcony' value={form.balcony} onChange={onChange} min={0} style={{width: '100%', padding: 8}} /></div>
      <div style={{marginBottom: 12}}><label>Furnishing</label>{sel('furnishing', FURN)}</div>
      <div style={{marginBottom: 12}}><label>Transaction</label>{sel('transaction', TRANS)}</div>
      <div style={{marginBottom: 12}}><label>Ownership</label>{sel('ownership', OWN)}</div>
      <div style={{marginBottom: 12}}><label>Facing</label>{sel('facing', FACE)}</div>
      <div style={{marginBottom: 12}}><label>Status</label>{sel('status', STAT)}</div>
      <button type='submit' disabled={loading} style={{width: '100%', padding: 12, background: '#007bff', color: 'white', border: 'none', borderRadius: 6, fontSize: 16, cursor: 'pointer'}}>
        {loading ? 'Loading...' : 'Predict Price'}
      </button>
    </form>
  );
}

function ResultPage() {
  const { state } = useLocation();
  const nav = useNavigate();
  
  if (!state) return (
    <div style={{textAlign: 'center', marginTop: 50}}>
      <h2>No result</h2>
      <button onClick={() => nav('/')} style={{padding: '10px 20px'}}>Back</button>
    </div>
  );
  
  const fmt = (p) => {
    if (p >= 10000000) return 'Rs ' + (p/10000000).toFixed(2) + ' Cr';
    return 'Rs ' + (p/100000).toFixed(2) + ' Lac';
  };
  
  return (
    <div style={{maxWidth: 500, margin: '40px auto', textAlign: 'center'}}>
      <h2>Predicted Price</h2>
      <div style={{fontSize: 48, fontWeight: 'bold', color: '#007bff', margin: '20px 0'}}>{fmt(state.price)}</div>
      <div style={{background: '#f8f9fa', padding: 15, borderRadius: 8, marginBottom: 20, textAlign: 'left'}}>
        <p><strong>Location:</strong> {state.form.location}</p>
        <p><strong>Area:</strong> {state.form.carpet_area_sqft} sqft</p>
        <p><strong>Floor:</strong> {state.form.floor_num}</p>
      </div>
      <button onClick={() => nav('/')} style={{padding: '12px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'}}>
        New Prediction
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PredictionForm />} />
        <Route path='/result' element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;