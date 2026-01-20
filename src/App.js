import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Table from './components/table';

function App() {
  const [allGrants, setAllGrants] = useState([]);
  const [visibleGrants, setVisibleGrants] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    async function fetchGrant() {
      const url = '/NEH2020sGrant_Short.json';
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        setAllGrants(result.Grants.Grant);
        setVisibleGrants(result.Grants.Grant);
        setActiveFilter('ALL');
      }
    }

    fetchGrant();
  }, []);

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

  const applyFilter = (filterFn, filterKey) => {
    const filtered = allGrants.filter(filterFn);
    const sorted = sortConfig.key
      ? sortGrants(filtered, sortConfig.key, sortConfig.direction)
      : filtered;

    setVisibleGrants(sorted);
    setActiveFilter(filterKey);
  };

  const resetFilters = () => {
    const sorted = sortConfig.key
      ? sortGrants(allGrants, sortConfig.key, sortConfig.direction)
      : allGrants;

    setVisibleGrants(sorted);
    setActiveFilter('ALL');
  };

  const filterByState = (state) => {
    applyFilter((grant) => grant.InstState === state, `STATE:${state}`);
  };

  const filterByProgram = (program) => {
    applyFilter((grant) => grant.Program === program, `PROGRAM:${program}`);
  };

  const filterByProgramIncludes = (label, match) => {
    applyFilter((grant) => grant.Program?.includes(match), label);
  };

  const filterByOrgType = (orgType) => {
    applyFilter((grant) => grant.OrganizationType === orgType, `ORG:${orgType}`);
  };

  const filterByYear = (minYear) => {
    applyFilter(
      (grant) => Number(grant.YearAwarded) >= minYear,
      `YEAR:${minYear}+`
    );
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

  return (
    <div className="App">
      <header className="App-header">
        <div className="grant-controls">
          <p className="grant-count">
            Showing {visibleGrants.length} of {allGrants.length} grants
          </p>
          <div className="control-group">
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
            <button
              type="button"
              className={`control-button ${activeFilter === 'STATE:CA' ? 'is-active' : ''}`}
              onClick={() => filterByState('CA')}
            >
              CA Awards
            </button>
            <button
              type="button"
              className={`control-button ${activeFilter === 'STATE:NY' ? 'is-active' : ''}`}
              onClick={() => filterByState('NY')}
            >
              NY Awards
            </button>
          </div>
          <div className="control-group">
            <button
              type="button"
              className={`control-button ${activeFilter === 'PROGRAM:Fellowships' ? 'is-active' : ''}`}
              onClick={() => filterByProgram('Fellowships')}
            >
              Fellowships
            </button>
            <button
              type="button"
              className={`control-button ${activeFilter === 'PROGRAM:Challenge' ? 'is-active' : ''}`}
              onClick={() => filterByProgramIncludes('PROGRAM:Challenge', 'Challenge Grants')}
            >
              Challenge Grants
            </button>
            
            <button
              type="button"
              className={`control-button ${activeFilter === 'ORG:University' ? 'is-active' : ''}`}
              onClick={() => filterByOrgType('University')}
            >
              Universities
            </button>
          </div>
          <p className="grant-hint">
            Click "Year Awarded" or "Original Amount" to sort the table.
          </p>
        </div>
        <Table grants={visibleGrants} onSort={handleSort} sortConfig={sortConfig} />
      </header>
    </div>
  );
}


export default App;
