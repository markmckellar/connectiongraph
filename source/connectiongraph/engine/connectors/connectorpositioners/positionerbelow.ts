import { EngineConnector } from "../engineconnector";
import { EngineConnectorDef } from "../engineconnectordef";
import { ConnectorPositioner } from "./connectorpositioner";
import { WorldPosition } from "../../../world/worldposition";
import { WorldEngineBase } from "../../worldenginebase";
import { BoundingBox } from "../../shapes/boundingbox";

/**
 * Keeps the connector's shape (the child) hanging directly below the def's
 * shape (the parent), `gap` pixels between their edges.
 *
 * Unlike PositionerLockX (which hard-snaps the parent's x every tick), this
 * eases both ends toward agreement, so the pull can be shared with other rules
 * (row layout, collisions) instead of fighting them. Whoever is being dragged
 * stays put and the other end does all the moving.
 */
export class PositionerBelow implements ConnectorPositioner {
    constructor(public gap:number = 40, public strength:number = 0.25) {
    }

    public positionConnectorShape(worldEngine:WorldEngineBase,engineConnector:EngineConnector,engineConnectorDef:EngineConnectorDef):void {
        const parent = engineConnectorDef.engineShape;
        const child = engineConnector;

        const parentBox = new BoundingBox(parent.getShapePoints());
        const childBox = new BoundingBox(child.getShapePoints());
        const parentPos = parent.getWorldPosition();
        const childPos = child.getWorldPosition();

        const dx = parentPos.x - childPos.x;
        const dy = (parentPos.y + parentBox.height/2 + this.gap + childBox.height/2) - childPos.y;
        if(Math.abs(dx)<0.5 && Math.abs(dy)<0.5) return;

        const parentSelected = parent.isSelected();
        const childSelected = engineConnector.getConnectorWorldObject().isSelected();
        if(parentSelected && childSelected) return;

        const childShare = childSelected ? 0 : (parentSelected ? 1 : 0.5);
        const parentShare = 1 - childShare;

        if(childShare>0)
            child.translate(new WorldPosition(
                childPos.x + dx*childShare*this.strength,
                childPos.y + dy*childShare*this.strength));
        if(parentShare>0)
            parent.translate(new WorldPosition(
                parentPos.x - dx*parentShare*this.strength,
                parentPos.y - dy*parentShare*this.strength));
    }
}
