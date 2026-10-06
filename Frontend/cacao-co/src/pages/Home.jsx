const collections = [
  {
    title: "Masters Collection",
    description: "Rare. Complex. Unforgettable pieces for",
    image: "/images/master-collection.jpg",
  },
  {
    title: "Reserve Collection",
    description: "Limited batches. Exceptional taste.",
    image: "/images/reserve-collection.png",
  },
  {
    title: "Signature Collection",
    description: "Timeless classics, refined through",
    image: "/images/signature-collection.jpg",
  },
  {
    title: "Alchemy Collection",
    description: "Where flavor meets innovation. Unique",
    image: "/images/alchemy-collection.png",
  },
  {
    title: "Gift Collection",
    description: "Thoughtful. Elegant. Unforgettable.",
    image: "/images/gift-collection.jpg",
  },
];

function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="eyebrow">THE ART OF FINE CACAO</span>

          <h1>
            Exceptional
            <br />
            Chocolate
            <br />
            from Extraordinary
            <br />
            Origins
          </h1>

          <p>
            Discover single-origin chocolate crafted from carefully
            selected cacao, where tradition meets extraordinary flavor.
            Every bar tells a story of heritage and craft.
          </p>

          <button className="primary-button">
            EXPLORE COLLECTIONS
            <span>→</span>
          </button>
        </div>

        <div className="hero-slider">
          <span className="active" />
          <span />
          <span />
        </div>

      </section>

      {/* COLLECTIONS */}
      <section className="collections section">
        <div className="section-heading">
          <span className="eyebrow light">FEATURED COLLECTIONS</span>

          <h2>Our Finest Selections</h2>
        </div>

        <div className="collection-grid">
          {collections.map((collection) => (
            <article className="collection-card" key={collection.title}>
              <div className="collection-image">
                <img
                  src={collection.image}
                  alt={collection.title}
                />
              </div>

              <h3>{collection.title}</h3>

              <p>{collection.description}</p>

              <button className="text-button">
                SHOP NOW <span>→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="story">
        <div className="story-image">
          <img
            src="/images/story.png"
            alt="Chocolate being crafted"
          />
        </div>

        <div className="story-content">
          <span className="eyebrow light">OUR STORY</span>

          <h2>
            From the Heart
            <br />
            of Ecuador
          </h2>

          <p>
            We source exceptional cacao from carefully selected
            origins and work closely with producers to create
            chocolate with character, depth, and purity.
          </p>

          <p>
            Our journey began in the high-altitude forests of
            Ecuador, where the rare Arriba Nacional cacao grows.
            Today, we continue that legacy by blending traditional
            techniques with modern innovation to reveal the hidden
            complexities of cacao.
          </p>

          <button className="secondary-button">
            DISCOVER OUR STORY
            <span>→</span>
          </button>
        </div>
      </section>

      {/* GIFTING */}
      <section className="gifting">
        <div className="gifting-overlay"/>

        <div className="gifting-card">
          <h2>The Art of Gifting</h2>

          <p>
            Thoughtful chocolate for unforgettable moments.
            From elegant silk-ribboned boxes to personalized
            tasting flights.
          </p>

          <button className="primary-button dark">
            SHOP GIFTS
          </button>
        </div>
      </section>

      {/* VALUES */}
      <section className="values">
        <div className="value">
          <div className="value-icon">♧</div>
          <h3>ETHICALLY SOURCED</h3>
          <p>
            Supporting producers directly for fair trade and
            sustainable growth.
          </p>
        </div>

        <div className="value">
          <div className="value-icon">♧</div>
          <h3>ARTISAN CRAFTED</h3>
          <p>
            Hand-tempered and finished by our master chocolatiers.
          </p>
        </div>

        <div className="value">
          <div className="value-icon">♧</div>
          <h3>GLOBAL DELIVERY</h3>
          <p>
            Carefully packed in temperature-controlled boxes
            worldwide.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;