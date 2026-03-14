const ENROLLMENT_STORAGE_KEY = "student_enrollment_records";

const readEnrollmentRecords = () => {
  try {
    const raw = localStorage.getItem(ENROLLMENT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeEnrollmentRecords = (records) => {
  localStorage.setItem(ENROLLMENT_STORAGE_KEY, JSON.stringify(records));
};

const getCurrentBatch = (date = new Date()) =>
  date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

const normalizeText = (value) => String(value || "").trim().toLowerCase();

export const getEnrollmentRecords = () => readEnrollmentRecords();

export const getEnrollmentRecordForStudent = (student) => {
  if (!student) {
    return null;
  }

  const records = readEnrollmentRecords();
  const targetId = String(student.id ?? "");
  const targetNumber = normalizeText(student.student_number);

  return (
    records.find((record) => {
      if (targetId && String(record.studentId ?? "") === targetId) {
        return true;
      }

      if (targetNumber && normalizeText(record.studentNumber) === targetNumber) {
        return true;
      }

      return false;
    }) || null
  );
};

export const enrollStudentRecord = (student) => {
  const records = readEnrollmentRecords();
  const now = new Date();
  const studentId = String(student.id ?? "");
  const studentNumber = String(student.student_number || "").trim();

  const nextRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    studentId,
    studentNumber,
    studentName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
    batch: getCurrentBatch(now),
    submittedAt: now.toISOString(),
    submitted: true,
    pending: false,
    approved: true,
    enrollmentStatus: "Enrolled",
  };

  const existingIndex = records.findIndex((record) => {
    const sameId = studentId && String(record.studentId ?? "") === studentId;
    const sameNumber =
      studentNumber && normalizeText(record.studentNumber) === normalizeText(studentNumber);

    return sameId || sameNumber;
  });

  if (existingIndex >= 0) {
    records[existingIndex] = {
      ...records[existingIndex],
      ...nextRecord,
      id: records[existingIndex].id || nextRecord.id,
    };
  } else {
    records.unshift(nextRecord);
  }

  writeEnrollmentRecords(records);

  return existingIndex >= 0 ? records[existingIndex] : nextRecord;
};
