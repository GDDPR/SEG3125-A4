import { Link } from 'react-router-dom';
import products from '../../data/golfProducts.json';
import ProductCard from './ProductCard';

const shopLinks = [
  { label: 'Drivers', detail: 'Find speed and forgiveness off the tee', value: 'Driver' },
  { label: 'Irons', detail: 'Build confidence into every approach', value: 'Iron Set' },
  { label: 'Putters', detail: 'Choose a shape that suits your stroke', value: 'Putter' },
  { label: 'Accessories', detail: 'Balls, gloves, and bags for the round', value: 'Accessory' },
];

function EcommerceHomePage({ addToCart }) {
  const featured = products.filter((product) => product.onSale && product.inStock).slice(0, 4);
  return (
    <main className="ff-home">
      <section className="ff-hero">
        <div className="ff-container ff-hero-grid">
          <div className="ff-hero-copy">
            <p className="ff-eyebrow ff-eyebrow-light">Equipment that fits your game</p>
            <h1>Build your bag<br />with confidence.</h1>
            <p>Golf gear should make your next shot feel simpler. We’ll help you compare the right clubs and accessories for your swing, skill level, and goals.</p>
            <div className="ff-action-row"><Link className="ff-button ff-button-light" to="/ecommerce/products">Shop products <span>→</span></Link><Link className="ff-text-link-light" to="/ecommerce/survey">Share your experience</Link></div>
            <div className="ff-trust-row"><span>✓ Free shipping over $150</span><span>✓ 30-day easy returns</span><span>✓ Friendly fit guidance</span></div>
          </div>
          <div className="ff-hero-art">
            <img src={`${import.meta.env.BASE_URL}golf/golf_home.jpg`} alt="Golf ball and iron resting on a sunlit fairway" className="ff-hero-image" />
          </div>
        </div>
      </section>

      <section className="ff-promo-strip"><div className="ff-container"><strong>Weekend fairway deals are live!</strong><span>Save on selected drivers, gloves, balls, and more.</span><Link to="/ecommerce/products">Shop the sale →</Link></div></section>

      <section className="ff-home-section ff-container">
        <div className="ff-section-heading"><div><p className="ff-eyebrow">Shop the course</p><h2>Start with a category</h2></div><p>Move from tee to green with familiar categories and straightforward guidance for every skill level.</p></div>
        <div className="ff-goal-grid">{shopLinks.map((item) => (
          <Link to={`/ecommerce/products?type=${encodeURIComponent(item.value)}`} className="ff-goal-card" key={item.label}>
            <span><strong>{item.label}</strong><small>{item.detail}</small></span>
          </Link>
        ))}</div>
      </section>

      <section className="ff-home-section ff-featured-section"><div className="ff-container">
        <div className="ff-section-heading ff-heading-inline"><div><p className="ff-eyebrow">Weekend picks</p><h2>Fairway favourites</h2></div><Link to="/ecommerce/products" className="ff-text-link">View all equipment →</Link></div>
        <div className="ff-product-grid ff-featured-grid">{featured.map((product) => <ProductCard product={product} addToCart={addToCart} key={product.id} />)}</div>
      </div></section>

      <section className="ff-advice"><div className="ff-container ff-advice-grid"><div className="ff-advice-icon" aria-hidden="true">?</div><div><p className="ff-eyebrow ff-eyebrow-light">A little guidance goes a long way</p><h2>New to golf? Start with forgiveness.</h2><p>A forgiving club has a larger effective hitting area, so imperfect contact can still produce a useful shot. Choose “Beginner” under Skill level to narrow the shop.</p></div><Link to="/ecommerce/products" className="ff-button ff-button-light">Find beginner gear</Link></div></section>
    </main>
  );
}

export default EcommerceHomePage;
