import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { packageData } from '../data';

const PackageDetail = () => {
  const { service } = useParams<{ service: string }>();

  if (!service || !packageData[service]) {
    return <div className="page active"><section><h2>Package not found</h2></section></div>;
  }

  const pkg = packageData[service];

  return (
    <div className="page active" id="page-detail">
      <div className="breadcrumb"><Link to="/packages">Packages</Link> › <span>{pkg.title}</span></div>
      <section style={{ paddingTop: '2rem' }}>
        <p className="section-eyebrow">Choose your experience</p>
        <h2 className="section-title">{pkg.title}</h2>
        <div className="gold-divider"></div>
      </section>
      <div className="tiers-grid">
        {pkg.tiers.map((t: any, i: number) => (
          <div key={i} className={`tier-card ${t.featured ? 'featured' : ''}`}>
            {t.featured && <div className="tier-badge">Most Popular</div>}
            <div className="tier-name">{t.name}</div>
            <div className="tier-price">{t.price}</div>
            <div className="tier-divider"></div>
            <ul className="tier-features">
              {t.features.map((f: string, fi: number) => <li key={fi}>{f}</li>)}
            </ul>
            <a className="whatsapp-btn" href={`https://wa.me/919876543210?text=Inquiry for ${t.name} ${pkg.title}`} target="_blank" rel="noreferrer">
              Inquire on WhatsApp
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageDetail;
