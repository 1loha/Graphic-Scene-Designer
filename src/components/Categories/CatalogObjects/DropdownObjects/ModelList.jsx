import React from 'react';

const ModelList = (props) => {
    return (
        <ul>
            {Object.entries(props.models).map(([key]) => (
                <li key={key}>
                    <button onClick={() => props.onSelectModelType(props.category, key)}>
                        {key}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ModelList;