import React from 'react';
import styles from './checkbox.module.css';

const Checkbox = ({ label, selected, onChange, id, style }) => {
  return (
    <div className={styles.container}>
      <input
        className={`${styles.checkbox} ${style}`}
        id={id}
        type="checkbox"
        value={selected}
        defaultChecked={selected}
        onChange={onChange}
      />
      <label className={styles.label}>{label}</label>
    </div>
  );
};

export default Checkbox;
