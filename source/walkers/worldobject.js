"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WorldObject = (function () {
    function WorldObject(woldObjectId) {
        this.woldObjectId = woldObjectId;
    }
    Object.defineProperty(WorldObject.prototype, "woldObjectId", {
        get: function () {
            return this._woldObjectId;
        },
        set: function (value) {
            this._woldObjectId = value;
        },
        enumerable: true,
        configurable: true
    });
    return WorldObject;
}());
exports.WorldObject = WorldObject;
