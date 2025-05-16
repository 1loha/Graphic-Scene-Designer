import React, {useMemo} from 'react';

// Компонент списка моделей
const ModelList = (props) => {
    // Мемоизация списка моделей
    const modelEntries = useMemo(() => Object.entries(props.models), [props.models]);
    // Рендеринг списка моделей
    return (
        <ul>
            {modelEntries.map(([key, model]) => (
                <li key={key}>
                    <button onClick={() => props.onSelectModelType(props.category, key)}>
                        {model.label || key}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ModelList;