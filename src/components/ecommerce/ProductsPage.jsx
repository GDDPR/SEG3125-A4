import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import products from '../../data/golfProducts.json';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

const initialFilters = {
  search: '', brand: '', price: '', skillLevel: '', rating: '', onSale: false, inStock: false,
};

const categories = [
  { id: 'all', label: 'All' },
  { id: 'drivers', label: 'Drivers' },
  { id: 'fairway-woods', label: 'Fairway Woods' },
  { id: 'irons', label: 'Irons' },
  { id: 'wedges', label: 'Wedges' },
  { id: 'putters', label: 'Putters' },
  { id: 'sale', label: 'Sale' },
  { id: 'accessories', label: 'Accessories' },
];

const queryCategoryMap = {
  Driver: 'drivers', 'Fairway Wood': 'fairway-woods', 'Iron Set': 'irons', Wedge: 'wedges', Putter: 'putters', Accessory: 'accessories',
};

function matchesCategory(product, category) {
  if (category === 'all') return true;
  if (category === 'drivers') return product.productType === 'Driver';
  if (category === 'fairway-woods') return product.productType === 'Fairway Wood';
  if (category === 'irons') return product.productType.toLowerCase().includes('iron');
  if (category === 'wedges') return product.productType === 'Wedge';
  if (category === 'putters') return product.productType === 'Putter';
  if (category === 'sale') return product.onSale;
  if (category === 'accessories') {
    const accessoryTypes = ['Golf Balls', 'Glove', 'Bag', 'Accessory', 'Rangefinder', 'Training Aid', 'Tees'];
    return product.category === 'Accessory' || accessoryTypes.includes(product.productType);
  }
  return true;
}

function ProductsPage({ addToCart }) {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [category, setCategory] = useState(() => queryCategoryMap[searchParams.get('type')] || 'all');
  const [sort, setSort] = useState('featured');

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      if (!matchesCategory(product, category)) return false;
      const searchable = `${product.name} ${product.brand} ${product.description} ${product.features.join(' ')}`.toLowerCase();
      if (filters.search && !searchable.includes(filters.search.toLowerCase())) return false;
      for (const key of ['brand', 'skillLevel']) {
        if (filters[key] && product[key] !== filters[key]) return false;
      }
      if (filters.price === 'under50' && product.price >= 50) return false;
      if (filters.price === '50to200' && (product.price < 50 || product.price > 200)) return false;
      if (filters.price === '200to500' && (product.price < 200 || product.price > 500)) return false;
      if (filters.price === 'over500' && product.price < 500) return false;
      if (filters.rating && product.rating < Number(filters.rating)) return false;
      if (filters.onSale && !product.onSale) return false;
      if (filters.inStock && !product.inStock) return false;
      return true;
    });
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sort === 'featured') result.sort((a, b) => Number(b.onSale) - Number(a.onSale) || b.rating - a.rating);
    return result;
  }, [category, filters, sort]);

  const facetCount = Object.values(filters).filter((value) => value !== '' && value !== false).length;
  const activeCount = facetCount + (category === 'all' ? 0 : 1);
  const clearFilters = () => { setFilters(initialFilters); setCategory('all'); };

  return (
    <main className="ff-page ff-shop-page">
      <section className="ff-page-header">
        <div className="ff-container">
          <p className="ff-eyebrow">Find your fit</p>
          <h1>Shop golf equipment</h1>
          <p>Compare clubs and accessories by the details that shape your game. Not sure where to start? Try skill level and what you want help with.</p>
          <div className="ff-header-proof"><span>49 real products</span><span>4 trusted golf brands</span><span>Clear fit guidance</span></div>
        </div>
      </section>
      <nav className="ff-category-nav" aria-label="Shop by category">
        <div className="ff-container ff-category-scroll">
          {categories.map((item) => (
            <button
              type="button"
              className={category === item.id ? 'is-active' : ''}
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
              key={item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      <div className="ff-container ff-shop-layout">
        <ProductFilters products={products} filters={filters} setFilters={setFilters} clearFilters={clearFilters} activeCount={activeCount} />
        <section className="ff-results" aria-label="Product results">
          <div className="ff-results-bar">
            <div><p className="ff-results-label">Showing {categories.find((item) => item.id === category)?.label}</p><p role="status" aria-live="polite"><strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'} found</p></div>
            <div className="ff-sort"><label htmlFor="sort-products">Sort by</label><select id="sort-products" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option><option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option><option value="rating">Rating: high to low</option>
            </select></div>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="ff-product-grid">{filteredProducts.map((product) => <ProductCard product={product} addToCart={addToCart} key={product.id} />)}</div>
          ) : (
            <div className="ff-empty-state"><span aria-hidden="true">⛳</span><h2>No gear landed here</h2><p>Try removing a filter or widening your price range.</p><button type="button" className="ff-button" onClick={clearFilters}>Clear all filters</button></div>
          )}
        </section>
      </div>
    </main>
  );
}

export default ProductsPage;
