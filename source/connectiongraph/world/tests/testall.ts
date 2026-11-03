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
    public worldEngine!:WorldEngine;
    public world!:World;
    public canvasHolder?:CanvasHolderHTML;
    public test?:BaseTest;
    public registeredTests = 
    [
        {
            'name':'ped2',
            title:'Pedigree prototype (3 generations)',
            description:'Early pedigree layout: families in generation rows, hung under their parents.',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new PedTest2(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'ped',
            title:'Pedigree prototype (nested boxes)',
            description:'Early pedigree layout: families nested inside generation boxes.',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new PedTest(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'test1',
            title:'Mixed shapes',
            description:'Circles, a square, a pentagon and text boxes. The yellow hub drags two text boxes along with it: one shares its left-right position, the other its up-down position. The tall label is tied to the big circle.',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new Test1(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'test2',
            title:'Connector types',
            'description':"Three pairs, each joined by a different kind of connector. Top-left: a free spring. Middle: the blue circle keeps the yellow one's left-right position. Bottom-right: it keeps its up-down position. Drag the yellow end of each pair.",
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new Test2(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'test3',
            title:'Single spring',
            description:'The simplest case: two circles held a set distance apart by one connector. Fling one and watch the other follow.',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new Test3(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'test4',
            title:'Hub between two',
            description:'A small yellow hub keeps itself centred between two circles. The middle and big circles can bump into each other; the small one passes through.',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new Test4(worldEngine,world,canvasHolder));
            }
        },
        {
            'name':'container',
            title:'Containers',
            description:'Three boxes, each keeping five squares in a tidy row. Drag a square past its neighbours to reorder the row, or drag the box to move the whole group.',
            'buildFunction': function(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
                return(new ContainerTest(worldEngine,world,canvasHolder));
            }
        }
    ];

    
    constructor() {
    }

    public static readonly engineNames = ['matter','mock','spring'] as const;

    public runTest(engineName:string,testName:string,canvas:string|HTMLCanvasElement,updateFunction: (world: World) => void,engineRefreshInterval:number):void {

        this.stop();

        this.worldEngine = this.getEngineFromName(engineName,updateFunction,engineRefreshInterval);
        this.world = new WorldOfWorldObjects(this.worldEngine);
        this.canvasHolder = new CanvasHolderHTML(canvas,this.world);
        this.test = this.getTestFromName(testName,this.worldEngine,this.world,this.canvasHolder);


        this.test.runTests();
    }

    /** Stop the running engine/draw loop and detach canvas listeners. */
    public stop():void {
        if(this.test) this.test.stopCurrent();
        if(this.canvasHolder) this.canvasHolder.dispose();
        this.test = undefined;
        this.canvasHolder = undefined;
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
            if(this.registeredTests[i].name==testName) return(this.registeredTests[i].buildFunction(worldEngine,world,canvasHolder));
        }
        throw new Error("getTestFromName could not find a test for :"+testName);
    }
    
}


