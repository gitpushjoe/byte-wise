import React, { useState } from 'react'; // Import useState here
import styles from "./Navbar.module.css";
// Assuming getImageUrl is used elsewhere or will be used, keep the import
import { getImageUrl } from "../../utils";
import { useNavigate } from 'react-router';

export const Navbar = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <button className={styles.title} onClick={() => navigate("/")} style={{ cursor: "pointer", background: "none", border: "none" }}>
        <strong>byte-wise</strong>
        { props.path ? ` / ${props.path}` : "" }
      </button>
    </nav>
  );
};

