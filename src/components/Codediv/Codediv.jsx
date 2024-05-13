import { useState } from "react";
import { splitTextBySections } from "../zeno/utils";
import styles from "./Codediv.module.css";

export function Codediv(props) {

    const sourceCode = props.sourceCode ?? [
        {
            language: "C++",
            code: `
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`
        },
        {
            language: "Python",
            code: `
print("Hello, World!")
            `
        },
        {
            language: "Java",
            code: `
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`
        },
        {
            language: "JavaScript",
            code: `
console.log("Hello, World!");`
        }
    ];

    const inputFormatter = props.inputFormatter ?? ((input) => input);

    const [currentSnippet, setCurrentSnippet] = useState(0);

    const data = sourceCode[currentSnippet];

    const code = data.code.trim().replace(/%input%/g, inputFormatter(props.input, data.language) ?? '');

    const sections = splitTextBySections( 
        sourceCode[currentSnippet].language.toLowerCase() === 'python' ? 
            code.replace(/#[^\r\n]*/g, match => `//${match.substring(1)}`) :
            code
    );

    const [expanded, setExpanded] = useState(true);

    return (
        <div className={styles['main-container']}>
            <h1>Source Code</h1>
            <div className={styles['content-container']}>
                <div className={styles['button-container']}>
                    { sourceCode.map((snippet, index) => (
                        <div
                            key={index}
                            className={currentSnippet === index ? styles['button-active'] : styles['button-inactive']}
                            onClick={() => setCurrentSnippet(index)}
                        >
                            {snippet.language}
                        </div>
                    )) }
                </div>
                <div className={styles['code-container']} style={ !expanded ? { height: '1em', minHeight: '0' } : {} }>
                    { expanded ?
                    <div className={styles['code-inner-container']}> 
                        <pre style={{ display: "block", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                            { Object.entries(sections).map((section, index) => (
                                <code key={index} style = { 
                                    props.currentSection !== -1 && section[1].section === props.currentSection ? { 
                                        backgroundColor: 'yellow',
                                        fontWeight: 'bold',
                                    } : {} 
                                }>
                                    {section[1].text}
                                </code>
                            )) }
                        </pre>
                    </div> : null }
                </div>
            </div>
            <div className={styles['expand-button']} onClick={() => setExpanded(!expanded)}>
                { expanded ? 'Minimize' : 'Expand' }
            </div>
        </div>
    );
}
