import { usePortfolio } from '../features/portfolio/hooks';
import { Loader2 } from 'lucide-react';

const Portfolio = () => {
  const { data: portfolioImages, isLoading } = usePortfolio();

  const categories = portfolioImages.reduce((acc: any, img: any) => {
    if (!acc[img.category]) {
      acc[img.category] = {
        category: img.category || 'General',
        hero: img.url,
        title: (img.category || 'General').charAt(0).toUpperCase() + (img.category || 'General').slice(1)
      }
    }
    return acc;
  }, {});
  
  const displayCategories = Object.values(categories);

  return (
    <div className="page active" id="page-portfolio">
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1400&q=80')" }}></div>
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <div className="hero-eyebrow">Explore our work</div>
          <h1>Our Portfolio</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" /></div>
      ) : (
        <div className="cat-grid">
          {displayCategories.map((cat: any) => (
            <div key={cat.category} className="cat-card">
              <img src={cat.hero} alt={cat.title} />
              <div className="cat-card-overlay">
                <h3>{cat.title}</h3>
                {/* Simplified: Displaying in a single gallery view for now as requested */}
              </div>
            </div>
          ))}
          
          {displayCategories.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400">
              Your portfolio is currently empty.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
