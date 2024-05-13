import { useState, useEffect, useRef } from "react";
import styles from "./FollowCodeDiv.module.css";
import Scope from "./Zap/Zap";

export function FollowCodeDiv(props) {

    const [currentZap, setCurrentZap] = useState(0);

    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [props.zap]);

    return (
        <div className={styles['main-container']}>
            <h1>Details</h1>
            <div className={styles['content-container']}>
                <div className={styles['button-container']}>
                    { ['Explanation', 'Variables'].map((text, index) => (
                        <div
                            key={index}
                            className={currentZap === index ? styles['button-active'] : styles['button-inactive']}
                            onClick={() => setCurrentZap(index)}
                        >
                            {text}
                        </div>))
                    }
                </div>
                <div className={styles['lower-container'] + ' ' + (currentZap === 1 ? styles['explanation-container'] : styles['variables-container'])} >
                    <div className={styles['inner-container']} ref={ref}>
                        {
                            currentZap === 0 ? 
                                props.explanation :
                                props.zap ? 
                                    <Scope data={props.zap.snapshotData} /> :
                                    <em>Waiting for code execution...</em>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
