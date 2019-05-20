import { DrawShapeWithBorderParams } from "../../connectiongraph/display/drawshapewithborderparams";

export interface PedigreeGraphParams {
    personSize:number;
    personDrawShapeParams:DrawShapeWithBorderParams;
    spouseDrawShapeParams:DrawShapeWithBorderParams;
    personChildDrawShapeParams:DrawShapeWithBorderParams;

}