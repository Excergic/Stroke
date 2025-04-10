"use client";
import { Paintbrush2, Palette, Share2, Layers, Sparkles, ChevronRight } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-blur">
            <div className="hero-blur-inner"></div>
          </div>
          
          <h1 className="hero-title">
            Unleash your creativity
            <span className="hero-highlight">
              <span> with Canvas</span>
            </span>
          </h1>
          <p className="hero-description">
            A powerful digital canvas where imagination meets technology. Create stunning artwork, collaborate with others, and share your masterpieces with the world.
          </p>
          <div className="hero-buttons">
            <a
              href="#"
              className="button-primary"
            >
              Start Drawing <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Everything you need to create amazing art
            </h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <dt className="feature-title">
                <Paintbrush2 className="h-5 w-5 feature-icon" />
                Professional Tools
              </dt>
              <dd className="feature-description">
                <p>Advanced brushes, layers, and tools designed for both beginners and professionals.</p>
              </dd>
            </div>
            <div className="feature-card">
              <dt className="feature-title">
                <Share2 className="h-5 w-5 feature-icon" />
                Real-time Collaboration
              </dt>
              <dd className="feature-description">
                <p>Work together with other artists in real-time, share feedback, and create together.</p>
              </dd>
            </div>
            <div className="feature-card">
              <dt className="feature-title">
                <Sparkles className="h-5 w-5 feature-icon" />
                AI-Powered Features
              </dt>
              <dd className="feature-description">
                <p>Enhanced creativity with AI-assisted tools and smart suggestions.</p>
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="preview">
        <div className="preview-container">
          <div className="preview-content">
            <h2 className="preview-title">Powerful features for limitless creativity</h2>
            <p className="preview-description">
              Experience a new way of digital art creation with our intuitive interface and powerful tools.
            </p>
            <div className="preview-features">
              <div className="preview-feature">
                <Layers className="h-7 w-5 preview-feature-icon" />
                <div>
                  <h3 className="preview-feature-title">Advanced Layer System</h3>
                  <p className="preview-feature-description">Create complex artwork with our powerful layer management system.</p>
                </div>
              </div>
              <div className="preview-feature">
                <Palette className="h-7 w-5 preview-feature-icon" />
                <div>
                  <h3 className="preview-feature-title">Custom Brushes</h3>
                  <p className="preview-feature-description">Create and customize your own brushes for unique artistic expressions.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="preview-image">
            <div className="preview-image-bg">
              <div className="preview-image-gradient"></div>
              <div className="preview-image-radial"></div>
            </div>
            <div className="preview-image-content">
              <div className="preview-image-icon">
                <Paintbrush2 className="w-24 h-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <a href="#" className="footer-link">
              Terms
            </a>
            <a href="#" className="footer-link">
              Privacy
            </a>
            <a href="#" className="footer-link">
              Contact
            </a>
          </div>
          <div className="footer-copyright">
            <p>
              &copy; 2025 Canvas. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
