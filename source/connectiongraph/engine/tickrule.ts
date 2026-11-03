/** Anything the engine should run once per update tick (area rules, layouts...). */
export interface TickRule {
    processAllRules():void;
}
