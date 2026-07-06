const steps = ['Cart', 'Shipping Info', 'Payment', 'Review', 'Confirmation'];

function CheckoutStepper({ current }) {
  return (
    <nav className="ff-stepper" aria-label="Checkout progress">
      <ol>{steps.map((step, index) => {
        const number = index + 1;
        const state = number < current ? 'complete' : number === current ? 'current' : 'remaining';
        return <li className={state} aria-current={number === current ? 'step' : undefined} key={step}><span>{number < current ? '✓' : number}</span><b>{step}</b></li>;
      })}</ol>
    </nav>
  );
}

export default CheckoutStepper;
