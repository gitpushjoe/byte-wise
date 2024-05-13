import { useNavigate } from "react-router-dom";

import styles from "./ProjectCard.module.css";

export const ProjectCard = ({
  project: { title, imageSrc, path },
}) => {

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <img
        src={imageSrc}
        alt={`Image of ${title}`}
        className={styles.image}
      />
      <h3 className={styles.title}>{title}</h3>
  
      <div className={styles.links}>
        {/* Changed from an <a> tag to a <button> element */}
        <button 
          onClick={ () => { navigate(path) } }
          className={styles.link}>
          Visualize
        </button>
      </div>
    </div>
  );
};
