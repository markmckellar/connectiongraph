import { CanvasHolderHTML } from "../../display/canvas/canvasholderhtml";
import { WorldEngine } from "../../engine/worldengine";
import { World } from "../world";
import { WorldPosition } from "../worldposition";
import { BaseTest } from "./basetest";
import { PedigreeBuilder } from "./pedbuilder";

/**
 * Nested containment only, no connectors: two generation boxes, each holding
 * a row of families, plus one loose family.
 */
export class PedTest extends BaseTest {

    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML)  {
      super(worldEngine,world,canvasHolder);
    }

    public buildTest() {
      const b = new PedigreeBuilder(this.world);
      const w = this.canvasHolder.getWidth();

      const gen1 = b.familyRow("gen1.family",3,6,new WorldPosition(w/2,120));
      const gen2 = b.familyRow("gen2.family",3,2,new WorldPosition(w/2,280));
      b.family("loose.family",2,new WorldPosition(w/2,440));

      b.generation("gen1",gen1);
      b.generation("gen2",gen2);
      b.commit();
    }
}
