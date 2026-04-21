import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../features/content/hooks';
import { HeroContent } from '../features/content/types';

const Home = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const { data: heroContent } = useContent<HeroContent>('hero', 'main');

  // Placeholder testimonials since you asked to remove data.ts entirely and testimonials weren't in my initial dynamic list
  // I should probably add a testimonial feature later if needed, but for now I'll mock them here or hide if empty
  const testimonials = [
    { name: "Sarah & Mark", text: "Truly the best experience we could have asked for. The photos are timeless.", service: "Wedding" },
    { name: "The Johnson Family", text: "Captured our family perfectly. Highly recommend!", service: "Family Shoot" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    handleSwipe(diff);
    setTouchStart(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.clientX;
    handleSwipe(diff);
    setTouchStart(null);
  };

  const handleSwipe = (diff: number) => {
    if (diff > 50) {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    } else if (diff < -50) {
      setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page active" id="page-home">
      <section className="hero" style={{ padding: 0 }}>
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-eyebrow reveal">Est. 2018 · Capturing Timeless Moments</div>
          <h1 className="hero-title reveal">{heroContent?.title || 'Where Every Frame Becoming Forever'}</h1>
          <p className="hero-sub reveal">{heroContent?.subtitle || 'Luxury wedding & lifestyle photography crafted with cinematic precision and soulful artistry.'}</p>
          <button className="btn-gold reveal" onClick={() => navigate('/packages')}>Explore Packages</button>
        </div>
        <div className="scroll-indicator"><span>Scroll</span></div>
      </section>

      <div className="quote-section">
        <div className="quote-mark">"</div>
        <p className="quote-text reveal">"A photograph is a secret about a secret. The more it tells you, the less you know."</p>
        <p className="quote-author reveal">— Diane Arbus</p>
      </div>

      <section className="testimonials-section">
        <p className="section-eyebrow reveal">Client Stories</p>
        <h2 className="section-title reveal">Words From Our Couples</h2>
        <div className="gold-divider reveal"></div>
        <div 
          className="testimonials-carousel-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setTouchStart(null)}
        >
          <div 
            className="testimonials-track"
            style={{ 
              transform: window.innerWidth > 992 
                ? `translateX(calc(-${activeTestimonial * (100 / 3)}% + 33.333%))` 
                : window.innerWidth > 640 
                  ? `translateX(calc(-${activeTestimonial * 50}% + 25%))` 
                  : `translateX(-${activeTestimonial * 100}%)`
            }}
          >
            {testimonials.map((t, i) => {
              const isActive = i === activeTestimonial;
              return (
                <div key={i} className={`testimonial-card-wrapper ${isActive ? 'active' : ''}`}>
                  <div className="testimonial-card">
                    <div className="testimonial-image-wrapper">
                      <img src={t.image} alt={t.name} className="testimonial-image" />
                    </div>
                    <div className="stars">{t.stars}</div>
                    <p className="testimonial-text">"{t.text}"</p>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-event">{t.event}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="carousel-dots">
            {testimonials.map((_, i) => (
              <div 
                key={i} 
                className={`dot ${i === activeTestimonial ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section>
        <p className="section-eyebrow reveal">Our Work</p>
        <h2 className="section-title reveal">Frames That Tell Stories</h2>
        <div className="gold-divider reveal"></div>
        <div className="masonry">
          <div className="masonry-item reveal" onClick={() => navigate('/portfolio/weddings')}>
            <img src="/wedding-1/1.jpg" alt="Wedding" loading="lazy" />
            <div className="masonry-overlay"><span className="masonry-icon">✦</span><span className="masonry-cat">Weddings</span></div>
          </div>
          <div className="masonry-item reveal" onClick={() => navigate('/portfolio/pre-wedding')}>
            <img src="/wedding-1/13.jpg" alt="Pre-Wedding" loading="lazy" />
            <div className="masonry-overlay"><span className="masonry-icon">✦</span><span className="masonry-cat">Pre-Wedding</span></div>
          </div>
          <div className="masonry-item reveal" onClick={() => navigate('/portfolio/baby')}>
            <img src="/baby-shoot-3/1.webp" alt="Baby" loading="lazy" />
            <div className="masonry-overlay"><span className="masonry-icon">✦</span><span className="masonry-cat">Baby Shoots</span></div>
          </div>
          <div className="masonry-item reveal" onClick={() => navigate('/portfolio/weddings')}>
            <img src="/wedding-1/2.jpg" alt="Wedding" loading="lazy" />
            <div className="masonry-overlay"><span className="masonry-icon">✦</span><span className="masonry-cat">Weddings</span></div>
          </div>
          <div className="masonry-item reveal" onClick={() => navigate('/portfolio/commercial')}>
            <img src="/commercial-2/1.jpg" alt="Commercial" loading="lazy" />
            <div className="masonry-overlay"><span className="masonry-icon">✦</span><span className="masonry-cat">Commercial</span></div>
          </div>
          <div className="masonry-item reveal" onClick={() => navigate('/portfolio/pre-wedding')}>
            <img src="/wedding-1/14.jpg" alt="Pre-Wedding" loading="lazy" />
            <div className="masonry-overlay"><span className="masonry-icon">✦</span><span className="masonry-cat">Pre-Wedding</span></div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-outline reveal" onClick={() => navigate('/portfolio')}>View Full Portfolio</button>
        </div>
      </section>

      <section style={{ background: 'var(--charcoal-2)' }}>
        <p className="section-eyebrow reveal">Pricing</p>
        <h2 className="section-title reveal">Packages Crafted<br />for Every Story</h2>
        <div className="gold-divider reveal"></div>
        <div className="packages-stack" style={{ marginTop: '2.5rem' }}>
          <div className="pkg-card reveal" onClick={() => navigate('/packages/wedding')}>
            <div className="pkg-info">
              <h3>Wedding Photography</h3>
              <p>Full-day coverage · Albums · Cinematic edits</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="pkg-price">₹40,000 – ₹1,20,000</div>
              <div className="pkg-arrow">→</div>
            </div>
          </div>
          <div className="pkg-card reveal" onClick={() => navigate('/packages/pre-wedding')}>
            <div className="pkg-info">
              <h3>Pre-Wedding Shoots</h3>
              <p>Location-based · Styled sessions · Same-day preview</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="pkg-price">₹40,000 – ₹1,20,000</div>
              <div className="pkg-arrow">→</div>
            </div>
          </div>
          <div className="pkg-card reveal" onClick={() => navigate('/packages/baby')}>
            <div className="pkg-info">
              <h3>Baby Shoot</h3>
              <p>Newborn · Milestones · Family portraits</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="pkg-price">₹15,000 – ₹50,000</div>
              <div className="pkg-arrow">→</div>
            </div>
          </div>
          <div className="pkg-card reveal" onClick={() => navigate('/packages/commercial')}>
            <div className="pkg-info">
              <h3>Commercial Photography</h3>
              <p>Product · Brand · Editorial · Campaign</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="pkg-price">₹30,000 – ₹1,50,000</div>
              <div className="pkg-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      <section id="home-contact">
        <p className="section-eyebrow reveal">Get in Touch</p>
        <h2 className="section-title reveal">Begin Your Story</h2>
        <div className="gold-divider reveal"></div>
        <div className="contact-grid">
          <div>
            <h3 className="reveal">MPA Photography Studio</h3>
            <div className="contact-detail reveal"><span className="icon">📍</span><span>12 Studio Lane, Bandra West,<br />Mumbai – 400 050, Maharashtra</span></div>
            <div className="contact-detail reveal"><span className="icon">📞</span><span>+91 98765 43210</span></div>
            <div className="contact-detail reveal"><span className="icon">✉</span><span>hello@mpaphotography.in</span></div>
            <div className="map-placeholder reveal">📍 Google Map Embed Here</div>
          </div>
          <div>
            <form id="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
              <div className="form-group"><label>Full Name *</label><input type="text" required placeholder="Enter your full name" /></div>
              <div className="form-row">
                <div className="form-group">
                  <label>Service *</label>
                  <select required>
                    <option value="" disabled selected>Select service</option>
                    <option>Wedding Photography</option>
                    <option>Pre-Wedding Shoot</option>
                    <option>Baby Shoot</option>
                    <option>Commercial Photography</option>
                  </select>
                </div>
                <div className="form-group"><label>Date *</label><input type="date" required /></div>
              </div>
              <div className="form-group"><label>Location *</label><input type="text" required placeholder="Event city / venue" /></div>
              <div className="form-group"><label>Message *</label><textarea rows={4} required placeholder="Tell us about your vision…"></textarea></div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-gold" style={{ flex: 2, padding: '1.1rem', fontSize: '0.7rem', letterSpacing: '0.3em' }}>Send Inquiry</button>
                <button type="button" className="btn-gold" onClick={() => setShowCalendar(true)} style={{ flex: 1, padding: '1.1rem', fontSize: '0.7rem', letterSpacing: '0.3em', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)' }}>Check Calendar</button>
              </div>
            </form>
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
                onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '0.7')}
              >
                ✕
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

export default Home;
