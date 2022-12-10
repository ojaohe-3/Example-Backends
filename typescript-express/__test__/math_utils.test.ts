
import { within_range,  Avg, Sum, Std  } from "../src/utils/math_utils";

describe("Math utilites", () => {
    describe("within range works as inteded", () => {
        test("within_range same value is within range", () => {
            expect(within_range(15, 15)).toBeTruthy()
            expect(within_range(-10, -10)).toBeTruthy()
            expect(within_range(1e10, 1e10)).toBeTruthy()
            expect(within_range(1e-10, 1e-10)).toBeTruthy()
        });

        test("the within_range is false when different", ()=> {
            expect(within_range(15, 14)).toBeFalsy();
            expect(within_range(14, 15)).toBeFalsy();

            expect(within_range(14.5, 15)).toBeFalsy();
            expect(within_range(15, 14.5)).toBeFalsy();

            expect(within_range(15, 14.85)).toBeFalsy();
            expect(within_range(14.85, 15)).toBeFalsy();
        });
    });
    describe("Sum works as intended", ()=>{
        test("Sum calculates sum of array", ()=>{
            expect(Sum([1,2,3])).toBe(6)
            expect(Sum([1,2,3,4])).toBe(10)
            let r = Math.random() * 1e6;
            expect(Sum([1,2,3,4, r])).toBe(10 + r)

        })
    });
    describe("Avg Calculates the average", () =>{
        let values = Array.from({length: 100_000}, () => Math.random())
        expect(Avg(values)).toBeCloseTo(0.5,1) // might fail even tho correct, very low chance for that
    });
    describe("Stg Calcualtes the standard deviation", () => {
        let arr = [1.70541115, 6.47453686, 1.30337579, 4.88084823, 4.37746649] // generated using numpy
        expect(Std(arr)).toBeCloseTo(1.962749737074295, 5)
    });
});