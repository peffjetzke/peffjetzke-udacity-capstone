import  { calcDays } from "../root/client/js/calc"

describe("Testing calcDays functionality", ()=>{
    /*calcDays test*/ 
    test("8/10 to 8/15 is 5 days", ()=>{
        let start = new Date("08/10/2021");
        let end = new Date("08/15/2021");
        expect(calcDays(end, start)).toBe(5);
    });
    /*Generic test*/
    test("1+2=3", ()=>{
        expect(1+2).toBe(3);
    });
});