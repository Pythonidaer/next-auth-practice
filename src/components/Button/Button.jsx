import styles from './Button.module.css';
import classNames from 'classnames'; // optional but helpful
import { ReactNode } from 'react';

export default function Button({
  color = 'blue', // red | green | white | blue
  label,
  icon = null,
  onClick,
  type = 'button',
}) {
  return (
    <button
      type={type}
      className={classNames(styles.button, styles[color])}
      onClick={onClick}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
