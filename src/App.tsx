import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";

// Components
import WhatsAppButton from "./components/WhatsAppButton";

// Pages
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Gallery from "./pages/Gallery";
import Packages from "./pages/Packages";
import PackageDetail from "./pages/PackageDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClientGallery from "./pages/ClientGallery";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState({ isOpen: false, index: 0, images: [] as string[] });
  const [isIntroVisible, setIsIntroVisible] = useState(() => {
    return !sessionStorage.getItem("introShown");
  });

  useEffect(() => {
    if (isIntroVisible) {
      const timer = setTimeout(() => {
        setIsIntroVisible(false);
        sessionStorage.setItem("introShown", "true");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isIntroVisible]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openLightbox = (index: number, images: string[]) => {
    setLightbox({ isOpen: true, index, images });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightbox({ ...lightbox, isOpen: false });
    document.body.style.overflow = "";
  };

  const lbPrev = () => setLightbox(prev => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }));
  const lbNext = () => setLightbox(prev => ({ ...prev, index: (prev.index + 1) % prev.images.length }));

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname.startsWith('/client-gallery');

  return (
    <div className="app-container">
      {!isAdminPage && isIntroVisible && (
        <div id="intro">
          <div className="intro-logo">MPA</div>
          <div className="intro-line"></div>
          <div className="intro-tagline">Photography Studio</div>
        </div>
      )}

      {lightbox.isOpen && (
        <div id="lightbox" className="open" onClick={(e) => (e.target as any).id === "lightbox" && closeLightbox()}>
          <button className="lb-close" onClick={closeLightbox}></button>
          <button className="lb-prev" onClick={lbPrev}></button>
          <img src={lightbox.images[lightbox.index]} alt="" />
          <button className="lb-next" onClick={lbNext}></button>
          <div className="lb-counter">{lightbox.index + 1} / {lightbox.images.length}</div>
        </div>
      )}

      {!isAdminPage && (
        <div id="mobile-menu" className={isMobileMenuOpen ? "open" : ""}>
          <a className="mobile-nav-link" onClick={() => navigate("/")}>Home</a>
          <a className="mobile-nav-link" onClick={() => navigate("/portfolio")}>Portfolio</a>
          <a className="mobile-nav-link" onClick={() => navigate("/packages")}>Packages</a>
          <a className="mobile-nav-link" onClick={() => navigate("/contact")}>Contact</a>
          <a className="mobile-nav-link" onClick={() => navigate("/about")}>About</a>
        </div>
      )}

      {!isAdminPage && (
        <nav id="navbar" className={isScrolled ? "scrolled" : ""}>
          <a className="nav-logo" onClick={() => navigate("/")}>MPA</a>
          <div className="nav-links">
            <a className={
av-link } onClick={() => navigate("/")}>Home</a>
            <a className={
av-link } onClick={() => navigate("/portfolio")}>Portfolio</a>
            <a className={
av-link } onClick={() => navigate("/packages")}>Packages</a>
            <a className={
av-link } onClick={() => navigate("/contact")}>Contact</a>
            <a className={
av-link } onClick={() => navigate("/about")}>About</a>
          </div>
          <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span></span><span></span><span></span>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/gallery/:id" element={<Gallery openLightbox={openLightbox} />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:service" element={<PackageDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/client-gallery/:id" element={<ClientGallery openLightbox={openLightbox} />} />
      </Routes>

      {!isAdminPage && (
        <footer>
          <div className="footer-grid">
            <div>
              <div className="footer-logo">MPA</div>
              <div className="footer-tagline">Photography Studio Est. 2018</div>
              <div className="social-links">
                <a className="social-link" href="#">IG</a>
                <a className="social-link" href="#">FB</a>
                <a className="social-link" href="#">YT</a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li onClick={() => navigate("/")}>Home</li>
                <li onClick={() => navigate("/portfolio")}>Portfolio</li>
                <li onClick={() => navigate("/packages")}>Packages</li>
                <li onClick={() => navigate("/contact")}>Contact</li>
                <li onClick={() => navigate("/about")}>About</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li>+91 98765 43210</li>
                <li>hello@mpaphotography.in</li>
                <li>Bandra West, Mumbai</li>
                <li>Mon-Sat, 10AM-7PM</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy"> 2025 MPA Photography. All rights reserved.</span>
            <span className="footer-copy">Crafted with love </span>
          </div>
        </footer>
      )}

      {!isAdminPage && showScrollTop && (
        <button 
          className="scroll-to-top" 
          onClick={scrollUp}
          aria-label="Scroll to top"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}

      {!isAdminPage && <WhatsAppButton />}
    </div>
  );
}

export default App;
