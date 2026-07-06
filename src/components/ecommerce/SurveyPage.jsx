import { useState } from 'react';
import { Link } from 'react-router-dom';

function SurveyPage() {
  const [form, setForm] = useState({ rating: '', easy: '', helpful: '', comment: '', email: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const update = (event) => { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); setErrors((current) => ({ ...current, [event.target.name]: '' })); };
  const submit = (event) => {
    event.preventDefault(); const next = {};
    if (!form.rating) next.rating = 'Choose a rating from 1 to 5.';
    if (!form.easy) next.easy = 'Tell us whether finding a product felt easy.';
    if (!form.helpful) next.helpful = 'Choose the part that helped most.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email or leave this blank.';
    setErrors(next); if (Object.keys(next).length === 0) { setSubmitted(true); window.scrollTo(0, 0); }
  };

  if (submitted) return <main className="ff-page ff-survey-page"><div className="ff-container ff-survey-container"><section className="ff-survey-success" aria-labelledby="survey-thanks-title"><div className="ff-success-mark" aria-hidden="true">✓</div><p className="ff-eyebrow" role="status">Feedback received</p><h1 id="survey-thanks-title">Thanks for helping us improve our game.</h1><p>Your feedback helps us make product discovery and checkout clearer for every golfer who visits FairwayFit.</p><Link className="ff-button" to="/ecommerce">Return to FairwayFit</Link></section></div></main>;

  return <main className="ff-page ff-survey-page"><div className="ff-container ff-survey-container"><header className="ff-survey-header"><span aria-hidden="true">⚑</span><p className="ff-eyebrow">One-minute survey</p><h1>Tell us how your round went.</h1><p>Whether you browsed, filled your cart, or completed checkout, we’d love to know what worked for you.</p></header>
    <form className="ff-survey-form" onSubmit={submit} noValidate>
      <fieldset><legend>1. How would you rate your overall experience? <span>*</span></legend><p className="ff-question-help">1 is “needs work” and 5 is “excellent.”</p><div className="ff-rating-options">{[1,2,3,4,5].map((number) => <label key={number}><input type="radio" name="rating" value={number} checked={form.rating === String(number)} onChange={update} /><span><b>{number}</b><small>{'★'.repeat(number)}</small></span></label>)}</div>{errors.rating && <p className="ff-field-error">{errors.rating}</p>}</fieldset>
      <fieldset><legend>2. Was it easy to find the right product? <span>*</span></legend><div className="ff-choice-row"><label><input type="radio" name="easy" value="Yes" checked={form.easy === 'Yes'} onChange={update} /><span>Yes, it was easy</span></label><label><input type="radio" name="easy" value="No" checked={form.easy === 'No'} onChange={update} /><span>No, I needed more help</span></label></div>{errors.easy && <p className="ff-field-error">{errors.easy}</p>}</fieldset>
      <fieldset><legend>3. Which part helped you most? <span>*</span></legend><div className="ff-helpful-grid">{['Filters', 'Product details', 'Cart', 'Checkout'].map((part) => <label key={part}><input type="radio" name="helpful" value={part} checked={form.helpful === part} onChange={update} /><span>{part}</span></label>)}</div>{errors.helpful && <p className="ff-field-error">{errors.helpful}</p>}</fieldset>
      <div className="ff-field"><label htmlFor="comment">4. Anything else you’d like us to know?</label><textarea id="comment" name="comment" rows="5" value={form.comment} onChange={update} placeholder="Tell us what felt smooth or where you got stuck…" /></div>
      <div className="ff-field"><label htmlFor="survey-email">5. Email <small>(optional)</small></label><input id="survey-email" name="email" type="email" value={form.email} onChange={update} placeholder="golfer@example.com" aria-invalid={Boolean(errors.email)} />{errors.email && <span className="ff-field-error">{errors.email}</span>}<small>Only included to demonstrate an optional contact field.</small></div>
      <button className="ff-button ff-button-large ff-button-full" type="submit">Submit feedback</button><p className="ff-survey-privacy">Your answers stay in this browser session and are not sent anywhere.</p>
    </form>
  </div></main>;
}

export default SurveyPage;
