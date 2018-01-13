import { World } from "./walkers/world";
import { MatterEngine } from "./walkers/matterengine";
import * as Matter from "matter-js";
import { WorldUpdate } from "./walkers/worldupdate";
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

let worldUpdate1:WorldUpdate = new WorldUpdate("junction1","walker",new Date(),{},{},{});
let worldUpdate2:WorldUpdate = new WorldUpdate("junction2","walker",new Date(),{},{},{});
let worldUpdate3:WorldUpdate = new WorldUpdate("junction3","walker",new Date(),{},{},{});
let worldUpdate4:WorldUpdate = new WorldUpdate("junction4","walker",new Date(),{},{},{});
let worldUpdate5:WorldUpdate = new WorldUpdate("junction5","walker",new Date(),{},{},{});


world.addWorldUpdate(worldUpdate1);
world.addWorldUpdate(worldUpdate2);
world.addWorldUpdate(worldUpdate3);
world.addWorldUpdate(worldUpdate4);
world.addWorldUpdate(worldUpdate5);


world.processWorldUpdates();
console.log("yy main:world.junctions.keys.length="+world.junctions.size);