"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var World = (function () {
    function World(walkerEngine) {
        this.junctionList = new Array();
        this.walkerList = new Array();
        this.worldUpdateList = new Array();
        this.walkers = new Map();
        this.junctions = new Map();
        this.paths = new Map();
        this.walkerEngine = walkerEngine;
    }
    World.prototype.addPath = function (path) {
        if (!this.paths.has(path.woldObjectId)) {
            console.log("world.addPath:before::this.paths.keys.length=" + this.paths.size);
            console.log("wolrd.addPath:adding:" + path.woldObjectId);
            this.paths.set(path.woldObjectId, path);
            this.addJunction(path.startJunction);
            this.addJunction(path.endJunctin);
            console.log("world.addPath:after::this.paths.keys.length=" + this.paths.size);
            this.walkerEngine.addPath(this, path);
        }
    };
    World.prototype.addWalker = function (walker) {
    };
    World.prototype.addJunction = function (junction) {
        if (!this.junctions.has(junction.woldObjectId)) {
            this.junctions.set(junction.woldObjectId, junction);
            this.walkerEngine.addJunction(this, junction);
        }
    };
    World.prototype.processWorldUpdate = function (worldUpdate) {
    };
    Object.defineProperty(World.prototype, "walkerEngine", {
        get: function () {
            return this._walkerEngine;
        },
        set: function (value) {
            this._walkerEngine = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "junctionList", {
        get: function () {
            return this._junctionList;
        },
        set: function (value) {
            this._junctionList = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "walkerList", {
        get: function () {
            return this._walkerList;
        },
        set: function (value) {
            this._walkerList = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "worldUpdateList", {
        get: function () {
            return this._worldUpdateList;
        },
        set: function (value) {
            this._worldUpdateList = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "walkers", {
        get: function () {
            return this._walkers;
        },
        set: function (value) {
            this._walkers = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "junctions", {
        get: function () {
            return this._junctions;
        },
        set: function (value) {
            this._junctions = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "paths", {
        get: function () {
            return this._paths;
        },
        set: function (value) {
            this._paths = value;
        },
        enumerable: true,
        configurable: true
    });
    return World;
}());
exports.World = World;
