function ProductImage({ product, compact = false, priority = false }) {
  return (
    <div className={`ff-product-image-wrap ${compact ? 'is-compact' : ''}`}>
      <img
        src={`${import.meta.env.BASE_URL}${product.image}`}
        alt={`${product.brand} ${product.name}`}
        className="ff-product-image"
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}

export default ProductImage;
