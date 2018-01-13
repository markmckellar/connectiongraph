"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WorldUpdate = (function () {
    function WorldUpdate(junctionName, walkerName, processDate, junctionInfo, walkerInfo, pathInfo) {
        this.junctionName = junctionName;
        this.walkerName = walkerName;
        this.processDate = processDate;
        this.walkerInfo = walkerInfo;
        this.junctionInfo = junctionInfo;
        this.pathInfo = pathInfo;
    }
    WorldUpdate.prototype.isReadyToBeProcessed = function () {
        return (this.processDate.getTime() >= (new Date().getTime()));
    };
    Object.defineProperty(WorldUpdate.prototype, "junctionName", {
        get: function () {
            return this._junctionName;
        },
        set: function (value) {
            this._junctionName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldUpdate.prototype, "walkerName", {
        get: function () {
            return this._walkerName;
        },
        set: function (value) {
            this._walkerName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldUpdate.prototype, "processDate", {
        get: function () {
            return this._processDate;
        },
        set: function (value) {
            this._processDate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldUpdate.prototype, "walkerInfo", {
        get: function () {
            return this._walkerInfo;
        },
        set: function (value) {
            this._walkerInfo = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldUpdate.prototype, "junctionInfo", {
        get: function () {
            return this._junctionInfo;
        },
        set: function (value) {
            this._junctionInfo = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldUpdate.prototype, "pathInfo", {
        get: function () {
            return this._pathInfo;
        },
        set: function (value) {
            this._pathInfo = value;
        },
        enumerable: true,
        configurable: true
    });
    return WorldUpdate;
}());
exports.WorldUpdate = WorldUpdate;
