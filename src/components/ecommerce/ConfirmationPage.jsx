import { Link, useLocation } from 'react-router-dom';
import CheckoutStepper from './CheckoutStepper';

function ConfirmationPage({ lastOrder }) {
  const location = useLocation();
  const order = location.state?.order || lastOrder;
  return <main className="ff-page ff-confirmation"><div className="ff-container">
    <CheckoutStepper current={5} />
    <section className="ff-confirmation-card" aria-labelledby="confirmation-title"><div className="ff-success-mark" aria-hidden="true">✓</div><p className="ff-eyebrow" role="status">Order confirmed</p><h1 id="confirmation-title">You’re all set for the fairway.</h1><p>Thanks for shopping with FairwayFit. This was a prototype order, so no payment was processed and nothing will be shipped.</p>
      {order && <div className="ff-confirmation-details"><div><span>Order number</span><strong>{order.number}</strong></div><div><span>Order total</span><strong>${order.total.toFixed(2)}</strong></div><div><span>Delivering to</span><strong>{order.shipping.city}, {order.shipping.province}</strong></div></div>}
      <div className="ff-next-round"><span aria-hidden="true">⛳</span><div><h2>How did we play?</h2><p>Tell us how your round went with FairwayFit. Your feedback helps us improve the shopping experience.</p></div><Link className="ff-button" to="/ecommerce/survey">Take the 1-minute survey</Link></div>
      <div className="ff-action-row ff-confirm-actions"><Link className="ff-button ff-button-outline" to="/ecommerce">Back to home</Link><Link className="ff-text-link" to="/ecommerce/products">Keep shopping →</Link></div>
    </section>
  </div></main>;
}

export default ConfirmationPage;
