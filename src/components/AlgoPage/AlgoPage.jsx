import { useState } from "react";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";

import { Codediv } from "../Codediv/Codediv";
import { FollowCodeDiv } from "../FollowCodeDiv/FollowCodeDiv";
import { CodeVisualizationDiv } from "../CodeVisualizationDiv/CodeVisualizationDiv";
import styles from "./AlgoPage.module.css";

export function AlgoPage(props) {

    const [currentSection, setCurrentSection] = useState(0);
    const [currentInput, setCurrentInput] = useState(undefined);
    const [currentZap, setCurrentZap] = useState(undefined);
    const inputFormatter = props.inputFormatter ?? ((input) => {
        return Array.isArray(input) ? input.join(', ') : 0;
    });

    return (
        <>
            <Navbar path={props.path} />
            <div className={styles['main-container']}>
                <div className={styles['left-container']}>
                    <Codediv 
                        sourceCode={props.sourceCode} currentSection={currentSection} 
                        input={currentInput}
                        inputFormatter={inputFormatter}
                    />
                    <FollowCodeDiv 
                        zap={currentZap}
                        explanation={props.explanation}
                    />
                </div>
                <div className={styles['right-container']}>
                    <CodeVisualizationDiv 
                        achillesStage={props.achillesStage}
                        onSectionUpdate={(section) => setCurrentSection(section)}
                        onInputUpdate={(input) => setCurrentInput(input)}
                        onZapUpdate={(zap) => setCurrentZap(zap)}
                    />
                </div>
            </div>

            <Footer />
        </>
    );
}
