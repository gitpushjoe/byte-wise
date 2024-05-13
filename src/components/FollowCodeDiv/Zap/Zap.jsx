import styles from './Zap.module.css';

export default function Scope(props) {

    const index = props.index ?? 0;
    const data = props.data[index];
    const scopeType = data?.get('[[SCOPE_TYPE]]');
    console.log(scopeType);
    const color = 
        scopeType === 'MAIN' ? 'orange' :
            scopeType === 'FUNCTION' ? 'lightgreen' :
                scopeType === 'BLOCK' ? 'gold' :
                    'white';

    return <>
        {
            data ? <>
                <div 
                    className={styles.header} 
                    style={ { backgroundColor: color } }
                >
                    { data.get('[[SCOPE_NAME]]').replace(/,\s*IGNORE.*\)/,')') }
                </div>
                <div className={styles.container} >
                    <div 
                        className={styles.bar} 
                        style={ { backgroundColor: color } }
                    >
                    </div>
                    <div className={styles['inner-container']} >
                        <div className={styles['variables-container']} >
                            { [...data.entries()].map(([key, value]) => {
                                const isReference = key.startsWith('^');
                                key = isReference ? key.slice(1) : key;
                                if (key.startsWith('[') || key.startsWith('IGNORE')) {
                                    return;
                                }
                                return <span key={key} className={styles['inner-variables-container']} >
                                    {
                                        key.startsWith('%') ? 
                                            <span className={styles['variable-text']} style={{fontWeight: 'bold', color: 'darkorchid'}} >
                                                {key.slice(1).toLowerCase() + ": "}
                                            </span> :
                                            <span className={styles['variable-text']} style={{fontWeight: 'bold'}}>
                                                {key + ": "}
                                            </span>
                                    }
                                    { value?.reference !== undefined ?
                                        <span className={styles['variable-text']} style={{fontStyle: 'italic'}}>
                                            reference{'\n'} 
                                        </span> :
                                        <span className={styles['variable-text']}>
                                            {JSON.stringify(value) + '\n'}
                                        </span>
                                    }
                                </span>;
                            }) || < div />
                            }
                        </div>
                        <div>
                            <Scope data={props.data} index={index + 1} />
                        </div>
                    </div>
                </div> </>
                :
                <div />
        }
    </>;
}
