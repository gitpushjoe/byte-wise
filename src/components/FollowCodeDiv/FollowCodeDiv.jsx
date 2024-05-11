import React from "react";

// This component displays tabs for "Explanation" and "Variables" content.
export class FollowCodeDiv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "Explanation"
        };
    }

    setActiveTab(tab) {
        this.setState({ activeTab: tab });
    }

    render() {
        const { activeTab } = this.state;
        const tabStyle = {
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            borderRadius: '5px',
            marginRight: '5px',
            flex: 1,
        };

        const activeTabStyle = {
            ...tabStyle,
            backgroundColor: '#357a38'
        };

        const containerStyle = {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '300px',
            borderRadius: '5px',
            overflow: 'hidden',
            padding: '20px',
            margin: '20px',
        };

        const tabsContainerStyle = {
            display: 'flex',
            marginBottom: '20px',
        };

        const contentStyle = {
            flexGrow: 1,
            backgroundColor: '#8FBC8F',
            padding: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2F4F4F',
            fontSize: '16px',
        };

        return (
            <div style={containerStyle}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Follow The Code</h1>
                <div style={tabsContainerStyle}>
                    <button
                        style={activeTab === "Explanation" ? activeTabStyle : tabStyle}
                        onClick={() => this.setActiveTab("Explanation")}
                    >
                        Explanation
                    </button>
                    <button
                        style={activeTab === "Variables" ? activeTabStyle : tabStyle}
                        onClick={() => this.setActiveTab("Variables")}
                    >
                        Variables
                    </button>
                </div>
                <div style={contentStyle}>
                    {activeTab === "Explanation" && <div>Explanation Content</div>}
                    {activeTab === "Variables" && <div>Variables Content</div>}
                </div>
            </div>
        );
    }
}
