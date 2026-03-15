import { enrollmentRecordsRequest, enrollStudentRequest } from "../services/api";

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

const normalizeRecordsPayload = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
};

export const getEnrollmentRecords = async () => {
  try {
    const response = await enrollmentRecordsRequest({ per_page: 500 });
    const records = normalizeRecordsPayload(response?.data);
    writeEnrollmentRecords(records);
    return records;
  } catch {
    return readEnrollmentRecords();
  }
};

export const getEnrollmentRecordForStudent = async (student) => {
  if (!student) {
    return null;
  }

  const targetId = String(student.id ?? "");
  const targetNumber = normalizeText(student.student_number);

  try {
    const response = await enrollmentRecordsRequest({
      per_page: 1,
      ...(targetId ? { student_id: targetId } : {}),
      ...(targetNumber ? { student_number: student.student_number } : {}),
    });
    const records = normalizeRecordsPayload(response?.data);
    if (records.length > 0) {
      return records[0];
    }
  } catch {
    // Falls back to local cache below.
  }

  const records = readEnrollmentRecords();

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

export const enrollStudentRecord = async (student) => {
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

  try {
    const response = await enrollStudentRequest(nextRecord);
    const persisted = response?.data?.data || response?.data || nextRecord;
    const existingIndex = records.findIndex((record) => {
      const sameId = studentId && String(record.studentId ?? "") === studentId;
      const sameNumber =
        studentNumber && normalizeText(record.studentNumber) === normalizeText(studentNumber);

      return sameId || sameNumber;
    });

    if (existingIndex >= 0) {
      records[existingIndex] = persisted;
    } else {
      records.unshift(persisted);
    }

    writeEnrollmentRecords(records);
    return persisted;
  } catch {
    // Falls back to local persistence below.
  }

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
