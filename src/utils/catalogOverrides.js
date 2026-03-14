const COURSE_OVERRIDES_KEY = "course_overrides";
const SUBJECT_RECORDS_KEY = "subject_records";

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getCourseOverrides = () => {
  const overrides = readJson(COURSE_OVERRIDES_KEY, {});
  return typeof overrides === "object" && overrides ? overrides : {};
};

export const applyCourseOverrides = (courses) => {
  const overrides = getCourseOverrides();

  return courses.map((course) => {
    const patch = overrides[course.id];
    return patch ? { ...course, ...patch } : course;
  });
};

export const saveCourseOverride = (course) => {
  if (!course?.id) {
    return;
  }

  const overrides = getCourseOverrides();
  overrides[course.id] = {
    code: course.code,
    fullName: course.fullName,
    name: course.fullName,
    type: course.type,
    duration: course.duration,
    totalUnits: Number(course.totalUnits || 0),
    status: course.status,
    department: course.department,
    description: course.description,
  };

  writeJson(COURSE_OVERRIDES_KEY, overrides);
};

export const getPersistedSubjects = (fallbackSubjects = []) => {
  const records = readJson(SUBJECT_RECORDS_KEY, null);

  if (!Array.isArray(records) || records.length === 0) {
    return [...fallbackSubjects];
  }

  return records;
};

export const savePersistedSubjects = (subjects) => {
  writeJson(SUBJECT_RECORDS_KEY, subjects);
};
