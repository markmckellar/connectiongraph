"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var walkerengine_1 = require("./walkerengine");
var Matter = require("matter-js");
var MatterEngine = (function (_super) {
    __extends(MatterEngine, _super);
    function MatterEngine() {
        var _this = _super.call(this) || this;
        _this.junctions = new Map();
        _this.paths = new Map();
        _this.engine = Matter.Engine.create();
        _this.engine.world.gravity.x = 0.0;
        _this.engine.world.gravity.y = 0.0;
        return _this;
    }
    MatterEngine.prototype.addPath = function (world, path) {
        if (!this.paths.has(path.woldObjectId)) {
            this.addJunction(world, path.startJunction);
            this.addJunction(world, path.endJunctin);
            var matterStartJunction = this.junctions.get(path.startJunction.woldObjectId);
            var matterEndJunction = this.junctions.get(path.endJunctin.woldObjectId);
            var matterPath = Matter.Constraint.create({
                bodyA: matterStartJunction,
                bodyB: matterEndJunction,
                pointA: { x: -0, y: -0 },
                pointB: { x: -0, y: -0 },
                stiffness: 0.0001,
            });
            this.paths.set(path.woldObjectId, matterPath);
            Matter.World.add(this.engine.world, [matterPath]);
        }
    };
    MatterEngine.prototype.initMouse = function (render) {
        var mouse = Matter.Mouse.create(render.canvas);
        var mouseConstraint = Matter.MouseConstraint.create(this.engine);
        mouseConstraint.mouse = mouse;
        mouseConstraint.constraint.render.visible = false;
        mouseConstraint.constraint.stiffness = 0.2;
        Matter.World.add(this.engine.world, mouseConstraint);
        render.controller.mouse = mouse;
    };
    MatterEngine.prototype.createBounds = function (width, height) {
        var thickness = 10;
        var boundsBottom = Matter.Bodies.rectangle(width / 2, height - thickness, width, thickness, { isStatic: true });
        var boundsTop = Matter.Bodies.rectangle(width / 2, 0, width, thickness, { isStatic: true });
        var boundsLeft = Matter.Bodies.rectangle(0, height / 2, thickness, height, { isStatic: true });
        var boundsRight = Matter.Bodies.rectangle(width - thickness, height / 2, thickness, height, { isStatic: true });
        boundsBottom.restitution = 1.0;
        boundsTop.restitution = 1.0;
        boundsLeft.restitution = 1.0;
        boundsRight.restitution = 1.0;
        Matter.World.add(this.engine.world, [boundsBottom, boundsTop, boundsLeft, boundsRight]);
    };
    MatterEngine.prototype.addWalker = function (world, walker) {
    };
    MatterEngine.prototype.addJunction = function (world, junction) {
        if (!this.junctions.has(junction.woldObjectId)) {
            var matterJunction = Matter.Bodies.circle(350, 50, 40, {}, 8);
            this.junctions.set(junction.woldObjectId, matterJunction);
            Matter.World.add(this.engine.world, [matterJunction]);
        }
    };
    Object.defineProperty(MatterEngine.prototype, "junctions", {
        get: function () {
            return this._junctions;
        },
        set: function (value) {
            this._junctions = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatterEngine.prototype, "paths", {
        get: function () {
            return this._paths;
        },
        set: function (value) {
            this._paths = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatterEngine.prototype, "walkers", {
        get: function () {
            return this._walkers;
        },
        set: function (value) {
            this._walkers = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatterEngine.prototype, "engine", {
        get: function () {
            return this._engine;
        },
        set: function (value) {
            this._engine = value;
        },
        enumerable: true,
        configurable: true
    });
    return MatterEngine;
}(walkerengine_1.WalkerEngine));
exports.MatterEngine = MatterEngine;
