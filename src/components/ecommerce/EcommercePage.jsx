import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import EcommerceNavbar from './EcommerceNavbar';
import EcommerceHomePage from './EcommerceHomePage';
import ProductsPage from './ProductsPage';
import ProductDetailsPage from './ProductDetailsPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import ConfirmationPage from './ConfirmationPage';
import SurveyPage from './SurveyPage';
import products from '../../data/golfProducts.json';
import './ecommerce.css';

function buildLineId(productId, selectedOptions = {}) {
  const optionKey = Object.entries(selectedOptions).map(([key, value]) => `${key}:${value}`).join('|');
  return optionKey ? `${productId}--${encodeURIComponent(optionKey)}` : productId;
}

function readCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem('fairwayfit-cart')) || [];
    return savedCart.flatMap((savedItem) => {
      const currentProduct = products.find((product) => product.id === savedItem.id);
      if (!currentProduct) return [];
      const selectedOptions = savedItem.selectedOptions || {};
      return [{
        ...currentProduct,
        selectedOptions,
        lineId: buildLineId(currentProduct.id, selectedOptions),
        quantity: Math.max(1, Math.min(savedItem.quantity || 1, Math.min(5, currentProduct.inventoryCount || 5))),
      }];
    });
  } catch { return []; }
}

function EcommercePage() {
  const [cart, setCart] = useState(readCart);
  const [lastOrder, setLastOrder] = useState(null);
  const [notice, setNotice] = useState('');
  useEffect(() => { localStorage.setItem('fairwayfit-cart', JSON.stringify(cart)); }, [cart]);

  const addToCart = (product, selectedOptions = {}, quantity = 1) => {
    const lineId = buildLineId(product.id, selectedOptions);
    const maximumQuantity = Math.min(5, product.inventoryCount || 5);
    setCart((current) => {
      const existing = current.find((item) => item.lineId === lineId);
      return existing
        ? current.map((item) => item.lineId === lineId ? { ...item, quantity: Math.min(item.quantity + quantity, maximumQuantity) } : item)
        : [...current, { ...product, selectedOptions, lineId, quantity: Math.max(1, Math.min(quantity, maximumQuantity)) }];
    });
    setNotice(`${product.name} added to cart.`); window.setTimeout(() => setNotice(''), 2500);
  };
  const updateQuantity = (lineId, quantity) => setCart((current) => current.map((item) => item.lineId === lineId ? { ...item, quantity: Math.max(1, Math.min(quantity, Math.min(5, item.inventoryCount || 5))) } : item));
  const removeFromCart = (lineId) => setCart((current) => current.filter((item) => item.lineId !== lineId));
  const completeOrder = ({ total, shipping }) => {
    const order = { number: `FF-${String(Date.now()).slice(-6)}`, total, shipping };
    setLastOrder(order); setCart([]); return order;
  };
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return <div className="ff-store">
    <button className="ff-skip-link" type="button" onClick={() => document.getElementById('ff-main')?.focus()}>Skip to main content</button>
    <EcommerceNavbar cartCount={cartCount} />
    {notice && <div className="ff-toast" role="status">✓ {notice}</div>}
    <div id="ff-main" tabIndex="-1">
      <Routes>
        <Route index element={<EcommerceHomePage addToCart={addToCart} />} />
        <Route path="products" element={<ProductsPage addToCart={addToCart} />} />
        <Route path="products/:productId" element={<ProductDetailsPage addToCart={addToCart} />} />
        <Route path="cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
        <Route path="checkout" element={<CheckoutPage cart={cart} completeOrder={completeOrder} />} />
        <Route path="confirmation" element={<ConfirmationPage lastOrder={lastOrder} />} />
        <Route path="survey" element={<SurveyPage />} />
      </Routes>
    </div>
    <footer className="ff-footer"><div className="ff-container"><div><strong>FairwayFit Golf</strong><p>Helpful gear guidance for every kind of golfer.</p></div><div><Link to="/ecommerce/products">Shop</Link><Link to="/ecommerce/survey">Survey</Link><Link to="/">Portfolio</Link></div><small>SEG3125 · High-fidelity e-commerce prototype</small></div></footer>
  </div>;
}

export default EcommercePage;
