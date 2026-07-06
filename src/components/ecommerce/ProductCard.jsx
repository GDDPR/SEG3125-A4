import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';

function ProductCard({ product, addToCart }) {
  return (
    <article className="ff-product-card">
      <Link to={`/ecommerce/products/${product.id}`} className="ff-card-visual-link" aria-label={`View ${product.name}`}>
        <ProductImage product={product} />
        <div className="ff-card-badges">
          {product.onSale && <span className="ff-badge ff-badge-sale">Sale</span>}
          {product.isNewArrival && <span className="ff-badge ff-badge-new">New arrival</span>}
          {product.inStock && product.inventoryCount > 0 && product.inventoryCount <= 5 && <span className="ff-badge ff-badge-stock">Only {product.inventoryCount} left</span>}
          {!product.inStock && <span className="ff-badge ff-badge-muted">Out of stock</span>}
        </div>
      </Link>
      <div className="ff-product-card-body">
        <p className="ff-product-kicker">{product.productType}</p>
        <p className="ff-card-brand">{product.brand}</p>
        <h3><Link to={`/ecommerce/products/${product.id}`}>{product.name}</Link></h3>
        <div className="ff-rating" aria-label={`${product.rating} out of 5 stars`}>
          <span aria-hidden="true">★</span> {product.rating}
        </div>
        <div className="ff-card-bottom">
          <div className="ff-price-stack">
            <strong className={`ff-price ${product.onSale ? 'is-sale' : ''}`}>${product.price.toFixed(2)}</strong>
            {product.onSale && <del className="ff-original-price" aria-label={`Original price $${product.originalPrice.toFixed(2)}`}>${product.originalPrice.toFixed(2)}</del>}
          </div>
        </div>
        <div className="ff-card-actions">
          <Link className="ff-button ff-button-outline ff-button-small" to={`/ecommerce/products/${product.id}`}>View details</Link>
          <button type="button" className="ff-button ff-button-small" disabled={!product.inStock} onClick={() => addToCart(product)}>{product.inStock ? 'Add to cart' : 'Unavailable'}</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
