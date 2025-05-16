import React from "react";

const PropertyInput = (props) => (
    <div>
        {props.label}:
        <input
            type="number"
            value={props.value.toFixed(2)}
            onChange={(e) => props.onChange(parseFloat(e.target.value))}
        />
        {props.unit}
    </div>
);

export default PropertyInput;