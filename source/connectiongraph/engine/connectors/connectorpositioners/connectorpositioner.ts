
import { EngineConnectorDef } from "../engineconnectordef";
import { EngineConnector } from "../engineconnector";
import { WorldEngineBase } from "../../worldenginebase";

export  interface ConnectorPositioner 
{
   positionConnectorShape(worldEngine:WorldEngineBase,engineConnector:EngineConnector,engineConnectorDef:EngineConnectorDef):void;
}
