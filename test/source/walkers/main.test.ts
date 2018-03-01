import { expect } from "chai";
//import { MockEngine } from "../../../source/engine/mockengine/mockengine";

describe("Mock engine", () => {

    /*
    it("Should set msg when an instance is created", () => {
        let expected = "world!";
        let greater = new Greeter(expected);
        expect(greater.greeting).eql(expected);
    });

    it("Should greet", () => {
        let greet = "world!";
        let greater = new Greeter(greet);
        let actual = greater.greet();
        let expected = `Hello, ${greet}`;
        expect(actual).eql(expected);
    });
*/
    it("Should equal", () => {
        //let mockEngine = new MockEngine();
        expect(1).eql(1);
    });
});
