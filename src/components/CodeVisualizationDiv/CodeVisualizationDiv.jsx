import React from "react";
import { Achilles } from '../achilles/achilles';
import InsertionSort from '../achilles/implementations/insertion_sort';
import styles from "./CodeVisualizationDiv.module.css";

export function CodeVisualizationDiv(props) {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '300px',
        borderRadius: '5px',
        position: 'sticky',
        top: '0px',
        margin: '20px',
    };

    const visualizationStyle = {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: '20px',
        color: '#2F4F4F',
        fontSize: '16px',
        textAlign: 'center',
    };

    const onSectionUpdate = props.onSectionUpdate ?? ((section) => { console.log({ currentSection: section }) });

    const defaultHelpText = 
`Use the up and down arrows next to each element to change its value.
Click the plus button on the right of the array to add a new element.
Drag an element over another one to swap their positions.
Click and hold on an element to reveal a trash can icon to delete it.

Drag the rabbit slider to control the speed of the visualization.
Drag the magnifying glass slider to zoom in and out, or use the mouse wheel.
Press the red/green arrow to show/hide the sliders.
`;

    return (
        <div style={containerStyle}>
            <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Visualization</h1>
            <div style={visualizationStyle}>
                <Achilles 
                    stageClass={props.achillesStage} 
                    onSectionUpdate={onSectionUpdate} 
                    onInputUpdate={props.onInputUpdate} 
                    onZapUpdate={props.onZapUpdate}
                />
                </div>
            <div className={styles['help-container']}>
                <h3>Instructions:</h3>
                {'\n'}
                {
                    props.helpText || defaultHelpText
                }
            </div>
        </div>
    );
}
