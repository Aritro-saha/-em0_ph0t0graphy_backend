import { useNavigate } from 'react-router-dom';
import { useContent } from '../features/content/hooks';
import { PricingPackage } from '../features/content/types';
import { Loader2 } from 'lucide-react';

const Packages = () => {
  const navigate = useNavigate();
  const { data: packages, isLoading } = useContent<PricingPackage[]>('pricing', 'all');

  return (
    <div className="page active" id="page-packages">
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1400&q=80')" }}></div>
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <div className="hero-eyebrow">Crafted for every love story</div>
          <h1>Our Packages</h1>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" /></div>
      ) : (
        <div className="pkg-service-grid">
          {packages ? packages.map((pkg, i) => (
            <div key={i} className="pkg-service-card" onClick={() => navigate(`/packages/${pkg.title.toLowerCase()}`)}>
              <div className="pkg-service-icon">✦</div>
              <h3>{pkg.title}</h3>
              <div className="pkg-starting">Starting at {pkg.price}</div>
              <p>Bespoke photography sessions crafted around your unique story, style, and excellence.</p>
              <button className="btn-outline">View Packages</button>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              No packages found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Packages;
