

import React, { Component } from "react";
import { Footer } from "../../components/Footer/Footer";
import { Hero } from "../../components/Hero/Hero";
import { Navbar } from "../../components/Navbar/Navbar";
import { Projects } from "../../components/Projects/Projects";


import { Codediv } from "../../components/Codediv/Codediv";
import { FollowCodeDiv } from "../../components/FollowCodeDiv/FollowCodeDiv";
import { CodeVisualizationDiv } from "../../components/CodeVisualizationDiv/CodeVisualizationDiv";

// import "./Home.css";

export function InsertionSort() {
    return (
        <>
            <Navbar />
            <Codediv />
            <FollowCodeDiv />
            <CodeVisualizationDiv />

            <Footer />
        </>
    );
}