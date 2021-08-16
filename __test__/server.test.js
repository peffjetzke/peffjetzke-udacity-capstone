const listening = require("../root/server/server")
describe("Testing for a port", ()=>{
    test("Listening", ()=>{
        expect(listening).toBeDefined();
    });
})
