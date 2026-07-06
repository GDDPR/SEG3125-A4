const brandOptions = ['Callaway', 'Ping', 'Titleist', 'Cleveland'];

const priceOptions = [
  { value: 'under50', label: 'Under $50' },
  { value: '50to200', label: '$50–$200' },
  { value: '200to500', label: '$200–$500' },
  { value: 'over500', label: '$500+' },
];

const ratingOptions = [
  { value: '3', label: '3+ stars' },
  { value: '3.5', label: '3.5+ stars' },
  { value: '4', label: '4+ stars' },
  { value: '4.5', label: '4.5+ stars' },
];

function unique(products, key) {
  return [...new Set(products.map((product) => product[key]))].sort();
}

function ProductFilters({ products, filters, setFilters, clearFilters, activeCount }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const toggleOption = (key, value) => setFilters((current) => ({
    ...current,
    [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
  }));
  const filterGroups = [
    { key: 'brand', label: 'Brand', options: brandOptions.map((value) => ({ value, label: value })) },
    { key: 'price', label: 'Price range', options: priceOptions },
    { key: 'skillLevel', label: 'Skill level', options: unique(products, 'skillLevel').map((value) => ({ value, label: value })) },
    { key: 'rating', label: 'Minimum rating', options: ratingOptions },
  ];

  return (
    <aside className="ff-filters" aria-label="Product filters">
      <div className="ff-filter-heading">
        <p className="ff-eyebrow">Narrow the fairway</p>
        <div className="ff-filter-title-row"><h2>Filters</h2>{activeCount > 0 && <span className="ff-filter-count">{activeCount} active</span>}</div>
      </div>
      <p className="ff-filter-help">Select one or more options. Results update as you go.</p>

      <div className="ff-filter-group">
        <label htmlFor="filter-search">Search</label>
        <input id="filter-search" type="search" placeholder="Name, brand, or feature" value={filters.search} onChange={(event) => update('search', event.target.value)} />
      </div>

      {filterGroups.map((group) => (
        <fieldset className="ff-filter-group ff-filter-fieldset" key={group.key}>
          <legend>{group.label}</legend>
          <div className="ff-filter-options">{group.options.map((option) => (
            <label className="ff-filter-option" key={option.value}>
              <input type="checkbox" checked={filters[group.key].includes(option.value)} onChange={() => toggleOption(group.key, option.value)} />
              <span>{option.label}</span>
            </label>
          ))}</div>
        </fieldset>
      ))}

      <div className="ff-filter-toggles">
        <label className="ff-check"><input type="checkbox" checked={filters.onSale} onChange={(event) => update('onSale', event.target.checked)} /> On sale only</label>
        <label className="ff-check"><input type="checkbox" checked={filters.inStock} onChange={(event) => update('inStock', event.target.checked)} /> In stock only</label>
      </div>
      <button type="button" className="ff-button ff-button-outline ff-button-full" onClick={clearFilters} disabled={activeCount === 0}>Clear filters</button>
    </aside>
  );
}

export default ProductFilters;
