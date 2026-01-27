"use client";

export default function Navbar() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --border-radius: 16px;
          --color-text-dark: #1F2937;
          --color-orange-primary: #ef5a13;
          --font-body: 'Manrope', 'Inter', sans-serif;
        }

        .nav-container {
          position: fixed !important;
          top: 20px;
          left: 0;
          right: 0;
          z-index: 999;
          background: transparent !important;
          padding: 12px 16px;
          box-shadow: none;
          transform: none !important;
          opacity: 1 !important;
          transition: none !important;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
        }

        .nav {
          position: relative !important;
          transform: none !important;
          opacity: 1 !important;
          transition: none !important;
          margin: 0 auto !important;
          width: 95% !important;
          max-width: 1200px !important;
          border-radius: var(--border-radius) !important;
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(16px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          box-sizing: border-box;
        }

        .nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 12px 20px;
        }

        .nav-brand-link {
          display: inline-block;
        }

        .nav-brand-logo {
          height: 32px;
          width: auto;
        }

        .nav-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 18px;
          align-items: center;
        }

        .nav-list-item {
          list-style: none;
          position: relative;
          padding-right: 18px;
        }

        .nav-list-item:not(:last-child)::after {
          content: "";
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 16px;
          background: rgba(0, 0, 0, 0.12);
        }

        .nav-list-link {
          color: var(--color-text-dark);
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          font-family: var(--font-body);
          transition: color 0.2s;
        }

        .nav-list-link:hover {
          color: var(--color-orange-primary);
        }

        .hide-desktop {
          display: none;
        }

        .nav-cta {
          display: flex;
        }

        .cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(to right, #ef5a13, #e7000e);
          color: white;
          font-weight: 500;
          padding: 0.625rem 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
          text-decoration: none;
          font-size: 0.875rem;
        }

        .cta:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .cta-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cta-text {
          color: white;
        }

        .cta-arrow-wrap {
          display: flex;
          align-items: center;
        }

        .cta-arrow {
          width: 16px;
          height: 16px;
        }

        .nav-menu-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .nav-list {
            display: none;
          }
          
          .hide-desktop {
            display: block;
          }
        }
      `}} />
      
      <div className="nav-container">
        <nav className="nav">
          <div className="nav-wrapper">
            <a href="/" className="nav-brand-link">
              <img src="/logo-navbar.svg" loading="lazy" alt="FreelanceAugmenté Logo" className="nav-brand-logo" />
            </a>
            <ul role="list" className="nav-list">
              <li className="nav-list-item"><a href="/#integrations" className="nav-list-link">Programme</a></li>
              <li className="nav-list-item"><a href="/#features" className="nav-list-link">Générateur</a></li>
              <li className="nav-list-item"><a href="/#testimonials" className="nav-list-link">Avis</a></li>
              <li className="nav-list-item"><a href="/#faqs" className="nav-list-link">FAQ</a></li>
            </ul>
            <div className="nav-cta">
              <a href="/" className="cta">
                <div className="cta-wrap">
                  <div className="cta-text">Retour à l&apos;accueil</div>
                  <div className="cta-arrow-wrap">
                    <img src="https://cdn.prod.website-files.com/68b801acff955da298bc9db6/68b8711c204cdf2d2e8224c2_Vector.svg" loading="lazy" alt="" className="cta-arrow" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
