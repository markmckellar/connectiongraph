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
import { Test3 } from "./test3";
import { MouseCrossCircleDisplayShape } from "../../display/drawableshapes/mousecrosscircledisplayshape";
import { WorldEngineParams } from "../../engine/worldengineparams";
import { PedTest } from "./pedtest";
import { Test4 } from "./test4";
import { ContainerTest } from "./containertest";
import { PedTest2 } from "./pedtest2";

export class TestAll {
    public worldEngine:WorldEngine;
    public world:World;
    public canvasHolder:CanvasHolderHTML;
    public test:BaseTest;
    public registeredTests = 
    [
        {
            'name':'ped2',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new PedTest2(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'ped',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new PedTest(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'test1',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new Test1(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'test2',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new Test2(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'test3',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new Test3(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'test4',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new Test4(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'container',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new ContainerTest(worldEngine,world,canvasHolder));
            }
        }
    ];

    
    constructor() {
    }

    public runTest(engineName:string,testName:string,canvasName:string,updateFunction: (world: World) => void,engineRefreshInterval:number):void {

        console.log("runTest:engineName="+engineName+":testName="+testName+":canvasName="+canvasName);

        if(this.test) this.test.stopCurrent();

        this.worldEngine = this.getEngineFromName(engineName,updateFunction,engineRefreshInterval);
        this.world = new WorldOfWorldObjects(this.worldEngine);
        this.canvasHolder = new CanvasHolderHTML(canvasName,this.world);
        this.test = this.getTestFromName(testName,this.worldEngine,this.world,this.canvasHolder);


        this.test.runTests();
    }

    public getEngineFromName(engineName:string,updateFunction: (world: World) => void,engineRefreshInterval:number):WorldEngine {
        let worldEngineParams:WorldEngineParams =
        {
            mouseDrawableShape:new MouseCrossCircleDisplayShape(),
            updateFunction: updateFunction,
            updateInterval: engineRefreshInterval
            //updateInterval: 5000
        };
        if(engineName=='matter') return(new MatterEngine(worldEngineParams));
        else if(engineName=='mock') return(new MockEngine(worldEngineParams));
        else if(engineName=='spring') return(new SpringEngine(worldEngineParams));
        throw new Error("getEngineFromName could not find a engine for :"+engineName);
    }

    public getTestFromName(testName:string,worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML):BaseTest {
        for(let i=0;i<this.registeredTests.length;i++)
        {
            console.log("getTestFromName:"+this.registeredTests[i].name);

            if(this.registeredTests[i].name==testName) return(this.registeredTests[i].buildFunction(worldEngine,world,canvasHolder));
        }
        throw new Error("getTestFromName could not find a test for :"+testName);
    }
    
}


window['testAll'] = new TestAll();
