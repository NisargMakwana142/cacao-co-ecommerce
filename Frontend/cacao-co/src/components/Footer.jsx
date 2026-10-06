function Footer() {
  return (
    <footer className="footer">

      <div className="newsletter">
        <span className="eyebrow light">
          THE CONNOISSEUR'S NEWSLETTER
        </span>

        <h3>
          Stay connected with CACAO & CO.
        </h3>

        <p>
          Subscribe for exclusive access to limited-edition
          releases, artisan craft insights, and private tasting
          invitations.
        </p>

        <form>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <button type="submit">
            Join
          </button>
        </form>
      </div>


      <div className="footer-column">
        <h4>INFORMATION</h4>

        <a href="#story">Our Story</a>
        <a href="#boutique">Boutique Locations</a>
        <a href="#corporate">Corporate Gifting</a>
        <a href="#wholesale">Wholesale</a>
      </div>


      <div className="footer-column">
        <h4>CONNECT</h4>

        <div className="socials">
          <a href="#instagram">◎</a>
          <a href="#twitter">𝕏</a>
          <a href="#facebook">f</a>
        </div>
      </div>


      <div className="footer-bottom">
        <span>
          © 2026 CACAO & CO. All rights reserved.
        </span>

        <div>
          <a href="#privacy">
            Privacy Policy
          </a>

          <a href="#terms">
            Terms of Service
          </a>

          <a href="#shipping">
            Shipping Policy
          </a>
        </div>
      </div>

    </footer>
  );
}

export default Footer;