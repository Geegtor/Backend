import { Course } from "../models/types";
import { list } from "../models/variables";

function sortingCourses(items: Array<Course> = list) {
  return [...items]
    .sort((a, b) => {
      return (b.prices[1] || Infinity) - (a.prices[1] || Infinity)
    })
    .sort((a, b) => {
      return (b.prices[0] || 0) - (a.prices[0] || 0)
    })
}

export default sortingCourses; 