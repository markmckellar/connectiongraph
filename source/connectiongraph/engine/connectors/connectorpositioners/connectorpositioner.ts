
import { EngineConnectorDef } from "../engineconnectordef";
import { EngineConnector } from "../engineconnector";

export  interface ConnectorPositioner 
{
   positionConnectorShape(engineConnector:EngineConnector,engineConnectorDef:EngineConnectorDef):void;
}
