
import { EngineShape } from "../shapes/engineshape";
import { EngineConnectorDef } from "./engineconnectordef";

export  interface EngineConnector extends EngineShape
{
    /*
        What does it mean to be connected?
        * that there is a "force" that may have an effect on the position of both connected objects
        * that how this "force" is defined may possibly be effected by the positions of A and B

         AAAA                          XXXX                          BBBB
        AAAAAA ---------------------- XXXXXX ---------------------- BBBBBB
         AAAA                          XXXX                          BBBB

        If you connect two objects you will have :
         A:WorldObject 
         B:WorldObject
         X:WorldObject
         
        Both A and B will have springs connecting them to X.  The strength of these springs and the
        size/shape of A, B and X will all have an impact on the positions of each

        A spring is defined as having :
        * a length
        * a stiffess
        * two bodies
    */
   
   getEngineConnectorDefArray():Array<EngineConnectorDef>;
}
