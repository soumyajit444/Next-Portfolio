"use client";
import React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SecretKeyGate from "@/components/admin/SecretKeyGate";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { createProfile } from "@/services/profileService";
import DatePicker from "@/components/ui/DatePicker";

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg)",
  color: "var(--color-text)",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const sectionHeadStyle = {
  fontSize: "13px",
  color: "#6366f1",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  fontWeight: 600,
  marginBottom: "16px",
};

const dividerStyle = {
  height: "1px",
  background: "var(--color-border)",
  margin: "20px 0",
};

const addBtnStyle = {
  background: "transparent",
  border: "1px dashed var(--color-border)",
  borderRadius: "8px",
  color: "var(--color-text-muted)",
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: "13px",
  marginTop: "8px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

// ─── ChipInput ────────────────────────────────────────────────────────────────
const ChipInput = ({ items, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !items.includes(val)) {
        onChange([...items, val]);
        setInputValue("");
      }
    }
  };

  const removeItem = (itemToRemove) =>
    onChange(items.filter((item) => item !== itemToRemove));

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        padding: "8px",
        border: "1px solid var(--color-border)",
        borderRadius: "10px",
        background: "var(--color-bg)",
        minHeight: "50px",
        alignItems: "center",
      }}>
      {items.map((item, index) => (
        <span
          key={index}
          style={{
            background: "var(--color-border-muted)",
            color: "var(--color-text)",
            padding: "4px 10px",
            borderRadius: "16px",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
          {item}
          <button
            onClick={() => removeItem(item)}
            style={{
              background: "transparent",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "14px",
              lineHeight: 1,
              padding: 0,
            }}>
            ×
          </button>
        </span>
      ))}
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={items.length === 0 ? "Type and press Enter..." : ""}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          color: "var(--color-text)",
          fontSize: "14px",
          flex: "1 1 150px",
          padding: "4px",
        }}
      />
    </div>
  );
};

// ─── FileUploadField ──────────────────────────────────────────────────────────
/**
 * A single-file upload button that shows the selected filename.
 * `accept`  – e.g. "image/*" or ".pdf"
 * `value`   – current File | null
 * `onChange`– called with File | null
 */
const FileUploadField = ({
  accept,
  value,
  onChange,
  placeholder = "Choose file…",
}) => {
  const inputRef = useRef(null);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        border: "1px solid var(--color-border)",
        borderRadius: "10px",
        background: "var(--color-bg)",
        cursor: "pointer",
      }}
      onClick={() => inputRef.current?.click()}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
      <span
        style={{
          fontSize: "18px",
          lineHeight: 1,
          color: "#6366f1",
          userSelect: "none",
        }}>
        📎
      </span>
      <span
        style={{
          fontSize: "14px",
          color: value ? "var(--color-text)" : "var(--color-text-muted)",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
        {value ? value.name : placeholder}
      </span>
      {value && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "#ef4444",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: 1,
            padding: 0,
          }}>
          ×
        </button>
      )}
    </div>
  );
};

// ─── MultiFileUploadField ─────────────────────────────────────────────────────
/**
 * Multi-file picker (used for project media).
 */
const MultiFileUploadField = ({ accept, files, onChange }) => {
  const inputRef = useRef(null);

  const removeFile = (index) => onChange(files.filter((_, i) => i !== index));

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "8px",
        }}>
        {files.map((file, i) => (
          <span
            key={i}
            style={{
              background: "var(--color-border-muted)",
              color: "var(--color-text)",
              padding: "4px 10px",
              borderRadius: "16px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              maxWidth: "200px",
            }}>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
              {file.name}
            </span>
            <button
              onClick={() => removeFile(i)}
              style={{
                background: "transparent",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                fontSize: "14px",
                lineHeight: 1,
                padding: 0,
                flexShrink: 0,
              }}>
              ×
            </button>
          </span>
        ))}
      </div>
      <button onClick={() => inputRef.current?.click()} style={addBtnStyle}>
        <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
        Add Media
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          const newFiles = Array.from(e.target.files || []);
          onChange([...files, ...newFiles]);
          e.target.value = "";
        }}
      />
    </div>
  );
};

// ─── Small helpers ────────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <div
    style={{
      fontSize: "12px",
      color: "var(--color-text-muted)",
      letterSpacing: "1px",
      display: "block",
      marginBottom: "6px",
      textTransform: "uppercase",
      fontWeight: 600,
    }}>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: "14px" }}>
    <Label>{label}</Label>
    {children}
  </div>
);

const SectionHead = ({ children }) => (
  <div style={sectionHeadStyle}>{children}</div>
);

const Divider = () => <div style={dividerStyle} />;

// ─── Default empty shapes ─────────────────────────────────────────────────────
const emptyExperience = () => ({
  CompanyName: "",
  Role: "",
  StartDate: "",
  EndDate: "",
  Description: "",
  WorkLocation: "",
  KeySkills: [],
});

const emptyProject = () => ({
  Name: "",
  Description: "",
  Links: [],
  media: [], // File[]
});

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreateProfilePage() {
  const router = useRouter();
  const [secret, setSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // File uploads (top-level)
  const [profilePicture, setProfilePicture] = useState(null);
  const [resume, setResume] = useState(null);

  const [form, setForm] = useState({
    profileSlug: "",
    FirstName: "",
    LastName: "",
    JobRoles: [],
    Bio: "",
    YearsOfExperience: "",
    Skills: [{ Name: "", Rating: "" }],
    IndustryTools: [],
    Education: [{ Degree: "", Institution: "", PassOutYear: "" }],
    WorkExperience: [emptyExperience()],
    Projects: [emptyProject()],
    Hobbies: [],
    Address: { Street: "", State: "", Pin: "", Country: "" },
    ContactInfo: { PhoneNo: "", Email: "", LinkedIn: "" },
  });

  // ── Generic setter (dot-path) ─────────────────────────────────────
  const set = (path, value) => {
    const keys = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  // ── Array helpers (for Skills / Education) ────────────────────────
  const setArrItem = (arr, idx, key, value) => {
    const newArr = [...form[arr]];
    newArr[idx] = { ...newArr[idx], [key]: value };
    setForm({ ...form, [arr]: newArr });
  };

  const addItem = (arr, empty) =>
    setForm({ ...form, [arr]: [...form[arr], empty] });

  const removeItem = (arr, idx) =>
    setForm({ ...form, [arr]: form[arr].filter((_, i) => i !== idx) });

  // ── Work Experience helpers ───────────────────────────────────────
  const addExperience = () =>
    setForm({
      ...form,
      WorkExperience: [...form.WorkExperience, emptyExperience()],
    });

  const removeExperience = (index) =>
    setForm({
      ...form,
      WorkExperience: form.WorkExperience.filter((_, i) => i !== index),
    });

  const updateExperience = (index, field, value) => {
    const newExp = [...form.WorkExperience];
    newExp[index] = { ...newExp[index], [field]: value };
    setForm({ ...form, WorkExperience: newExp });
  };

  // ── Project helpers ───────────────────────────────────────────────
  const addProject = () =>
    setForm({ ...form, Projects: [...form.Projects, emptyProject()] });

  const removeProject = (index) =>
    setForm({ ...form, Projects: form.Projects.filter((_, i) => i !== index) });

  const updateProject = (index, field, value) => {
    const newProj = [...form.Projects];
    newProj[index] = { ...newProj[index], [field]: value };
    setForm({ ...form, Projects: newProj });
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        YearsOfExperience: Number(form.YearsOfExperience),
        Skills: form.Skills.filter((s) => s.Name).map((s) => ({
          ...s,
          Rating: Number(s.Rating),
        })),
        IndustryTools: form.IndustryTools.filter(Boolean),
        Hobbies: form.Hobbies.filter(Boolean),
        JobRoles: form.JobRoles.filter(Boolean),
        Education: form.Education.filter((e) => e.Degree),
        WorkExperience: form.WorkExperience.filter(
          (exp) => exp.CompanyName || exp.Role,
        ).map((exp) => ({
          ...exp,
          StartDate: exp.StartDate || "",
          EndDate: exp.EndDate || "",
          KeySkills: Array.isArray(exp.KeySkills)
            ? exp.KeySkills.filter(Boolean)
            : [],
        })),
        Projects: form.Projects.filter((p) => p.Name).map((p) => ({
          ...p,
          Links: (p.Links || []).filter(Boolean),
          // `media` is a File[] — profileService reads it
        })),
        // Top-level file uploads
        profilePicture,
        resume,
      };

      await createProfile(payload, secret);
      setSuccess(true);
      setTimeout(() => router.push("/profile-management"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create profile.");
    } finally {
      setLoading(false);
    }
  };

  // ── Guards ────────────────────────────────────────────────────────
  if (!secret) return <SecretKeyGate onUnlock={setSecret} />;

  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text)",
          fontFamily: "'DM Sans', sans-serif",
        }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
          <div style={{ fontSize: "24px", fontWeight: 700 }}>
            Profile Created!
          </div>
          <div style={{ color: "var(--color-text-muted)", marginTop: "8px" }}>
            Redirecting to panel…
          </div>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        fontFamily: "'DM Sans', sans-serif",
        color: "var(--color-text)",
        position: "relative",
      }}>
      <div
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          zIndex: 50,
        }}>
        <ThemeToggle />
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Page title */}
        <div style={{ marginBottom: "40px", paddingTop: "40px" }}>
          <div
            style={{
              fontSize: "13px",
              color: "#6366f1",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}>
            Admin
          </div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.5px",
            }}>
            Create Profile
          </h1>
        </div>

        <div
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "18px",
            padding: "32px",
            boxShadow: "var(--card-shadow)",
          }}>
          {/* ── Basic Info ──────────────────────────────────────────── */}
          <SectionHead>Basic Info</SectionHead>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}>
            <Field label="First Name">
              <input
                style={inputStyle}
                value={form.FirstName}
                onChange={(e) => set("FirstName", e.target.value)}
              />
            </Field>
            <Field label="Last Name">
              <input
                style={inputStyle}
                value={form.LastName}
                onChange={(e) => set("LastName", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Profile Slug (e.g. john-doe)">
            <input
              style={inputStyle}
              value={form.profileSlug}
              onChange={(e) =>
                set(
                  "profileSlug",
                  e.target.value.toLowerCase().replace(/\s+/g, "-"),
                )
              }
            />
          </Field>
          <Field label="Bio">
            <textarea
              style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
              value={form.Bio}
              onChange={(e) => set("Bio", e.target.value)}
            />
          </Field>
          <Field label="Years of Experience">
            <input
              style={inputStyle}
              type="number"
              value={form.YearsOfExperience}
              onChange={(e) => set("YearsOfExperience", e.target.value)}
            />
          </Field>

          <Divider />

          {/* ── Profile Picture & Resume ─────────────────────────────── */}
          <SectionHead>Uploads</SectionHead>
          <Field label="Profile Picture">
            <FileUploadField
              accept="image/*"
              value={profilePicture}
              onChange={setProfilePicture}
              placeholder="Upload profile picture (JPG, PNG, WEBP…)"
            />
          </Field>
          <Field label="Resume">
            <FileUploadField
              accept=".pdf,.doc,.docx"
              value={resume}
              onChange={setResume}
              placeholder="Upload résumé (PDF, DOC…)"
            />
          </Field>

          <Divider />

          {/* ── Job Roles ────────────────────────────────────────────── */}
          <SectionHead>Job Roles</SectionHead>
          <ChipInput
            items={form.JobRoles}
            onChange={(newItems) => setForm({ ...form, JobRoles: newItems })}
          />
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-text-muted)",
              marginTop: "6px",
              marginBottom: "4px",
            }}>
            Add roles like: Frontend Developer, UI Developer, React JS Developer
          </div>

          <Divider />

          {/* ── Skills ──────────────────────────────────────────────── */}
          <SectionHead>Skills</SectionHead>
          {form.Skills.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
              }}>
              <input
                style={{ ...inputStyle, flex: 2 }}
                placeholder="Skill name"
                value={s.Name}
                onChange={(e) =>
                  setArrItem("Skills", i, "Name", e.target.value)
                }
              />
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Rating (1-10)"
                type="number"
                min="1"
                max="10"
                value={s.Rating}
                onChange={(e) =>
                  setArrItem("Skills", i, "Rating", e.target.value)
                }
              />
              {form.Skills.length > 1 && (
                <button
                  onClick={() => removeItem("Skills", i)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: "18px",
                    padding: "0 4px",
                  }}>
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addItem("Skills", { Name: "", Rating: "" })}
            style={addBtnStyle}>
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Add Skill
          </button>

          <Divider />

          {/* ── Industry Tools ───────────────────────────────────────── */}
          <SectionHead>Industry Tools</SectionHead>
          <ChipInput
            items={form.IndustryTools}
            onChange={(newItems) =>
              setForm({ ...form, IndustryTools: newItems })
            }
          />

          <Divider />

          {/* ── Education ────────────────────────────────────────────── */}
          <SectionHead>Education</SectionHead>
          {form.Education.map((e, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
              }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 14px",
                }}>
                <Field label="Degree">
                  <input
                    style={inputStyle}
                    value={e.Degree}
                    onChange={(ev) =>
                      setArrItem("Education", i, "Degree", ev.target.value)
                    }
                  />
                </Field>
                <Field label="Pass Out Year">
                  <input
                    style={inputStyle}
                    type="number"
                    value={e.PassOutYear}
                    onChange={(ev) =>
                      setArrItem("Education", i, "PassOutYear", ev.target.value)
                    }
                  />
                </Field>
              </div>
              <Field label="Institution">
                <input
                  style={inputStyle}
                  value={e.Institution}
                  onChange={(ev) =>
                    setArrItem("Education", i, "Institution", ev.target.value)
                  }
                />
              </Field>
              {form.Education.length > 1 && (
                <button
                  onClick={() => removeItem("Education", i)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() =>
              addItem("Education", {
                Degree: "",
                Institution: "",
                PassOutYear: "",
              })
            }
            style={addBtnStyle}>
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Add
            Education
          </button>

          <Divider />

          {/* ── Work Experience ──────────────────────────────────────── */}
          <SectionHead>Work Experience</SectionHead>
          {form.WorkExperience.map((exp, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}>
                <strong style={{ color: "var(--color-text)" }}>
                  Experience #{i + 1}
                </strong>
                {form.WorkExperience.length > 1 && (
                  <button
                    onClick={() => removeExperience(i)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}>
                    Remove
                  </button>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 14px",
                }}>
                <Field label="Company Name">
                  <input
                    style={inputStyle}
                    value={exp.CompanyName}
                    onChange={(e) =>
                      updateExperience(i, "CompanyName", e.target.value)
                    }
                    placeholder="e.g. Google, Microsoft"
                  />
                </Field>
                <Field label="Job Role">
                  <input
                    style={inputStyle}
                    value={exp.Role}
                    onChange={(e) =>
                      updateExperience(i, "Role", e.target.value)
                    }
                    placeholder="e.g. Frontend Developer"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Field label="Start Date">
                  <DatePicker
                    id={`start-date-${i}`}
                    value={exp.StartDate || ""}
                    onChange={(date) => updateExperience(i, "StartDate", date)}
                    max={exp.EndDate || undefined}
                    placeholder="Select start date"
                  />
                </Field>
                <Field label="End Date">
                  <DatePicker
                    id={`end-date-${i}`}
                    value={exp.EndDate || ""}
                    onChange={(date) => updateExperience(i, "EndDate", date)}
                    min={exp.StartDate || undefined}
                    placeholder="Present"
                  />
                </Field>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!exp.EndDate}
                    onChange={(e) =>
                      updateExperience(
                        i,
                        "EndDate",
                        e.target.checked ? "" : exp.EndDate,
                      )
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                  />
                  I currently work here
                </label>
              </div>

              <Field label="Work Location">
                <input
                  style={inputStyle}
                  value={exp.WorkLocation}
                  onChange={(e) =>
                    updateExperience(i, "WorkLocation", e.target.value)
                  }
                  placeholder="e.g. Remote, Kolkata, India"
                />
              </Field>

              <Field label="Description">
                <textarea
                  style={{
                    ...inputStyle,
                    minHeight: "70px",
                    resize: "vertical",
                  }}
                  value={exp.Description}
                  onChange={(e) =>
                    updateExperience(i, "Description", e.target.value)
                  }
                  placeholder="Brief description of your role and responsibilities…"
                />
              </Field>

              <Field label="Key Skills">
                <ChipInput
                  items={exp.KeySkills || []}
                  onChange={(newSkills) =>
                    updateExperience(i, "KeySkills", newSkills)
                  }
                />
              </Field>
            </div>
          ))}
          <button onClick={addExperience} style={addBtnStyle}>
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Add Work
            Experience
          </button>

          <Divider />

          {/* ── Projects ──────────────────────────────────────────────── */}
          <SectionHead>Projects</SectionHead>
          {form.Projects.map((proj, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
              }}>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}>
                <strong style={{ color: "var(--color-text)" }}>
                  Project #{i + 1}
                </strong>
                {form.Projects.length > 1 && (
                  <button
                    onClick={() => removeProject(i)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}>
                    Remove
                  </button>
                )}
              </div>

              <Field label="Project Name">
                <input
                  style={inputStyle}
                  value={proj.Name}
                  onChange={(e) => updateProject(i, "Name", e.target.value)}
                  placeholder="e.g. Portfolio Website"
                />
              </Field>

              <Field label="Description">
                <textarea
                  style={{
                    ...inputStyle,
                    minHeight: "70px",
                    resize: "vertical",
                  }}
                  value={proj.Description}
                  onChange={(e) =>
                    updateProject(i, "Description", e.target.value)
                  }
                  placeholder="Brief description of the project…"
                />
              </Field>

              {/* Links as chips */}
              <Field label="Links (GitHub, Live URL, etc.)">
                <ChipInput
                  items={proj.Links || []}
                  onChange={(newLinks) => updateProject(i, "Links", newLinks)}
                />
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    marginTop: "6px",
                  }}>
                  Paste a URL and press Enter
                </div>
              </Field>

              {/* Project media files */}
              <Field label="Media (Images / Videos)">
                <MultiFileUploadField
                  accept="image/*,video/*"
                  files={proj.media || []}
                  onChange={(newFiles) => updateProject(i, "media", newFiles)}
                />
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    marginTop: "6px",
                  }}>
                  Each file will be attached to this project in the API payload
                </div>
              </Field>
            </div>
          ))}
          <button onClick={addProject} style={addBtnStyle}>
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Add
            Project
          </button>

          <Divider />

          {/* ── Hobbies ───────────────────────────────────────────────── */}
          <SectionHead>Hobbies</SectionHead>
          <ChipInput
            items={form.Hobbies}
            onChange={(newItems) => setForm({ ...form, Hobbies: newItems })}
          />

          <Divider />

          {/* ── Contact ───────────────────────────────────────────────── */}
          <SectionHead>Contact Info</SectionHead>
          <Field label="Email">
            <input
              style={inputStyle}
              type="email"
              value={form.ContactInfo.Email}
              onChange={(e) => set("ContactInfo.Email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              style={inputStyle}
              value={form.ContactInfo.PhoneNo}
              onChange={(e) => set("ContactInfo.PhoneNo", e.target.value)}
            />
          </Field>
          <Field label="LinkedIn">
            <input
              style={inputStyle}
              value={form.ContactInfo.LinkedIn}
              onChange={(e) => set("ContactInfo.LinkedIn", e.target.value)}
            />
          </Field>

          <Divider />

          {/* ── Address ───────────────────────────────────────────────── */}
          <SectionHead>Address</SectionHead>
          <Field label="Street">
            <input
              style={inputStyle}
              value={form.Address.Street}
              onChange={(e) => set("Address.Street", e.target.value)}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}>
            <Field label="State">
              <input
                style={inputStyle}
                value={form.Address.State}
                onChange={(e) => set("Address.State", e.target.value)}
              />
            </Field>
            <Field label="PIN">
              <input
                style={inputStyle}
                value={form.Address.Pin}
                onChange={(e) => set("Address.Pin", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Country">
            <input
              style={inputStyle}
              value={form.Address.Country}
              onChange={(e) => set("Address.Country", e.target.value)}
            />
          </Field>

          {/* ── Error ─────────────────────────────────────────────────── */}
          {error && (
            <div
              style={{
                color: "#ef4444",
                fontSize: "13px",
                marginBottom: "16px",
                padding: "12px",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}>
              {error}
            </div>
          )}

          {/* ── Actions ───────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              onClick={() => router.back()}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
              }}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 2,
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "15px",
                opacity: loading ? 0.7 : 1,
                letterSpacing: "0.2px",
              }}>
              {loading ? "Creating…" : "Create Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
