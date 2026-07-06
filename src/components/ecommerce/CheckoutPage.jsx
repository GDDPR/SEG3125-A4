import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutStepper from './CheckoutStepper';

const emptyShipping = { firstName: '', lastName: '', email: '', address: '', city: '', province: '', postalCode: '' };
const emptyPayment = { cardholder: '', cardNumber: '', expiry: '', cvv: '' };

function Field({ label, name, value, onChange, error, type = 'text', placeholder = '', hint = '', ...inputProps }) {
  return <div className="ff-field"><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} {...inputProps} />{hint && !error && <small>{hint}</small>}{error && <span className="ff-field-error" id={`${name}-error`}>{error}</span>}</div>;
}

function CheckoutPage({ cart, completeOrder }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(2);
  const [shipping, setShipping] = useState(emptyShipping);
  const [payment, setPayment] = useState(emptyPayment);
  const [errors, setErrors] = useState({});
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 150 ? 0 : 14.99;
  const tax = subtotal * 0.13;
  const total = subtotal + shippingCost + tax;

  const change = (setter) => (event) => { setter((current) => ({ ...current, [event.target.name]: event.target.value })); setErrors((current) => ({ ...current, [event.target.name]: '' })); };
  const validateShipping = () => {
    const next = {};
    Object.entries(shipping).forEach(([key, value]) => { if (!value.trim()) next[key] = 'This field is required.'; });
    if (shipping.email && !/^\S+@\S+\.\S+$/.test(shipping.email)) next.email = 'Enter an email like golfer@example.com.';
    setErrors(next); if (Object.keys(next).length === 0) { setStep(3); window.scrollTo(0, 0); }
  };
  const validatePayment = () => {
    const next = {};
    if (!payment.cardholder.trim()) next.cardholder = 'Enter the name shown on the card.';
    const digits = payment.cardNumber.replace(/\s/g, '');
    if (!digits) next.cardNumber = 'Enter a card number.'; else if (!/^\d{16}$/.test(digits)) next.cardNumber = 'Card number must contain 16 digits.';
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) next.expiry = 'Use the MM/YY format.';
    if (!/^\d{3,4}$/.test(payment.cvv)) next.cvv = 'CVV must be 3 or 4 digits.';
    setErrors(next); if (Object.keys(next).length === 0) { setStep(4); window.scrollTo(0, 0); }
  };
  const placeOrder = () => {
    const order = completeOrder({ total, shipping });
    navigate('/ecommerce/confirmation', { state: { order } });
  };

  if (cart.length === 0) return <main className="ff-page"><div className="ff-container"><div className="ff-empty-state"><h1>Your cart is empty</h1><p>Add something to your bag before starting checkout.</p><Link className="ff-button" to="/ecommerce/products">Shop gear</Link></div></div></main>;

  return <main className="ff-page ff-checkout-page"><div className="ff-container">
    <CheckoutStepper current={step} />
    <div className="ff-checkout-heading"><div><p className="ff-eyebrow">Secure practice checkout</p><h1>{step === 2 ? 'Where should we send your gear?' : step === 3 ? 'How would you like to pay?' : 'Almost done — review your order.'}</h1></div><Link to="/ecommerce/cart">← Back to cart</Link></div>
    <div className="ff-checkout-layout"><section className="ff-checkout-form">
      {step === 2 && <form onSubmit={(e) => { e.preventDefault(); validateShipping(); }} noValidate><div className="ff-form-heading"><span>2</span><div><h2>Shipping information</h2><p>We’ll only use these details for this prototype order.</p></div></div><div className="ff-form-grid">
        <Field label="First name" name="firstName" value={shipping.firstName} onChange={change(setShipping)} error={errors.firstName} />
        <Field label="Last name" name="lastName" value={shipping.lastName} onChange={change(setShipping)} error={errors.lastName} />
        <div className="ff-span-2"><Field label="Email address" name="email" type="email" placeholder="golfer@example.com" value={shipping.email} onChange={change(setShipping)} error={errors.email} hint="Your order confirmation will appear on-screen." /></div>
        <div className="ff-span-2"><Field label="Street address" name="address" value={shipping.address} onChange={change(setShipping)} error={errors.address} /></div>
        <Field label="City" name="city" value={shipping.city} onChange={change(setShipping)} error={errors.city} />
        <Field label="Province" name="province" value={shipping.province} onChange={change(setShipping)} error={errors.province} placeholder="Ontario" />
        <Field label="Postal code" name="postalCode" value={shipping.postalCode} onChange={change(setShipping)} error={errors.postalCode} placeholder="K1N 6N5" />
      </div><button className="ff-button ff-button-large" type="submit">Continue to payment →</button></form>}
      {step === 3 && <form onSubmit={(e) => { e.preventDefault(); validatePayment(); }} noValidate><div className="ff-form-heading"><span>3</span><div><h2>Payment details</h2><p>Use fake information only. No payment is processed or stored.</p></div></div><div className="ff-demo-callout"><strong>Prototype payment</strong><span>Try any 16-digit number, MM/YY expiry, and 3-digit CVV.</span></div><div className="ff-form-grid">
        <div className="ff-span-2"><Field label="Cardholder name" name="cardholder" value={payment.cardholder} onChange={change(setPayment)} error={errors.cardholder} /></div>
        <div className="ff-span-2"><Field label="Card number" name="cardNumber" inputMode="numeric" placeholder="4242 4242 4242 4242" value={payment.cardNumber} onChange={change(setPayment)} error={errors.cardNumber} /></div>
        <Field label="Expiry date" name="expiry" placeholder="MM/YY" value={payment.expiry} onChange={change(setPayment)} error={errors.expiry} />
        <Field label="CVV" name="cvv" type="password" placeholder="123" value={payment.cvv} onChange={change(setPayment)} error={errors.cvv} />
      </div><div className="ff-form-actions"><button type="button" className="ff-button ff-button-outline" onClick={() => { setErrors({}); setStep(2); }}>← Edit shipping</button><button className="ff-button ff-button-large" type="submit">Review your order →</button></div></form>}
      {step === 4 && <div><div className="ff-form-heading"><span>4</span><div><h2>Review and place order</h2><p>Check the details below. You can edit anything before placing the prototype order.</p></div></div>
        <section className="ff-review-section"><div className="ff-review-heading"><h3>Shipping to</h3><button type="button" onClick={() => setStep(2)}>Edit</button></div><p><strong>{shipping.firstName} {shipping.lastName}</strong><br />{shipping.address}<br />{shipping.city}, {shipping.province} {shipping.postalCode}<br />{shipping.email}</p></section>
        <section className="ff-review-section"><div className="ff-review-heading"><h3>Payment</h3><button type="button" onClick={() => setStep(3)}>Edit</button></div><p><strong>{payment.cardholder}</strong><br />Card ending in {payment.cardNumber.replace(/\s/g, '').slice(-4)}</p></section>
        <section className="ff-review-section"><div className="ff-review-heading"><h3>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3><button type="button" onClick={() => navigate('/ecommerce/cart')}>Edit cart</button></div>{cart.map((item) => <div className="ff-review-item" key={item.lineId}><span>{item.quantity} × {item.name}{Object.keys(item.selectedOptions || {}).length > 0 && <small>{Object.values(item.selectedOptions).join(' · ')}</small>}</span><strong>${(item.price * item.quantity).toFixed(2)}</strong></div>)}</section>
        <button className="ff-button ff-button-large ff-button-full" type="button" onClick={placeOrder}>Place prototype order · ${total.toFixed(2)}</button>
      </div>}
    </section><aside className="ff-order-card ff-checkout-summary"><p className="ff-eyebrow">Order summary</p>{cart.map((item) => <div className="ff-summary-product" key={item.lineId}><span>{item.quantity} × {item.name}{Object.keys(item.selectedOptions || {}).length > 0 && <small>{Object.values(item.selectedOptions).join(' · ')}</small>}</span><strong>${(item.price * item.quantity).toFixed(2)}</strong></div>)}<div className="ff-summary-line"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><div className="ff-summary-line"><span>Shipping</span><strong>{shippingCost ? `$${shippingCost.toFixed(2)}` : 'Free'}</strong></div><div className="ff-summary-line"><span>Estimated HST</span><strong>${tax.toFixed(2)}</strong></div><div className="ff-summary-line ff-summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div><p className="ff-secure-note">🔒 This checkout is for demonstration only.</p></aside></div>
  </div></main>;
}

export default CheckoutPage;
