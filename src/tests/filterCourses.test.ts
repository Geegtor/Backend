import { list, requiredRange1, requiredRange2, requiredRange3 } from "../models/variables";
import filterCourses from "../services/filterCourses";

describe('Test for entire range', () => {
  const enitreRange = [null, null];
  it(`Range = ${enitreRange.toString()}`, () => {
    expect(filterCourses(enitreRange))
      .toHaveLength(8);
  });

  it('Have an origin list', () => {
    expect(filterCourses(enitreRange))
      .toEqual(list);
  });
});

describe('Test for requiredRange1', () => {
  it(`Range = ${requiredRange1.toString()}`, () => {
    expect(filterCourses(requiredRange1))
      .toHaveLength(7);
  });

  it('Have an expected result list', () => {
    expect(filterCourses(requiredRange1))
      .toEqual([
        { name: "Courses in England", prices: [0, 100] },
        { name: "Courses in Italy", prices: [100, 200] },
        { name: "Courses in Russia", prices: [null, 400] },
        { name: "Courses in China", prices: [50, 250] },
        { name: "Courses in USA", prices: [200, null] },
        { name: "Courses in Kazakhstan", prices: [56, 324] },
        { name: "Courses in France", prices: [null, null] },
      ]);
  });
});

describe('Test for 500$+ range', () => {
  const testRange = [500, null];
  it(`Range = ${testRange.toString()}`, () => {
    expect(filterCourses(testRange))
      .toHaveLength(3);
  });

  it('Have an expected result list', () => {
    expect(filterCourses(testRange))
      .toEqual([
        { name: "Courses in Germany", prices: [500, null] },
        { name: "Courses in USA", prices: [200, null] },
        { name: "Courses in France", prices: [null, null] },
      ]);
  });
});
