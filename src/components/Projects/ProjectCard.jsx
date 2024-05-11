

import React from "react";

import styles from "./ProjectCard.module.css";
import { getImageUrl } from "../../utils";

export const ProjectCard = ({
  project: { title, imageSrc, visualize },
}) => {
  // Handler function to navigate to the visualize URL
  const handleVisualizeClick = () => {
    window.location.href = visualize;
  };

  return (
    <div className={styles.container}>
      <img
        src={getImageUrl(imageSrc)}
        alt={`Image of ${title}`}
        className={styles.image}
      />
      <h3 className={styles.title}>{title}</h3>
  
      <div className={styles.links}>
        {/* Changed from an <a> tag to a <button> element */}
        <button onClick={handleVisualizeClick} className={styles.link}>
          Visualize
        </button>
      </div>
    </div>
  );
};
