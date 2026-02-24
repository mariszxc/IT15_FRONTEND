export const statCards = [
  {
    title: "Total Students",
    value: "4,820",
    delta: "+6.2%",
    hint: "Active within the last semester",
  },
  {
    title: "Pending Requests",
    value: "148",
    delta: "+2.1%",
    hint: "Awaiting registrar review",
  },
  {
    title: "Open Course Slots",
    value: "1,270",
    delta: "-1.4%",
    hint: "Available seats across programs",
  },
  {
    title: "Approval Rate",
    value: "92%",
    delta: "+0.8%",
    hint: "Average for the current intake",
  },
];

export const enrollmentRows = [
  {
    id: "2025-ENG-3021",
    student: "Ariana Santos",
    program: "BSIT",
    status: "Approved",
    date: "Feb 18, 2026",
  },
  {
    id: "2025-EDU-1940",
    student: "Miguel Cruz",
    program: "BSEd",
    status: "Pending",
    date: "Feb 18, 2026",
  },
  {
    id: "2025-BUS-1184",
    student: "Jia Fernandez",
    program: "BSBA",
    status: "For Review",
    date: "Feb 17, 2026",
  },
  {
    id: "2025-IT-4507",
    student: "Paolo Reyes",
    program: "BSIT",
    status: "Approved",
    date: "Feb 17, 2026",
  },
  {
    id: "2025-TOUR-3812",
    student: "Maria Gomez",
    program: "BSTM",
    status: "Pending",
    date: "Feb 16, 2026",
  },
];

export const studentSnapshot = [
  {
    label: "Freshmen Applicants",
    value: "1,240",
    note: "Awaiting document validation",
  },
  {
    label: "Transfers",
    value: "320",
    note: "Includes ladderized programs",
  },
  {
    label: "Returning Students",
    value: "3,260",
    note: "Auto-enrolled for next term",
  },
];

export const courseCatalog = [
  { code: "IT 201", title: "BSIT Core", units: 3, slots: 120 },
  { code: "BA 230", title: "Business Analytics", units: 3, slots: 80 },
  { code: "ED 140", title: "Education Methods", units: 2, slots: 64 },
  { code: "TM 105", title: "Tourism Operations", units: 3, slots: 72 },
  { code: "AC 211", title: "Accounting Systems", units: 3, slots: 60 },
];

export const enrollmentPipeline = [
  { label: "Submitted", count: "1,482", note: "Awaiting initial review" },
  { label: "Validated", count: "1,204", note: "Credentials verified" },
  { label: "For Approval", count: "436", note: "Registrar queue" },
  { label: "Approved", count: "982", note: "Ready for enrollment" },
];

export const reportQueue = [
  {
    title: "Enrollment Forecast",
    owner: "Planning Office",
    status: "Approved",
    updated: "Feb 18, 2026",
  },
  {
    title: "Slot Utilization",
    owner: "Registrar",
    status: "Pending",
    updated: "Feb 17, 2026",
  },
  {
    title: "Payment Compliance",
    owner: "Finance",
    status: "For Review",
    updated: "Feb 16, 2026",
  },
];
