import React, { useState } from 'react'; // Import useState here
import styles from "./Navbar.module.css";
// Assuming getImageUrl is used elsewhere or will be used, keep the import
import { getImageUrl } from "../../utils";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <a className={styles.title} href="/">
        byte-wise
      </a>
    </nav>
  );
};

