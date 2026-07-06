import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import products from '../../data/golfProducts.json';
import ProductImage from './ProductImage';

const clubTypes = ['Driver', 'Fairway Wood', 'Iron Set', 'Irons', 'Wedge', 'Putter'];
const shaftOptions = ['Regular', 'Stiff', 'Senior', 'Ladies'];

function getClubOptions(product) {
  if (!clubTypes.includes(product.productType)) return {};
  const options = {
    Hand: product.handedness === 'Left' ? 'Left' : 'Right',
    Length: product.productType === 'Putter' ? '34"' : 'Standard',
    Shaft: product.productType === 'Putter' ? 'Steel' : shaftOptions.includes(product.shaftFlex) ? product.shaftFlex : 'Regular',
  };
  if (product.productType === 'Driver') options.Head = '10.5°';
  if (product.productType === 'Fairway Wood') options.Head = '3 Wood';
  return options;
}

function getOptionChoices(product, label) {
  if (label === 'Hand') return ['Right', 'Left'];
  if (label === 'Length') return product.productType === 'Putter' ? ['33"', '34"', '35"'] : ['Standard', '+0.5 inch', '-0.5 inch'];
  if (label === 'Shaft') return product.productType === 'Putter' ? ['Steel', 'Graphite'] : shaftOptions;
  if (label === 'Head') return product.productType === 'Fairway Wood' ? ['3 Wood', '5 Wood', '7 Wood'] : ['9°', '10.5°', '12°'];
  return [];
}

function ProductDetailsContent({ product, addToCart }) {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState(() => getClubOptions(product));
  const [quantity, setQuantity] = useState(1);
  const isClub = clubTypes.includes(product.productType);
  const maximumQuantity = Math.min(5, product.inventoryCount || 5);

  const updateOption = (label, value) => setSelectedOptions((current) => ({ ...current, [label]: value }));
  const addConfiguredProduct = () => addToCart(product, selectedOptions, quantity);
  const buyNow = () => {
    addConfiguredProduct();
    navigate('/ecommerce/checkout');
  };

  return (
    <main className="ff-page ff-detail-page">
      <div className="ff-container">
        <nav className="ff-breadcrumb" aria-label="Breadcrumb"><Link to="/ecommerce">Home</Link><span>/</span><Link to="/ecommerce/products">Shop</Link><span>/</span><span>{product.name}</span></nav>
        <div className="ff-detail-grid">
          <div className="ff-detail-image-panel"><ProductImage product={product} priority /><span>Actual product image</span></div>
          <section className="ff-detail-copy">
            <div className="ff-card-badges">
              {product.onSale && <span className="ff-badge ff-badge-sale">Sale</span>}
              {product.isNewArrival && <span className="ff-badge ff-badge-new">New arrival</span>}
              {product.inStock && product.inventoryCount <= 5 && <span className="ff-badge ff-badge-stock">Only {product.inventoryCount} left</span>}
              {!product.inStock && <span className="ff-badge ff-badge-muted">Out of stock</span>}
            </div>
            <p className="ff-product-kicker">{product.brand} · {product.productType}</p>
            <h1>{product.name}</h1>
            <div className="ff-detail-meta"><span className="ff-rating" aria-label={`${product.rating} out of 5 stars`}><span aria-hidden="true">★★★★★</span> {product.rating}</span><span>Item {product.id.toUpperCase()}</span></div>
            <p className="ff-detail-description">{product.description}</p>
            <div className="ff-detail-price-row">
              <strong className={`ff-detail-price ${product.onSale ? 'is-sale' : ''}`}>${product.price.toFixed(2)}</strong>
              {product.onSale && <del className="ff-detail-original-price" aria-label={`Original price $${product.originalPrice.toFixed(2)}`}>${product.originalPrice.toFixed(2)}</del>}
            </div>

            {isClub && <div className="ff-option-panel"><div className="ff-option-heading"><h2>Choose your setup</h2><span>Selections are included in your cart</span></div>{Object.entries(selectedOptions).map(([label, value]) => (
              <div className="ff-option-row" key={label}><label htmlFor={`option-${label.toLowerCase()}`}>{label}</label><select id={`option-${label.toLowerCase()}`} value={value} onChange={(event) => updateOption(label, event.target.value)}>{getOptionChoices(product, label).map((choice) => <option value={choice} key={choice}>{choice}</option>)}</select></div>
            ))}</div>}

            <div className="ff-purchase-row">
              <div className="ff-quantity-control" aria-label="Quantity selector"><span>Quantity</span><div><button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={quantity === 1} aria-label="Decrease quantity">−</button><output aria-live="polite">{quantity}</output><button type="button" onClick={() => setQuantity((current) => Math.min(maximumQuantity, current + 1))} disabled={quantity === maximumQuantity || !product.inStock} aria-label="Increase quantity">+</button></div></div>
              <div className="ff-purchase-actions"><button className="ff-button ff-button-large ff-button-full" type="button" disabled={!product.inStock} onClick={addConfiguredProduct}>{product.inStock ? 'Add to cart' : 'Currently unavailable'}</button><button className="ff-button ff-button-large ff-button-buy ff-button-full" type="button" disabled={!product.inStock} onClick={buyNow}>Buy now</button></div>
            </div>
            <p className="ff-stock-status">{product.inStock ? product.inventoryCount <= 5 ? `● Only ${product.inventoryCount} left in stock` : '● In stock — ready to ship' : '○ Check back soon for restock'}</p>
            <div className="ff-mini-assurance"><span>Free shipping over $150</span><span>30-day easy returns</span></div>
          </section>
        </div>
        <div className="ff-info-grid">
          <section className="ff-spec-card"><p className="ff-eyebrow">The essentials</p><h2>Specs at a glance</h2><dl>
            {product.accessorySpecs ? Object.entries(product.accessorySpecs).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>) : <><div><dt>Best for</dt><dd>{product.bestFor}</dd></div><div><dt>Skill level</dt><dd>{product.skillLevel}</dd></div><div><dt>Available hand</dt><dd>{product.handedness}</dd></div><div><dt>Standard flex</dt><dd>{product.shaftFlex}</dd></div><div><dt>Colour</dt><dd>{product.color}</dd></div></>}
          </dl></section>
          <section className="ff-feature-card"><p className="ff-eyebrow">Why it works</p><h2>Product highlights</h2><ul>{product.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul></section>
          <aside className="ff-help-card"><span aria-hidden="true">⛳</span><p className="ff-eyebrow ff-eyebrow-light">Need help choosing?</p><h2>We speak golfer, not jargon.</h2><p>{isClub ? 'For a smoother tempo, Regular flex is a comfortable starting point. Faster swings often prefer Stiff.' : 'Compare the essentials above, then choose the accessory that best supports the way you play.'}</p><Link to="/ecommerce/products">Compare more gear →</Link></aside>
        </div>
      </div>
    </main>
  );
}

function ProductDetailsPage({ addToCart }) {
  const { productId } = useParams();
  const product = products.find((item) => item.id === productId);
  if (!product) return <main className="ff-page"><div className="ff-container ff-not-found"><h1>We couldn’t find that product.</h1><Link className="ff-button" to="/ecommerce/products">Back to the shop</Link></div></main>;
  return <ProductDetailsContent product={product} addToCart={addToCart} key={product.id} />;
}

export default ProductDetailsPage;
