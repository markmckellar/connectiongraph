import { EngineConnector } from "../engineconnector";
import { EngineConnectorDef } from "../engineconnectordef";
import { ConnectorPositioner } from "./connectorpositioner";
import { WorldEngineBase } from "../../worldenginebase";


export class PositionerFree implements ConnectorPositioner {



    constructor() {
    }

    public positionConnectorShape(worldEngine:WorldEngineBase,engineConnector:EngineConnector,engineConnectorDef:EngineConnectorDef):void {
    }

}