import {
  enrollmentRows,
  courseCatalog,
  studentSnapshot,
  reportQueue,
} from "../data/mockData";

export async function fetchEnrollmentQueue() {
  return Promise.resolve(enrollmentRows);
}

export async function fetchCourses() {
  return Promise.resolve(courseCatalog);
}

export async function fetchStudentSnapshot() {
  return Promise.resolve(studentSnapshot);
}

export async function fetchReports() {
  return Promise.resolve(reportQueue);
}
