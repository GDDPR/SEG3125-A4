import { Link, useNavigate } from 'react-router-dom';
import ProductImage from './ProductImage';
import CheckoutStepper from './CheckoutStepper';

function CartConfiguration({ item }) {
  const options = Object.entries(item.selectedOptions || {});
  if (options.length === 0) return <p className="ff-cart-default-spec">{item.color} · {item.handedness === 'N/A' ? 'Universal fit' : `${item.handedness} handed`}</p>;
  return <dl className="ff-cart-config">{options.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function CartPage({ cart, updateQuantity, removeFromCart }) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal >= 150 ? 0 : 14.99;

  return (
    <main className="ff-page ff-cart-page"><div className="ff-container">
      <CheckoutStepper current={1} />
      <div className="ff-page-title-row"><div><p className="ff-eyebrow">Your selections</p><h1>Your cart</h1><p>Review your gear and selected setup before heading to checkout.</p></div><Link to="/ecommerce/products" className="ff-text-link">← Continue shopping</Link></div>
      {cart.length === 0 ? <div className="ff-empty-state ff-empty-cart"><span className="ff-empty-icon" aria-hidden="true">⛳</span><p className="ff-eyebrow">Your bag is empty</p><h2>Ready to find your next club?</h2><p>Explore real golf equipment and narrow it down with beginner-friendly filters.</p><Link className="ff-button" to="/ecommerce/products">Shop golf gear →</Link></div> : (
        <div className="ff-cart-layout">
          <section className="ff-cart-items" aria-label="Items in cart">{cart.map((item) => (
            <article className="ff-cart-item" key={item.lineId}>
              <Link className="ff-cart-thumb" to={`/ecommerce/products/${item.id}`} aria-label={`View ${item.name}`}><ProductImage product={item} compact /></Link>
              <div className="ff-cart-item-copy"><p className="ff-product-kicker">{item.brand} · {item.productType}</p><h2><Link to={`/ecommerce/products/${item.id}`}>{item.name}</Link></h2><CartConfiguration item={item} /><button type="button" className="ff-remove-button" onClick={() => removeFromCart(item.lineId)}>Remove item</button></div>
              <div className="ff-cart-item-actions"><strong>${(item.price * item.quantity).toFixed(2)}</strong><label htmlFor={`qty-${item.lineId}`}>Quantity</label><select id={`qty-${item.lineId}`} value={item.quantity} onChange={(event) => updateQuantity(item.lineId, Number(event.target.value))}>{Array.from({ length: Math.min(5, item.inventoryCount || 5) }, (_, index) => index + 1).map((quantity) => <option key={quantity}>{quantity}</option>)}</select></div>
            </article>
          ))}</section>
          <aside className="ff-order-card"><p className="ff-eyebrow">Order summary</p><h2>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag</h2><div className="ff-summary-line"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><div className="ff-summary-line"><span>Shipping</span><strong>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</strong></div><div className="ff-summary-line ff-summary-total"><span>Estimated total</span><strong>${(subtotal + shipping).toFixed(2)}</strong></div><p className="ff-summary-note">Taxes are estimated during checkout.</p><button type="button" className="ff-button ff-button-full" onClick={() => navigate('/ecommerce/checkout')}>Continue to shipping →</button><p className="ff-secure-note">Secure practice checkout · No real payment</p></aside>
        </div>
      )}
    </div></main>
  );
}

export default CartPage;
