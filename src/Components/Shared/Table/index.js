import styles from './table.module.css';
import Button from 'Components/Shared/Button';
import get from 'lodash.get';

function Table(props) {
  return (
    <table className={styles.tableData}>
      <thead className={styles.tableHeader}>
        <tr className={styles.trStyles}>
          {props.columns.map((column) => {
            return (
              <th key={column.name} className={styles.thStyles}>
                {column.name}
              </th>
            );
          })}
          {props.actions.length ? <th className={styles.thStyles}>Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {props.data.length === 0 ? (
          <tr>
            <td>
              <p>There is no data to show. Please create new entities.</p>
            </td>
          </tr>
        ) : (
          props.data.map((item) => {
            return (
              <tr
                key={item._id}
                onClick={() => {
                  if (!props.disableEdit) {
                    props.onRowClick(item);
                  }
                }}
                className={styles.trStyles}
              >
                {props.columns.map((column, index) => {
                  return (
                    <td key={`${item[column.value]}-${index}`} className={styles.tdStyles}>
                      {get(item, column.value, '').toString()}
                    </td>
                  );
                })}
                <td className={styles.tdActions}>
                  {props.actions.map((action) => {
                    return (
                      <Button
                        key={action.text}
                        label={action.text}
                        style={styles.actionButton}
                        onClick={(e) => action.callback(e, item)}
                        disabled={action.disableButton}
                      />
                    );
                  })}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export default Table;
