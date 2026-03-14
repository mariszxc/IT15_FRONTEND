import React, { useEffect, useMemo, useState } from "react";
import FilterBar from "../components/FilterBar";
import ProgramList from "../components/ProgramList";
import ProgramDetails from "../components/ProgramDetails";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { coursesRequest } from "../services/api";
import { logUserActivity } from "../utils/activityLog";
import { applyCourseOverrides, saveCourseOverride } from "../utils/catalogOverrides";

function ProgramOfferings() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCode, setSelectedCode] = useState("");
  const [showCourseDetailsModal, setShowCourseDetailsModal] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [courseDraft, setCourseDraft] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      setLoading(true);
      setError("");

      try {
        const response = await coursesRequest({ per_page: 100 });
        const records = response?.data?.data || [];

        const mappedCourses = records.map((course) => ({
          id: `course-${course.id}`,
          code: course.code,
          name: course.name,
          fullName: course.name,
          type: "Bachelor's Degree",
          duration: "4 years",
          totalUnits: Number(course.credits || 0),
          status: "active",
          description: course.description || `${course.name} under ${course.department}.`,
          department: course.department || "Unassigned Department",
          yearLevels: {},
        }));

        const mergedCourses = applyCourseOverrides(mappedCourses);

        if (!isMounted) {
          return;
        }

        setPrograms(mergedCourses);
        setSelectedCode((previousCode) => previousCode || mergedCourses[0]?.code || "");
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setPrograms([]);
        setError(requestError.response?.data?.message || "Unable to load courses.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.code.toLowerCase().includes(search.toLowerCase()) ||
        program.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || program.status === statusFilter;
      const matchesType = typeFilter === "all" || program.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [programs, search, statusFilter, typeFilter]);

  const selectedProgram =
    filteredPrograms.find((program) => program.code === selectedCode) || filteredPrograms[0] || null;

  const handleSelectProgram = (program) => {
    setSelectedCode(program.code);
    setCourseDraft(program);
    setIsEditingCourse(false);
    setShowCourseDetailsModal(true);
    logUserActivity({
      action: "View",
      entity: "Course",
      description: `Opened details for ${program.code}.`,
    });
  };

  const handleDraftChange = (field, value) => {
    setCourseDraft((previous) => (previous ? { ...previous, [field]: value } : previous));
  };

  const handleEditOrSave = () => {
    if (!courseDraft) {
      return;
    }

    if (!isEditingCourse) {
      setIsEditingCourse(true);
      return;
    }

    const normalizedDraft = {
      ...courseDraft,
      name: courseDraft.fullName,
      totalUnits: Number(courseDraft.totalUnits || 0),
    };

    setPrograms((previous) =>
      previous.map((program) => (program.id === normalizedDraft.id ? normalizedDraft : program))
    );
    setSelectedCode(normalizedDraft.code);
    saveCourseOverride(normalizedDraft);

    logUserActivity({
      action: "Update",
      entity: "Course",
      description: `Edited course ${normalizedDraft.code}.`,
      metadata: { courseId: normalizedDraft.id },
    });

    setIsEditingCourse(false);
  };

  if (loading) {
    return <LoadingSpinner text="Loading courses..." skeleton />;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="page-shell">
      <FilterBar
        title="Course Filters"
      >
        <label className="filter-field">
          Search by code or name
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="BSIT / Information Technology"
          />
        </label>

        <label className="filter-field">
          Filter by status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="phased out">Phased Out</option>
            <option value="under review">Under Review</option>
          </select>
        </label>

        <label className="filter-field">
          Filter by type
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
            <option value="Diploma">Diploma</option>
          </select>
        </label>
      </FilterBar>

      <ProgramList
        programs={filteredPrograms}
        selectedCode={selectedProgram?.code}
        onSelect={handleSelectProgram}
      />

      {showCourseDetailsModal && selectedProgram ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setShowCourseDetailsModal(false)}
        >
          <section
            className="modal-card course-details-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Course details"
            onClick={(event) => event.stopPropagation()}
          >
            {isEditingCourse && courseDraft ? (
              <section className="course-details-content">
                <div className="table-header">
                  <div>
                    <p className="chart-title">Edit Course</p>
                    <span className="chart-subtitle">Update course information</span>
                  </div>
                </div>
                <div className="filter-grid">
                  <label className="filter-field">
                    Course Code
                    <input
                      value={courseDraft.code || ""}
                      onChange={(event) => handleDraftChange("code", event.target.value.toUpperCase())}
                    />
                  </label>
                  <label className="filter-field">
                    Course Name
                    <input
                      value={courseDraft.fullName || ""}
                      onChange={(event) => handleDraftChange("fullName", event.target.value)}
                    />
                  </label>
                  <label className="filter-field">
                    Department
                    <input
                      value={courseDraft.department || ""}
                      onChange={(event) => handleDraftChange("department", event.target.value)}
                    />
                  </label>
                  <label className="filter-field">
                    Course Type
                    <input
                      value={courseDraft.type || ""}
                      onChange={(event) => handleDraftChange("type", event.target.value)}
                    />
                  </label>
                  <label className="filter-field">
                    Duration
                    <input
                      value={courseDraft.duration || ""}
                      onChange={(event) => handleDraftChange("duration", event.target.value)}
                    />
                  </label>
                  <label className="filter-field">
                    Total Units
                    <input
                      type="number"
                      min="0"
                      value={courseDraft.totalUnits || 0}
                      onChange={(event) => handleDraftChange("totalUnits", event.target.value)}
                    />
                  </label>
                  <label className="filter-field">
                    Status
                    <input
                      value={courseDraft.status || ""}
                      onChange={(event) => handleDraftChange("status", event.target.value)}
                    />
                  </label>
                  <label className="filter-field" style={{ gridColumn: "1 / -1" }}>
                    Description
                    <textarea
                      value={courseDraft.description || ""}
                      onChange={(event) => handleDraftChange("description", event.target.value)}
                      rows={4}
                    />
                  </label>
                </div>
              </section>
            ) : (
              <ProgramDetails program={selectedProgram} isModal />
            )}
            <div className="modal-actions">
              <button
                className="primary-btn"
                type="button"
                onClick={handleEditOrSave}
              >
                {isEditingCourse ? "Save" : "Edit"}
              </button>
              <button
                className="ghost-btn"
                type="button"
                onClick={() => setShowCourseDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default ProgramOfferings;