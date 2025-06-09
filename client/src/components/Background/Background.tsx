import React from 'react';
import styles from './Background.module.scss';
import RestaurantImage from '../../assets/restaurant.jpg';

export default function Background() {
  return (
    <div className={styles.background_image}>
      <img src={RestaurantImage} alt="Restaurant" />
    </div>
  );
}
