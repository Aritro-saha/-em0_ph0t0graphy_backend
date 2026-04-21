import React from 'react';
import { useContent } from '../features/content/hooks';
import { AboutContent } from '../features/content/types';

const About = () => {
  const { data: aboutContent } = useContent<AboutContent>('about', 'main');

  return (
    <div className="page active" id="page-about">
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1400&q=80')" }}></div>
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <div className="hero-eyebrow">The visionaries behind the lens</div>
          <h1>{aboutContent?.title || 'About Us'}</h1>
        </div>
      </div>
      <section>
        <div className="contact-grid">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80" 
              alt="About Us" 
              style={{ width: '100%', borderRadius: '4px', marginBottom: '2rem' }} 
            />
          </div>
          <div>
            <p className="section-eyebrow">Our Story</p>
            <h2 className="section-title" style={{ textAlign: 'left', margin: '0 0 1.5rem 0' }}>{aboutContent?.title || 'Crafting Timeless Frames Since 2018'}</h2>
            <div className="gold-divider" style={{ margin: '0 0 2rem 0' }}></div>
            <p style={{ color: 'var(--cream)', lineHeight: '1.8', marginBottom: '1.5rem', opacity: 0.8 }}>
              {aboutContent?.description || 'MPA Photography Studio was founded on a simple belief: that every moment, no matter how fleeting, deserves to be captured with intentionality and soul.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
