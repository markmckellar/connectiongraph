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
var Path = (function (_super) {
    __extends(Path, _super);
    function Path(woldObjectId, startJunction, endJunction) {
        var _this = _super.call(this, woldObjectId) || this;
        _this.startJunction = startJunction;
        _this.endJunctin = endJunction;
        return _this;
    }
    Object.defineProperty(Path.prototype, "startJunction", {
        get: function () {
            return this._startJunction;
        },
        set: function (value) {
            this._startJunction = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "endJunctin", {
        get: function () {
            return this._endJunctin;
        },
        set: function (value) {
            this._endJunctin = value;
        },
        enumerable: true,
        configurable: true
    });
    return Path;
}(worldobject_1.WorldObject));
exports.Path = Path;
