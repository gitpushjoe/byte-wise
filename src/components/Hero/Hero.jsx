import React from "react";

import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <p className={styles.description}>
          Welcome to byte-wise a place where you can explore interactive visualizations to understand 
          and master the logic behind your favorite algorithms!
        </p>

      </div>
      <img
        src={getImageUrl("hero/logo.png")}
        alt="Logo Image"
        className={styles.heroImg}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
