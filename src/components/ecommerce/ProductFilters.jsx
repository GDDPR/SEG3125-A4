const labels = {
  brand: 'Brand', skillLevel: 'Skill level',
};

const brandOptions = ['Callaway', 'Ping', 'Titleist', 'Cleveland'];

function unique(products, key) {
  return [...new Set(products.map((product) => product[key]))].sort();
}

function ProductFilters({ products, filters, setFilters, clearFilters, activeCount }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const options = {
    brand: brandOptions,
    skillLevel: unique(products, 'skillLevel'),
  };

  return (
    <aside className="ff-filters" aria-label="Product filters">
      <div className="ff-filter-heading">
        <div><p className="ff-eyebrow">Narrow the fairway</p><h2>Filters</h2></div>
        {activeCount > 0 && <span className="ff-filter-count">{activeCount} active</span>}
      </div>
      <p className="ff-filter-help">Choose what matters to you. Results update as you go.</p>

      <div className="ff-filter-group">
        <label htmlFor="filter-search">Search</label>
        <input id="filter-search" type="search" placeholder="Name, brand, or feature" value={filters.search} onChange={(e) => update('search', e.target.value)} />
      </div>

      {Object.entries(options).map(([key, values]) => (
        <div className="ff-filter-group" key={key}>
          <label htmlFor={`filter-${key}`}>{labels[key]}</label>
          <select id={`filter-${key}`} value={filters[key]} onChange={(e) => update(key, e.target.value)}>
            <option value="">All {labels[key].toLowerCase()}</option>
            {values.map((value) => <option value={value} key={value}>{value}</option>)}
          </select>
        </div>
      ))}

      <div className="ff-filter-group">
        <label htmlFor="filter-price">Price range</label>
        <select id="filter-price" value={filters.price} onChange={(e) => update('price', e.target.value)}>
          <option value="">Any price</option><option value="under50">Under $50</option>
          <option value="50to200">$50–$200</option><option value="200to500">$200–$500</option>
          <option value="over500">$500+</option>
        </select>
      </div>
      <div className="ff-filter-group">
        <label htmlFor="filter-rating">Minimum rating</label>
        <select id="filter-rating" value={filters.rating} onChange={(e) => update('rating', e.target.value)}>
          <option value="">Any rating</option><option value="3">3+</option><option value="3.5">3.5+</option>
          <option value="4">4+</option><option value="4.5">4.5+</option>
        </select>
      </div>
      <label className="ff-check"><input type="checkbox" checked={filters.onSale} onChange={(e) => update('onSale', e.target.checked)} /> On sale only</label>
      <label className="ff-check"><input type="checkbox" checked={filters.inStock} onChange={(e) => update('inStock', e.target.checked)} /> In stock only</label>
      <button type="button" className="ff-button ff-button-outline ff-button-full" onClick={clearFilters} disabled={activeCount === 0}>Clear filters</button>
    </aside>
  );
}

export default ProductFilters;
