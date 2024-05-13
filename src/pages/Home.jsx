
// import React from "react";
// import { Footer } from "../components/Footer/Footer";
// import { Hero } from "../components/Hero/Hero"; // Import the Hero component
// import { Navbar } from "../components/Navbar/Navbar";
// import { Projects } from "../components/Projects/Projects";
// import { Codediv } from "../components/Codediv/Codediv";
// import "./Algo1.css"; // This should point to your Home.css file with styles for tabs

// export function Algo1() {
//     return (
//         <>

//             <Codediv />
//         </>
//     );
// }


import React, { Component } from "react";
import { Footer } from "../components/Footer/Footer";
import { Hero } from "../components/Hero/Hero";
import { Navbar } from "../components/Navbar/Navbar";
import { Projects } from "../components/Projects/Projects";

import "./Home.css";

export function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <Projects />

            <Footer />
        </>
    );
}
