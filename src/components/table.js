import '../Table.css';
import TableRow from './tablerow';

function Table({ grants }) {
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
          <th>Year Awarded</th>
          <th>Original Amount</th>
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
