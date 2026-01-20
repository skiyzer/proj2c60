Step 7 - Sorting and Filtering Enhancements

Overview
- Added two data states: allGrants (full dataset) and visibleGrants (filtered/sorted view).
- Added UI controls to filter and sort the grants table without mutating the original data.

Changes by file
- src/App.js
  - Fetch now populates allGrants and visibleGrants.
  - Added filter helpers (state, program, year, org type) and reset.
  - Added sort handler for Year Awarded and Original Amount.
  - Added control panel with buttons and a count of visible vs total.
- src/components/table.js
  - Added sortable header buttons for Year Awarded and Original Amount.
- src/App.css
  - Styled the filter controls, active state, and hint text.
- src/Table.css
  - Added sort button styling and indicator chips.

Interactive elements that alter the table
- All Grants reset
- KY Awards filter
- CA Awards filter
- NY Awards filter
- Fellowships filter
- Challenge Grants filter
- 2020+ Awards filter
- Universities filter
- Sort by Year Awarded (toggle ASC/DESC)
- Sort by Original Amount (toggle ASC/DESC)

Deep dive: click sorting (Year Awarded, Original Amount)
- The header cells for Year Awarded and Original Amount are buttons in src/components/table.js.
- Clicking a header calls onSort with the field key (YearAwarded or OriginalAmount).
- App keeps sortConfig in state so it can toggle direction and remember the active column.
- handleSort in src/App.js flips asc/desc when the same column is clicked again.
- sortGrants copies the current list, compares numeric values when possible, and uses
  localeCompare for text fallback. It then returns asc or desc by reversing when needed.
- visibleGrants is updated in-place after sorting so the UI updates instantly without
  modifying allGrants (the full dataset stays untouched).

Deep dive: table decoration with CSS
- The table gets a grant-table class in src/components/table.js to scope styling.
- src/Table.css handles the table layout (width, max-width, border-collapse, colors),
  and adds a header background to visually separate the thead from the tbody.
- Alternating row colors and hover states improve readability for large datasets.
- Numeric alignment on the last column keeps dollar amounts visually aligned.
- Sort buttons use transparent backgrounds so they look like headers, and a small
  indicator chip shows the current sort direction.

Deep dive: "Showing 3 of 40 grants" counter
- The count is rendered in src/App.js as:
  "Showing {visibleGrants.length} of {allGrants.length} grants".
- visibleGrants.length is the number of rows after filters/sorts.
- allGrants.length is the original unfiltered dataset size.
- This makes it clear how each filter changes the dataset without losing records.

Deep dive: filter buttons (All Grants, KY Awards, etc.)
- Each button calls a specific helper in src/App.js when clicked.
- The helpers never modify allGrants. They always start with allGrants and build
  a new filtered array for visibleGrants.
- applyFilter takes two arguments: a filter function and a label used to track
  which filter is active (activeFilter). This keeps the UI state and the data
  state in sync.
- Example: "KY Awards" calls filterByState('KY'), which runs
  applyFilter(grant => grant.InstState === 'KY', 'STATE:KY').
- Example: "Fellowships" calls filterByProgram('Fellowships') and matches the
  Program field exactly.
- Example: "Challenge Grants" uses filterByProgramIncludes to match any program
  that includes "Challenge Grants" in its title (covers multiple variations).
- Example: "2020+ Awards" uses filterByYear(2020), converting YearAwarded to
  a number so comparisons work consistently.
- "Universities" filters by OrganizationType === 'University'.
- "All Grants" uses resetFilters to restore visibleGrants back to the full data,
  while preserving any active sort order.
- activeFilter is used to add the is-active class to the current button so
  users can see which filter is on.

Quick reference (paths + code)
- Sorting headers (click to sort): src/components/table.js
```jsx
<th>
  <button
    type="button"
    className={`sort-button ${sortConfig.key === 'YearAwarded' ? 'is-active' : ''}`}
    onClick={() => handleSort('YearAwarded')}
  >
    Year Awarded
    {getSortLabel('YearAwarded') && (
      <span className="sort-indicator">{getSortLabel('YearAwarded')}</span>
    )}
  </button>
</th>
```
- Sorting logic (toggle + compare): src/App.js
```js
const sortGrants = (data, key, direction) => {
  const sorted = [...data].sort((first, second) => {
    const firstValue = first[key] ?? '';
    const secondValue = second[key] ?? '';
    const firstNumber = Number(firstValue);
    const secondNumber = Number(secondValue);

    if (!Number.isNaN(firstNumber) && !Number.isNaN(secondNumber)) {
      return firstNumber - secondNumber;
    }

    return String(firstValue).localeCompare(String(secondValue));
  });

  return direction === 'desc' ? sorted.reverse() : sorted;
};

const handleSort = (key) => {
  setSortConfig((prev) => {
    const direction =
      prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
    const nextConfig = { key, direction };

    setVisibleGrants((current) => sortGrants(current, key, direction));
    return nextConfig;
  });
};
```
- Filter helpers: src/App.js
```js
const applyFilter = (filterFn, filterKey) => {
  const filtered = allGrants.filter(filterFn);
  const sorted = sortConfig.key
    ? sortGrants(filtered, sortConfig.key, sortConfig.direction)
    : filtered;

  setVisibleGrants(sorted);
  setActiveFilter(filterKey);
};

const filterByState = (state) => {
  applyFilter((grant) => grant.InstState === state, `STATE:${state}`);
};

const filterByProgram = (program) => {
  applyFilter((grant) => grant.Program === program, `PROGRAM:${program}`);
};
```
- Filter buttons (UI wiring): src/App.js
```jsx
<button
  type="button"
  className={`control-button ${activeFilter === 'ALL' ? 'is-active' : ''}`}
  onClick={resetFilters}
>
  All Grants
</button>
<button
  type="button"
  className={`control-button ${activeFilter === 'STATE:KY' ? 'is-active' : ''}`}
  onClick={() => filterByState('KY')}
>
  KY Awards
</button>
```
- Visible count display: src/App.js
```jsx
<p className="grant-count">
  Showing {visibleGrants.length} of {allGrants.length} grants
</p>
```
- Table decoration styles: src/Table.css
```css
.grant-table {
  width: 95vw;
  max-width: 1100px;
  margin: 1.5rem 0;
  border-collapse: collapse;
  background: #f8fafc;
  color: #1f2933;
}

.grant-table thead th {
  background: #0f172a;
  color: #f8fafc;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
```
- Control panel styling: src/App.css
```css
.grant-controls {
  width: 95vw;
  max-width: 1100px;
  margin: 1.5rem 0 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-button.is-active {
  background: #38bdf8;
  color: #0f172a;
  border-color: #38bdf8;
}
```

Important presentation points
- Two-state data approach prevents losing records when filters change.
- Filters target real research questions (state, program type, year, organization).
- Sorting enables quick comparisons by award year and funding size.
- Visible count shows how each filter narrows or expands the dataset.
- Active filter styling gives immediate feedback on the current view.
