/**
 * @module components/shared/Button/Button
 */
import React from 'react';
import styles from './Button.module.css';
import classNames from 'classnames'; // optional but helpful
import { ReactNode } from 'react';

/**
 * @typedef {Object} ButtonProps
 * @property {'red'|'green'|'white'|'blue'} [color='blue'] - Button color variant
 * @property {string} label - Button text label
 * @property {*} [icon=null] - Optional icon
 * @property {function} onClick - Click handler function
 * @property {'button'|'submit'|'reset'} [type='button'] - Button type attribute
 */

/**
 * Button component for reusable UI actions.
 *
 * @function Button
 * @memberof module:components/shared/Button/Button
 * @param {ButtonProps} props - Button props
 * @returns {JSX.Element} The rendered button component
 */
export function Button({
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

/**
 * Why use @typedef and @property?
 *
 * JSDoc only displays individual props in the sidebar and method/property tables if you define a named object type (using @typedef and @property) and reference it in your component's @param tag. This approach improves documentation clarity for consumers of your component, making each prop visible and clearly described in the generated docs.
 */
