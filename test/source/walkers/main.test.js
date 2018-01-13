"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var world_1 = require("../../../source/walkers/world");
var junction_1 = require("../../../source/walkers/junction");
var path_1 = require("../../../source/walkers/path");
var matterengine_1 = require("../../../source/walkers/matterengine");
var Matter = require("matter-js");
var matterEngine = new matterengine_1.MatterEngine();
var world = new world_1.World(matterEngine);
var engine = matterEngine.engine;
var render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        hasBounds: false,
        height: 600,
        width: 800,
        wireframes: true,
    },
});
world.walkerEngine.createBounds(render.canvas.width, render.canvas.height);
matterEngine.initMouse(render);
Matter.Engine.run(engine);
Matter.Render.run(render);
var j1 = new junction_1.Junction("1");
var j2 = new junction_1.Junction("2");
var p1to2 = new path_1.Path("1to2", j1, j2);
world.addJunction(j1);
world.addJunction(j2);
world.addPath(p1to2);
console.log("main:world.junctions.keys.length=" + world.junctions.size);
