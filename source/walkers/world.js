"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var World = (function () {
    function World() {
        this.junctionList = new Array();
        this.walkerList = new Array();
    }
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
    return World;
}());
exports.World = World;
//# sourceMappingURL=world.js.map