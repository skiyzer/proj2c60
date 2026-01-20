import '../Table.css';
import TableRow from './tablerow';

function Table({ grants, onSort, sortConfig = { key: '', direction: 'asc' } }) {
  const handleSort = (key) => {
    if (onSort) {
      onSort(key);
    }
  };

  const getSortLabel = (key) => {
    if (sortConfig.key !== key) {
      return '';
    }

    return sortConfig.direction === 'asc' ? 'ASC' : 'DESC';
  };

  return (
    <table className="grant-table">
      <thead>
        <tr>
          <th>Project Title</th>
          <th>Institution</th>
          <th>City</th>
          <th>State</th>
          <th>Program</th>
          <th>Division</th>
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
          <th>
            <button
              type="button"
              className={`sort-button ${sortConfig.key === 'OriginalAmount' ? 'is-active' : ''}`}
              onClick={() => handleSort('OriginalAmount')}
            >
              Original Amount
              {getSortLabel('OriginalAmount') && (
                <span className="sort-indicator">{getSortLabel('OriginalAmount')}</span>
              )}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {grants.map((grant) => (
          <TableRow
            key={grant['@AppNumber'] || `${grant.Institution}-${grant.ProjectTitle}`}
            grant={grant}
          />
        ))}
      </tbody>
    </table>
  );
}


export default Table;
