import {useState} from "react";

export const AddModel = () => {
    const [models, setModels] = useState([]);
    const addModel = (type) => {
        setModels(prevModels => [
            ...prevModels, {
                type,
                id: Date.now(),
                position: [0, 0, 0]
            }
        ]);
    };

    return { models, addModel };
};