"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UniqueId = (function () {
    function UniqueId() {
        this.performanceExists = false;
        if (typeof performance !== "undefined" && typeof performance.now === "function")
            this.performanceExists = true;
    }
    UniqueId.prototype.generateUUID = function () {
        var d = (this.performanceExists) ? new Date().getTime() : performance.now();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    return UniqueId;
}());
exports.UniqueId = UniqueId;
