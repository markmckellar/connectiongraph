import { EngineConnector } from "../engineconnector";
import { EngineConnectorDef } from "../engineconnectordef";
import { ConnectorPositioner } from "./connectorpositioner";
import { WorldPosition } from "../../../world/worldposition";
import { WorldEngineBase } from "../../worldenginebase";


export class PositionerLockX implements ConnectorPositioner {



    constructor() {
    }

    public positionConnectorShape(worldEngine:WorldEngineBase,engineConnector:EngineConnector,engineConnectorDef:EngineConnectorDef):void {
        if(engineConnectorDef.engineShape.isSelected())
        {
            engineConnector.translate(
                new WorldPosition(
                    engineConnectorDef.engineShape.getWorldPosition().x,
                    engineConnector.getWorldPosition().y)
                );
        }
        else
        {
            engineConnectorDef.engineShape.translate(
                new WorldPosition(
                    engineConnector.getWorldPosition().x,
                    engineConnectorDef.engineShape.getWorldPosition().y)
                );
        }

    }

}