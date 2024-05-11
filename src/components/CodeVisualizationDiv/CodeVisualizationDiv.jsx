import React from "react";

// This component displays a title "Visualization" and a large box for visualization.
export class CodeVisualizationDiv extends React.Component {
    render() {
        const containerStyle = {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '300px',
            borderRadius: '5px',
            overflow: 'hidden',
            padding: '20px',
            margin: '20px',
        };

        const visualizationStyle = {
            flexGrow: 1,
            backgroundColor: '#E0E0E0', // Light gray background for visualization area
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2F4F4F',
            fontSize: '16px',
            textAlign: 'center',
        };

        return (
            <div style={containerStyle}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Visualization</h1>
                <div style={visualizationStyle}>
                    {/* Visualization Content Goes Here */}
                     Visualization Box
                </div>
            </div>
        );
    }
}
