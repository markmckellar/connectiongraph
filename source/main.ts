import { World } from "./walkers/world";
import { Junction } from "./walkers/junction";
import { Path } from "./walkers/path";
import { MatterEngine } from "./walkers/matterengine";
import * as Matter from "matter-js";
// import * as $ from "jquery";
// import Greeter from "./entities/greeter";
// let merge = require("merge2");
// npm install --save @types/matter-js
// import Matter from "@types/matter-js";
// import * as jsdom from "jsdom";
// import { jsdom } from "jsdom";
// const document = jsdom("");

// let canvas = document.getElementById("world");
let matterEngine = new MatterEngine();
let world = new World(matterEngine);
let engine = matterEngine.engine;

// create a renderer
let render = Matter.Render.create({
  element: document.body,
  engine: engine,
  options : {
    hasBounds:false,
    height:600,
    width:800,
    wireframes:true,
  },
});

world.walkerEngine.createBounds(render.canvas.width,render.canvas.height);
matterEngine.initMouse(render);

// run the engine
Matter.Engine.run(engine);
Matter.Render.run(render);

let j1 = new Junction("1");
let j2 = new Junction("2");
let p1to2 = new Path("1to2",j1,j2);

world.addJunction(j1);
world.addJunction(j2);
world.addPath(p1to2);

console.log("main:world.junctions.keys.length="+world.junctions.size);