import React, { useMemo, useState } from "react";
import FilterBar from "../components/FilterBar";
import SubjectList from "../components/SubjectList";
import SubjectDetails from "../components/SubjectDetails";
import { subjects } from "../data/catalogData";
import { logUserActivity } from "../utils/activityLog";
import { getPersistedSubjects, savePersistedSubjects } from "../utils/catalogOverrides";

const formatDependencies = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

function SubjectOfferings() {
  const [subjectRecords, setSubjectRecords] = useState(() => getPersistedSubjects(subjects));
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [unitsFilter, setUnitsFilter] = useState("all");
  const [prerequisiteFilter, setPrerequisiteFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [selectedCode, setSelectedCode] = useState(subjectRecords[0]?.code || "");
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [subjectDraft, setSubjectDraft] = useState(null);

  const programOptions = useMemo(() => {
    return [...new Set(subjectRecords.map((subject) => subject.programCode))].sort();
  }, [subjectRecords]);

  const filteredSubjects = useMemo(() => {
    return subjectRecords.filter((subject) => {
      const hasPrerequisite = subject.prerequisites.length > 0;

      const matchesSearch =
        subject.code.toLowerCase().includes(search.toLowerCase()) ||
        subject.title.toLowerCase().includes(search.toLowerCase());
      const matchesSemester =
        semesterFilter === "all" || subject.offeringMode === semesterFilter;
      const matchesUnits = unitsFilter === "all" || String(subject.units) === unitsFilter;
      const matchesPrerequisite =
        prerequisiteFilter === "all" ||
        (prerequisiteFilter === "with" && hasPrerequisite) ||
        (prerequisiteFilter === "without" && !hasPrerequisite);
      const matchesProgram =
        programFilter === "all" || subject.programCode === programFilter;

      return (
        matchesSearch &&
        matchesSemester &&
        matchesUnits &&
        matchesPrerequisite &&
        matchesProgram
      );
    });
  }, [subjectRecords, search, semesterFilter, unitsFilter, prerequisiteFilter, programFilter]);

  const selectedSubject =
    filteredSubjects.find((subject) => subject.code === selectedCode) || filteredSubjects[0] || null;

  const handleSelectSubject = (subject) => {
    setSelectedCode(subject.code);
    setSubjectDraft(subject);
    setIsEditingSubject(false);
    setShowSubjectModal(true);

    logUserActivity({
      action: "View",
      entity: "Subject",
      description: `Opened subject ${subject.code}.`,
    });
  };

  const handleDraftChange = (field, value) => {
    setSubjectDraft((previous) => (previous ? { ...previous, [field]: value } : previous));
  };

  const handleEditOrSave = () => {
    if (!subjectDraft) {
      return;
    }

    if (!isEditingSubject) {
      setIsEditingSubject(true);
      return;
    }

    const normalizedDraft = {
      ...subjectDraft,
      units: Number(subjectDraft.units || 0),
      prerequisites: Array.isArray(subjectDraft.prerequisites)
        ? subjectDraft.prerequisites
        : formatDependencies(subjectDraft.prerequisites),
      corequisites: Array.isArray(subjectDraft.corequisites)
        ? subjectDraft.corequisites
        : formatDependencies(subjectDraft.corequisites),
    };

    const nextSubjects = subjectRecords.map((subject) =>
      subject.code === selectedCode ? normalizedDraft : subject
    );

    setSubjectRecords(nextSubjects);
    setSelectedCode(normalizedDraft.code);
    savePersistedSubjects(nextSubjects);

    logUserActivity({
      action: "Update",
      entity: "Subject",
      description: `Edited subject ${normalizedDraft.code}.`,
      metadata: { subjectCode: normalizedDraft.code },
    });

    setIsEditingSubject(false);
  };

  return (
    <div className="page-shell">
      <FilterBar
        title="Subject Filters"
      >
        <label className="filter-field">
          Search by code or title
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="IT101 / Data Structures"
          />
        </label>

        <label className="filter-field">
          Filter by semester/term
          <select value={semesterFilter} onChange={(event) => setSemesterFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="semester">Per Semester</option>
            <option value="term">Per Term</option>
            <option value="both">Both</option>
          </select>
        </label>

        <label className="filter-field">
          Filter by units
          <select value={unitsFilter} onChange={(event) => setUnitsFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>

        <label className="filter-field">
          Filter pre-requisites
          <select value={prerequisiteFilter} onChange={(event) => setPrerequisiteFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="with">With Pre-requisites</option>
            <option value="without">Without Pre-requisites</option>
          </select>
        </label>

        <label className="filter-field">
          Filter by program
          <select value={programFilter} onChange={(event) => setProgramFilter(event.target.value)}>
            <option value="all">All</option>
            {programOptions.map((programCode) => (
              <option key={programCode} value={programCode}>
                {programCode}
              </option>
            ))}
          </select>
        </label>
      </FilterBar>

      <SubjectList
        subjects={filteredSubjects}
        selectedCode={selectedSubject?.code}
        onSelect={handleSelectSubject}
      />

      {showSubjectModal && selectedSubject ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowSubjectModal(false)}>
          <section className="modal-card course-details-modal" role="dialog" onClick={(event) => event.stopPropagation()}>
            {isEditingSubject && subjectDraft ? (
              <section className="course-details-content">
                <div className="table-header">
                  <div>
                    <p className="chart-title">Edit Subject</p>
                    <span className="chart-subtitle">Update subject information</span>
                  </div>
                </div>
                <div className="filter-grid">
                  <label className="filter-field">
                    Subject Code
                    <input
                      value={subjectDraft.code || ""}
                      onChange={(event) => handleDraftChange("code", event.target.value.toUpperCase())}
                    />
                  </label>
                  <label className="filter-field">
                    Subject Title
                    <input
                      value={subjectDraft.title || ""}
                      onChange={(event) => handleDraftChange("title", event.target.value)}
                    />
                  </label>
                  <label className="filter-field">
                    Units
                    <input
                      type="number"
                      min="0"
                      value={subjectDraft.units || 0}
                      onChange={(event) => handleDraftChange("units", event.target.value)}
                    />
                  </label>
                  <label className="filter-field">
                    Semester/Term
                    <input
                      value={subjectDraft.semesterTerm || ""}
                      onChange={(event) => handleDraftChange("semesterTerm", event.target.value)}
                    />
                  </label>
                  <label className="filter-field">
                    Program Code
                    <input
                      value={subjectDraft.programCode || ""}
                      onChange={(event) => handleDraftChange("programCode", event.target.value.toUpperCase())}
                    />
                  </label>
                  <label className="filter-field">
                    Offering Mode
                    <select
                      value={subjectDraft.offeringMode || "semester"}
                      onChange={(event) => handleDraftChange("offeringMode", event.target.value)}
                    >
                      <option value="semester">Per Semester</option>
                      <option value="term">Per Term</option>
                      <option value="both">Both</option>
                    </select>
                  </label>
                  <label className="filter-field" style={{ gridColumn: "1 / -1" }}>
                    Pre-requisites (comma separated)
                    <input
                      value={
                        Array.isArray(subjectDraft.prerequisites)
                          ? subjectDraft.prerequisites.join(", ")
                          : String(subjectDraft.prerequisites || "")
                      }
                      onChange={(event) => handleDraftChange("prerequisites", event.target.value)}
                    />
                  </label>
                  <label className="filter-field" style={{ gridColumn: "1 / -1" }}>
                    Co-requisites (comma separated)
                    <input
                      value={
                        Array.isArray(subjectDraft.corequisites)
                          ? subjectDraft.corequisites.join(", ")
                          : String(subjectDraft.corequisites || "")
                      }
                      onChange={(event) => handleDraftChange("corequisites", event.target.value)}
                    />
                  </label>
                  <label className="filter-field" style={{ gridColumn: "1 / -1" }}>
                    Description
                    <textarea
                      value={subjectDraft.description || ""}
                      onChange={(event) => handleDraftChange("description", event.target.value)}
                      rows={4}
                    />
                  </label>
                </div>
              </section>
            ) : (
              <SubjectDetails subject={selectedSubject} />
            )}
            <div className="modal-actions">
              <button className="primary-btn" type="button" onClick={handleEditOrSave}>
                {isEditingSubject ? "Save" : "Edit"}
              </button>
              <button className="ghost-btn small" type="button" onClick={() => setShowSubjectModal(false)}>
                Close
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default SubjectOfferings;