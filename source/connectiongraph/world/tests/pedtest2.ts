import { CanvasHolderHTML } from "../../display/canvas/canvasholderhtml";
import { WorldEngine } from "../../engine/worldengine";
import { World } from "../world";
import { WorldPosition } from "../worldposition";
import { BaseTest } from "./basetest";
import { PedigreeBuilder } from "./pedbuilder";

/**
 * Three generations linked by connectors: each top family has a child family
 * in the middle generation, and the middle generation as a whole has one
 * child family below it. Generation rows stop families overlapping while
 * letting them slide under their parents.
 */
export class PedTest2 extends BaseTest {

    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML)  {
      super(worldEngine,world,canvasHolder);
    }

    public buildTest() {
      const b = new PedigreeBuilder(this.world);
      const w = this.canvasHolder.getWidth();

      const top = b.familyRow("top.family",3,6,new WorldPosition(w/2,100));
      const middle = b.familyRow("middle.family",3,2,new WorldPosition(w/2,260));
      const bottom = b.family("bottom.family",2,new WorldPosition(w/2,420));

      b.generation("top",top);
      const middleGeneration = b.generation("middle",middle);

      for(let i=0;i<middle.length;i++) b.connect(middle[i],top[i]);
      b.connect(bottom,middleGeneration);

      b.commit();
    }
}
