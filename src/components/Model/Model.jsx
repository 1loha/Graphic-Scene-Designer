import {useGLTF} from "@react-three/drei";
import React from "react";
import s from './Model.module.css';


const Model = (props) => {
    // относительный путь от /public
    const { scene } = useGLTF(props.path);
    return <primitive object={scene}
                      scale={props.scale}
                      position={props.position}
    />;
}
export default Model;