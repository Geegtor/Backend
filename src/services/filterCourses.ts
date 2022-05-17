import { Course, Range } from "../models/types";
import { list } from "../models/variables";

const isValidPrice = (course: Course, range: Range): boolean => {
  const [minLim, maxLim] =
    [course.prices[0] || 0, course.prices[1] || Infinity];

  const validateMinLim = (): boolean => {
    if (range[0]) {
      return range[0] <= maxLim;
    } else return true;
  }

  const validateMaxLim = () => {
    if (range[1]) {
      return range[1] >= minLim;
    } else return true;
  }

  return validateMaxLim() && validateMinLim();
}

function filterCourses(
  param: Range,
  courses = list,
  filterFunction = isValidPrice): string | Array<Course> {
  let result: Array<Course> = [];
  for (let el of courses) {
    if (filterFunction(el, param) == true) {
      result.push(el)
    }
  }
  return result;
}

export default filterCourses;
