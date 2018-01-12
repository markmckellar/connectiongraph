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
var worldobject_1 = require("./worldobject");
var Walker = (function (_super) {
    __extends(Walker, _super);
    function Walker(woldObjectId, junction) {
        var _this = _super.call(this, woldObjectId) || this;
        _this.currentJunction = junction;
        return _this;
    }
    Object.defineProperty(Walker.prototype, "currentJunction", {
        get: function () {
            return this._currentJunction;
        },
        set: function (value) {
            this._currentJunction = value;
        },
        enumerable: true,
        configurable: true
    });
    return Walker;
}(worldobject_1.WorldObject));
exports.Walker = Walker;
