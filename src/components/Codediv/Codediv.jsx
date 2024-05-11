import React from "react";

export class Codediv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "C++"  // Default active tab
        };
    }

    setActiveTab(tab) {
        this.setState({ activeTab: tab });
    }

    render() {
        const { activeTab } = this.state;
        const tabStyle = {
            backgroundColor: '#4CAF50',  // Green background
            color: 'white',
            padding: '10px 20px',  // Reduced button padding
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            borderRadius: '5px',
            marginRight: '5px',  // Space between buttons
            flex: 1,  // Flexible width for each tab
        };

        const activeTabStyle = {
            ...tabStyle,
            backgroundColor: '#357a38'  // Darker green for active tab
        };

        const containerStyle = {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '300px',  // Minimum height for the overall container
            borderRadius: '5px',
            overflow: 'hidden',  // Ensures no content spills out
            padding: '20px',  // Added padding for spacing
            margin: '20px',  // Added margin for spacing
        };

        const tabsContainerStyle = {
            display: 'flex',  // Flex display for equal spacing
            marginBottom: '20px',  // Added margin between buttons and code
        };

        const contentStyle = {
            flexGrow: 1,  // Takes remaining space in the container
            backgroundColor: '#8FBC8F',  // Light green background for content area
            padding: '20px',
            display: 'flex',
            alignItems: 'center',  // Centers the content vertically
            justifyContent: 'center',  // Centers the content horizontally
            color: '#2F4F4F',  // Dark slate gray color for text
            fontSize: '16px',  // Text size
            fontFamily: 'Courier New, monospace',  // Use monospaced font
            whiteSpace: 'pre-wrap',  // Preserve formatting, including line breaks
        };

        // Dummy code content for each language
        const codeContent = {
            'C++': `C++ Code:\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}`,
            'Python': `Python Code:\nprint("Hello, World!")`,
            'Java': `Java Code:\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`
        };

        return (
            <div style={containerStyle}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>The Code</h1>
                <div style={tabsContainerStyle}>
                    <button
                        style={activeTab === "C++" ? activeTabStyle : tabStyle}
                        onClick={() => this.setActiveTab("C++")}
                    >
                        C++
                    </button>
                    <button
                        style={activeTab === "Python" ? activeTabStyle : tabStyle}
                        onClick={() => this.setActiveTab("Python")}
                    >
                        Python
                    </button>
                    <button
                        style={activeTab === "Java" ? activeTabStyle : tabStyle}
                        onClick={() => this.setActiveTab("Java")}
                    >
                        Java
                    </button>
                </div>
                <div style={contentStyle}>
                    <code>{codeContent[activeTab]}</code>
                </div>
            </div>
        );
    }
}
