import { WorldEngine } from "../../engine/worldengine";
import { World } from "../world";
import { CanvasHolderHTML } from "../../display/canvas/canvasholderhtml";
import { MatterEngine } from "../../engine/matterengine/matterengine";
import { MockEngine } from "../../engine/mockengine/mockengine";
import { SpringEngine } from "../../engine/springengine/springengine";
import { BaseTest } from "./basetest";
import { Test1 } from "./test1";
import { Test2 } from "./test2";
import { WorldOfWorldObjects } from "../worldofworldobjects";

export class TestAll {
    worldEngine:WorldEngine;
    world:World;
    canvasHolder:CanvasHolderHTML;
    test:BaseTest;
    
    constructor() {
    }

    public runTest(engineName:string,testName:string,canvasName:string):void {

        console.log("runTest:engineName="+engineName+":testName="+testName+":canvasName="+canvasName);

        if(this.test) this.test.stopCurrent();

        this.worldEngine = this.getEngineFromName(engineName);
        this.world = new WorldOfWorldObjects(this.worldEngine);
        this.canvasHolder = new CanvasHolderHTML(canvasName,this.world);
        this.test = this.getTestFromName(testName,this.worldEngine,this.world,this.canvasHolder);


        this.test.runTests();
    }

    public getEngineFromName(engineName:string):WorldEngine {
        if(engineName=='matter') return(new MatterEngine());
        else if(engineName=='mock') return(new MockEngine());
        else if(engineName=='spring') return(new SpringEngine());
    }

    public getTestFromName(testName:string,worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML):BaseTest {
        if(testName=='test1') return(new Test1(worldEngine,world,canvasHolder));
        else if(testName=='test2') return(new Test2(worldEngine,world,canvasHolder));
    }
}


window['testAll'] = new TestAll();
