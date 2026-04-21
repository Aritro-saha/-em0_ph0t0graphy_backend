import { useState } from 'react';
import { submitMessage } from '../features/messages/api';
import { supabase } from '../lib/supabase';
import { Loader2, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    date: '',
    location: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: profile } = await supabase.from('profiles').select('id').limit(1).single();
      
      await submitMessage({
        name: formData.name,
        email: formData.email,
        message: `Service: ${formData.service}\nDate: ${formData.date}\nLocation: ${formData.location}\n\n${formData.message}`,
        user_id: profile?.id || ''
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', service: '', date: '', location: '', message: '' });
    } catch (error) {
      console.error(error);
      alert('Error sending message. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="page active" id="page-contact">
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('/hero/4.jpg')" }}></div>
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <div className="hero-eyebrow">Let's create something beautiful</div>
          <h1>Contact Us</h1>
        </div>
      </div>
      <section>
        <div className="contact-grid">
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: 'var(--cream)', marginBottom: '1.5rem' }}>MPA Photography Studio</h3>
            <div className="contact-detail"><span className="icon"></span><span>12 Studio Lane, Bandra West,<br />Mumbai – 400 050, Maharashtra</span></div>
            <div className="contact-detail"><span className="icon"></span><span>+91 98765 43210</span></div>
            <div className="contact-detail"><span className="icon"></span><span>hello@mpaphotography.in</span></div>
            <div className="map-placeholder"> Google Map Embed Here</div>
          </div>
          <div>
            {submitted ? (
              <div className="bg-white/5 p-12 rounded-2xl text-center border border-white/10">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-400 mb-6">Thank you for reaching out. We'll get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="text-sm underline">Send another message</button>
              </div>
            ) : (
              <form id="contact-form-2" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" required placeholder="Enter your full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" required placeholder="name@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Service *</label>
                    <select required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                      <option value="" disabled>Select service</option>
                      <option>Wedding Photography</option>
                      <option>Pre-Wedding Shoot</option>
                      <option>Baby Shoot</option>
                      <option>Commercial Photography</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Date *</label><input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                </div>
                <div className="form-group"><label>Location *</label><input type="text" required placeholder="Event city / venue" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                <div className="form-group"><label>Message *</label><textarea rows={4} required placeholder="Tell us about your vision" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea></div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" disabled={loading} className="btn-gold" style={{ flex: 2, padding: '1.1rem', fontSize: '0.7rem', letterSpacing: '0.3em', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {loading ? <Loader2 className="animate-spin" size={16} /> : 'Send Inquiry'}
                  </button>
                  <button type="button" className="btn-gold" onClick={() => setShowCalendar(true)} style={{ flex: 1, padding: '1.1rem', fontSize: '0.7rem', letterSpacing: '0.3em', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)' }}>Check Calendar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {showCalendar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <div style={{ 
              padding: '1.5rem 2rem', 
              backgroundColor: '#0d0d0d', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ 
                color: 'var(--cream)', 
                margin: 0, 
                fontSize: '0.9rem', 
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: "'Montserrat', sans-serif"
              }}>
                STUDIO AVAILABILITY
              </h3>
              <button 
                onClick={() => setShowCalendar(false)}
                style={{
                  background: 'none',
                  color: 'var(--cream)',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.7,
                  transition: 'opacity 0.2s'
                }}
              >
                
              </button>
            </div>
            <div style={{ width: '100%', height: 'calc(90vh - 100px)', minHeight: '500px', maxHeight: '700px' }}>
              <iframe 
                src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&showPrint=0&showTabs=0&showCalendars=0&showTz=0&showTitle=0&src=MjBhMjdiNjJiZGZmZTM4MDI2ZjgxOGZjMWZiNThmMmQ3YmM5Zjc4NDk0MDI5OWExNTI2OWMxN2FlNWQ1YjNiNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23795548" 
                style={{ border: 0, width: '100%', height: '100%' }} 
                frameBorder="0" 
                scrolling="no"
                title="Google Calendar"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
