import { DrawShapeWithBorderParams } from "./drawshapewithborderparams";

/** Colours for the graph demos (rrggbbaa, as WorldDisplay.getColorFromString expects). */
export const GraphTheme = {
    node:      { fillStyle: "dbeafeff", strokeStyle: "2563ebff", lineWidth: 2 } as DrawShapeWithBorderParams,
    hub:       { fillStyle: "fde68aff", strokeStyle: "b45309ff", lineWidth: 2 } as DrawShapeWithBorderParams,
    box:       { fillStyle: "f8fafcff", strokeStyle: "475569ff", lineWidth: 1.5 } as DrawShapeWithBorderParams,
    container: { fillStyle: "e2e8f080", strokeStyle: "64748bff", lineWidth: 1.5 } as DrawShapeWithBorderParams,
    line: "64748bff",
    text: "1f2937ff",
    cursor: "ef4444ff",
};
