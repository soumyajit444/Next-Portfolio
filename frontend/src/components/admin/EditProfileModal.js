"use client";
import React, { useState } from "react";
import { updateProfile } from "@/services/profileService";
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

// ─── Label / Field ────────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <div
    style={{
      color: "var(--color-text-muted)",
      fontSize: "12px",
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

const HR = () => (
  <hr
    style={{
      border: "0",
      borderTop: "1px solid var(--color-border)",
      margin: "24px 0",
    }}
  />
);

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
            onClick={() => onChange(items.filter((_, i) => i !== index))}
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

// ─── FileUpload ───────────────────────────────────────────────────────────────
/**
 * Displays existing URL as a link, or a pending File name.
 * Selecting a new file always replaces the previous pending selection.
 */
const FileUpload = ({ label, accept, onFileSelect, fileUrl, fileName }) => {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
    e.target.value = "";
  };

  return (
    <div style={{ flex: 1, minWidth: "200px" }}>
      <Label>{label}</Label>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "12px",
          border: "1px dashed var(--color-border)",
          borderRadius: "10px",
          background: "var(--color-bg)",
        }}>
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          style={{
            padding: "4px",
            borderRadius: "6px",
            background: "transparent",
            color: "var(--color-text)",
            fontSize: "13px",
            cursor: "pointer",
          }}
        />
        {fileName && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
            }}>
            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#6366f1",
                  textDecoration: "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}>
                {fileName}
              </a>
            ) : (
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "#6366f1",
                }}>
                📁 {fileName}{" "}
                <em style={{ color: "var(--color-text-muted)" }}>
                  (pending upload)
                </em>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ProjectMediaItem ─────────────────────────────────────────────────────────
/**
 * Handles three states:
 *  1. New file selected (media.file is a File)  → shows preview + resourceType toggle
 *  2. Existing server asset (media.url exists)  → shows thumbnail/link + resourceType toggle
 *  3. Empty slot (neither)                      → shows file input
 */
const ProjectMediaItem = ({ media, onFileSelect, onRemove, onUpdate }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file, file.type.startsWith("video/") ? "video" : "image");
    e.target.value = "";
  };

  const resourceTypeSelect = (
    <select
      value={media?.resourceType || "image"}
      onChange={(e) => onUpdate({ ...media, resourceType: e.target.value })}
      style={{
        padding: "4px 8px",
        borderRadius: "6px",
        border: "1px solid var(--color-border)",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontSize: "11px",
        flexShrink: 0,
      }}>
      <option value="image">Image</option>
      <option value="video">Video</option>
    </select>
  );

  const removeBtn = (
    <button
      onClick={onRemove}
      style={{
        background: "transparent",
        border: "none",
        color: "#ef4444",
        cursor: "pointer",
        fontSize: "16px",
        padding: "0 4px",
        lineHeight: 1,
        flexShrink: 0,
      }}>
      ×
    </button>
  );

  const rowStyle = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    padding: "8px",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    background: "var(--color-bg)",
    marginBottom: "8px",
  };

  const thumbStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    objectFit: "cover",
    flexShrink: 0,
    cursor: "pointer",
  };

  const videoThumb = (onClick) => (
    <div
      onClick={onClick}
      style={{
        ...thumbStyle,
        background: "var(--color-border-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
      }}>
      🎬
    </div>
  );

  const nameSpan = (name) => (
    <span
      style={{
        fontSize: "12px",
        color: "var(--color-text)",
        flex: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      title={name}>
      {name}
    </span>
  );

  // ① New file
  if (media?.file instanceof File) {
    return (
      <div style={rowStyle}>
        {media.resourceType === "image" ? (
          <img
            src={URL.createObjectURL(media.file)}
            alt="preview"
            style={thumbStyle}
          />
        ) : (
          videoThumb(null)
        )}
        {nameSpan(media.file.name)}
        {resourceTypeSelect}
        {removeBtn}
      </div>
    );
  }

  // ② Existing server asset
  if (media?.url) {
    return (
      <div style={rowStyle}>
        {media.resourceType === "image" ? (
          <img
            src={media.url}
            alt="preview"
            style={thumbStyle}
            onClick={() => window.open(media.url, "_blank")}
          />
        ) : (
          videoThumb(() => window.open(media.url, "_blank"))
        )}
        {nameSpan(media.url.split("/").pop())}
        {resourceTypeSelect}
        {removeBtn}
      </div>
    );
  }

  // ③ Empty slot — show file input
  return (
    <div style={rowStyle}>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        style={{
          flex: 1,
          padding: "6px",
          borderRadius: "6px",
          border: "1px dashed var(--color-border)",
          background: "transparent",
          color: "var(--color-text)",
          fontSize: "12px",
        }}
      />
      {resourceTypeSelect}
      {removeBtn}
    </div>
  );
};

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

// ─── EditProfileModal ─────────────────────────────────────────────────────────
export default function EditProfileModal({
  profile,
  secret,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    FirstName: profile.FirstName || "",
    LastName: profile.LastName || "",
    JobRoles: profile.JobRoles || [],
    Bio: profile.Bio || "",
    YearsOfExperience: profile.YearsOfExperience || "",

    Skills:
      profile.Skills?.length > 0 ? profile.Skills : [{ Name: "", Rating: "" }],

    IndustryTools: profile.IndustryTools || [],

    Education:
      profile.Education?.length > 0
        ? profile.Education
        : [{ Degree: "", Institution: "", PassOutYear: "" }],

    WorkExperience:
      profile.WorkExperience?.length > 0
        ? profile.WorkExperience.map((exp) => ({
            CompanyName: exp.CompanyName || "",
            Role: exp.Role || "",
            StartDate: exp.StartDate || "",
            EndDate: exp.EndDate || "",
            Description: exp.Description || "",
            WorkLocation: exp.WorkLocation || "",
            KeySkills: Array.isArray(exp.KeySkills) ? exp.KeySkills : [],
          }))
        : [emptyExperience()],

    Hobbies: profile.Hobbies || [],

    Address: {
      Street: profile.Address?.Street || "",
      State: profile.Address?.State || "",
      Pin: profile.Address?.Pin || "",
      Country: profile.Address?.Country || "",
    },

    ContactInfo: {
      PhoneNo: profile.ContactInfo?.PhoneNo || "",
      Email: profile.ContactInfo?.Email || "",
      LinkedIn: profile.ContactInfo?.LinkedIn || "",
    },

    // ── File / media state ──────────────────────────────────────────────────
    // profilePicture / resume: { file: File|null, url: string, publicId: string }
    // A `file` value means the user picked a new file to upload.
    // No `file` means keep the existing Cloudinary asset.
    profilePicture: {
      file: null,
      url: profile.ProfilePicture?.url || "",
      publicId: profile.ProfilePicture?.publicId || "",
    },
    resume: {
      file: null,
      url: profile.Resume?.url || "",
      publicId: profile.Resume?.publicId || "",
      fileName: profile.Resume?.fileName || "",
    },

    // Projects: each project's Media array holds either
    //   { url, publicId, resourceType }  ← existing server asset
    //   { file: File, resourceType }     ← new upload pending
    Projects:
      profile.Projects?.length > 0
        ? profile.Projects.map((p) => ({
            Name: p.Name || "",
            Description: p.Description || "",
            Links: Array.isArray(p.Links) ? p.Links : [],
            Media: Array.isArray(p.Media)
              ? p.Media.map((m) => ({
                  file: null,
                  url: m.url || "",
                  publicId: m.publicId || "",
                  resourceType: m.resourceType || "image",
                }))
              : [],
          }))
        : [{ Name: "", Description: "", Links: [], Media: [] }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Generic helpers ───────────────────────────────────────────────────────
  const setNested = (path, value) => {
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

  const setArrItem = (arrName, idx, key, value) => {
    setForm((prev) => {
      const newArr = [...(prev[arrName] || [])];
      newArr[idx] = { ...newArr[idx], [key]: value };
      return { ...prev, [arrName]: newArr };
    });
  };

  const addItem = (arrName, emptyItem) =>
    setForm((prev) => ({
      ...prev,
      [arrName]: [...(prev[arrName] || []), emptyItem],
    }));

  const removeItem = (arrName, idx) =>
    setForm((prev) => ({
      ...prev,
      [arrName]: prev[arrName].filter((_, i) => i !== idx),
    }));

  // ── WorkExperience helpers ────────────────────────────────────────────────
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
    const arr = [...form.WorkExperience];
    arr[index] = { ...arr[index], [field]: value };
    setForm({ ...form, WorkExperience: arr });
  };

  // ── Project helpers ───────────────────────────────────────────────────────
  const addProject = () =>
    setForm({
      ...form,
      Projects: [
        ...form.Projects,
        { Name: "", Description: "", Links: [], Media: [] },
      ],
    });

  const removeProject = (index) =>
    setForm({ ...form, Projects: form.Projects.filter((_, i) => i !== index) });

  const updateProject = (index, field, value) => {
    const arr = [...form.Projects];
    arr[index] = { ...arr[index], [field]: value };
    setForm({ ...form, Projects: arr });
  };

  const addProjectMedia = (projIdx) => {
    const arr = [...form.Projects];
    arr[projIdx] = {
      ...arr[projIdx],
      Media: [
        ...arr[projIdx].Media,
        { file: null, url: "", publicId: "", resourceType: "image" },
      ],
    };
    setForm({ ...form, Projects: arr });
  };

  const removeProjectMedia = (projIdx, mediaIdx) => {
    const arr = [...form.Projects];
    arr[projIdx] = {
      ...arr[projIdx],
      Media: arr[projIdx].Media.filter((_, i) => i !== mediaIdx),
    };
    setForm({ ...form, Projects: arr });
  };

  const updateProjectMedia = (projIdx, mediaIdx, mediaData) => {
    const arr = [...form.Projects];
    const media = [...arr[projIdx].Media];
    media[mediaIdx] = { ...media[mediaIdx], ...mediaData };
    arr[projIdx] = { ...arr[projIdx], Media: media };
    setForm({ ...form, Projects: arr });
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      // Build a plain data object. profileService.updateProfile builds the
      // FormData from this, keeping the modal free of FormData logic.
      const payload = {
        FirstName: form.FirstName,
        LastName: form.LastName,
        Bio: form.Bio,
        YearsOfExperience: form.YearsOfExperience,
        JobRoles: form.JobRoles,
        IndustryTools: form.IndustryTools,
        Hobbies: form.Hobbies,
        Skills: form.Skills,
        Education: form.Education,
        WorkExperience: form.WorkExperience,
        Address: form.Address,
        ContactInfo: form.ContactInfo,
        Projects: form.Projects,
        // Pass File objects (or null to keep existing)
        profilePicture: form.profilePicture.file,
        resume: form.resume.file,
      };

      await updateProfile(profile.profileSlug, payload, secret);
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Update failed. Check your secret key.",
      );
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 9100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}>
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "740px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          color: "var(--color-text)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div
          style={{
            padding: "24px 40px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--color-text)",
            }}>
            Edit Profile
          </div>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "transparent",
              border: "none",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              padding: "8px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--color-border-muted)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div
          style={{ flex: 1, overflowY: "auto", padding: "0 40px 24px 40px" }}>
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
                onChange={(e) => setNested("FirstName", e.target.value)}
              />
            </Field>
            <Field label="Last Name">
              <input
                style={inputStyle}
                value={form.LastName}
                onChange={(e) => setNested("LastName", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Bio">
            <textarea
              style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
              value={form.Bio}
              onChange={(e) => setNested("Bio", e.target.value)}
            />
          </Field>
          <Field label="Years of Experience">
            <input
              style={inputStyle}
              type="number"
              value={form.YearsOfExperience}
              onChange={(e) => setNested("YearsOfExperience", e.target.value)}
            />
          </Field>

          <HR />

          {/* ── Media & Documents ───────────────────────────────────── */}
          <SectionHead>Media &amp; Documents</SectionHead>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "20px",
            }}>
            <FileUpload
              label="Profile Picture"
              accept="image/*"
              fileUrl={form.profilePicture.url}
              fileName={
                form.profilePicture.file?.name ||
                form.profilePicture.publicId?.split("/").pop()
              }
              onFileSelect={(file) =>
                setNested("profilePicture", {
                  ...form.profilePicture,
                  file,
                  url: URL.createObjectURL(file), // instant preview
                })
              }
            />
            <FileUpload
              label="Resume (PDF/DOC)"
              accept=".pdf,.doc,.docx"
              fileUrl={form.resume.url}
              fileName={
                form.resume.file?.name ||
                form.resume.fileName ||
                form.resume.publicId?.split("/").pop()
              }
              onFileSelect={(file) =>
                setNested("resume", {
                  ...form.resume,
                  file,
                  fileName: file.name,
                })
              }
            />
          </div>

          <HR />

          {/* ── Job Roles ────────────────────────────────────────────── */}
          <SectionHead>Job Roles</SectionHead>
          <ChipInput
            items={form.JobRoles}
            onChange={(newItems) => setForm({ ...form, JobRoles: newItems })}
          />

          <HR />

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

          <HR />

          {/* ── Industry Tools ───────────────────────────────────────── */}
          <SectionHead>Industry Tools</SectionHead>
          <ChipInput
            items={form.IndustryTools}
            onChange={(newItems) =>
              setForm({ ...form, IndustryTools: newItems })
            }
          />

          <HR />

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

          <HR />

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
                    placeholder="e.g. Google"
                  />
                </Field>
                <Field label="Job Role">
                  <input
                    style={inputStyle}
                    value={exp.Role}
                    onChange={(e) =>
                      updateExperience(i, "Role", e.target.value)
                    }
                    placeholder="e.g. Developer"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Field label="Start Date">
                  <DatePicker
                    id={`edit-start-${i}`}
                    value={exp.StartDate || ""}
                    onChange={(date) => updateExperience(i, "StartDate", date)}
                    max={exp.EndDate || undefined}
                    placeholder="Select start date"
                  />
                </Field>
                <Field label="End Date">
                  <DatePicker
                    id={`edit-end-${i}`}
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
                  placeholder="e.g. Remote"
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
                  placeholder="Brief description..."
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

          <HR />

          {/* ── Projects ─────────────────────────────────────────────── */}
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
                  placeholder="e.g. E-Commerce API"
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
                  placeholder="Brief project description..."
                />
              </Field>

              <Field label="Project Links">
                <ChipInput
                  items={proj.Links}
                  onChange={(newLinks) => updateProject(i, "Links", newLinks)}
                />
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    marginTop: "4px",
                  }}>
                  Add GitHub, Live Demo, Documentation links
                </div>
              </Field>

              <div style={{ marginTop: "12px" }}>
                <Label>Media (Images / Videos)</Label>
                {proj.Media.map((media, mi) => (
                  <ProjectMediaItem
                    key={mi}
                    media={media}
                    onFileSelect={(file, resourceType) =>
                      updateProjectMedia(i, mi, { file, resourceType })
                    }
                    onUpdate={(updated) => updateProjectMedia(i, mi, updated)}
                    onRemove={() => removeProjectMedia(i, mi)}
                  />
                ))}
                <button onClick={() => addProjectMedia(i)} style={addBtnStyle}>
                  <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Add
                  Media
                </button>
              </div>
            </div>
          ))}
          <button onClick={addProject} style={addBtnStyle}>
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Add
            Project
          </button>

          <HR />

          {/* ── Hobbies ───────────────────────────────────────────────── */}
          <SectionHead>Hobbies</SectionHead>
          <ChipInput
            items={form.Hobbies}
            onChange={(newItems) => setForm({ ...form, Hobbies: newItems })}
          />

          <HR />

          {/* ── Contact Info ─────────────────────────────────────────── */}
          <SectionHead>Contact Info</SectionHead>
          <Field label="Email">
            <input
              style={inputStyle}
              type="email"
              value={form.ContactInfo.Email}
              onChange={(e) => setNested("ContactInfo.Email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              style={inputStyle}
              value={form.ContactInfo.PhoneNo}
              onChange={(e) => setNested("ContactInfo.PhoneNo", e.target.value)}
            />
          </Field>
          <Field label="LinkedIn">
            <input
              style={inputStyle}
              value={form.ContactInfo.LinkedIn}
              onChange={(e) =>
                setNested("ContactInfo.LinkedIn", e.target.value)
              }
            />
          </Field>

          <HR />

          {/* ── Address ───────────────────────────────────────────────── */}
          <SectionHead>Address</SectionHead>
          <Field label="Street">
            <input
              style={inputStyle}
              value={form.Address.Street}
              onChange={(e) => setNested("Address.Street", e.target.value)}
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
                onChange={(e) => setNested("Address.State", e.target.value)}
              />
            </Field>
            <Field label="PIN">
              <input
                style={inputStyle}
                value={form.Address.Pin}
                onChange={(e) => setNested("Address.Pin", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Country">
            <input
              style={inputStyle}
              value={form.Address.Country}
              onChange={(e) => setNested("Address.Country", e.target.value)}
            />
          </Field>

          {/* ── Error ─────────────────────────────────────────────────── */}
          {error && (
            <p
              style={{
                color: "#ef4444",
                fontSize: "13px",
                marginBottom: "12px",
                background: "rgba(239, 68, 68, 0.1)",
                padding: "10px",
                borderRadius: "8px",
              }}>
              {error}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: "24px 40px",
            flexShrink: 0,
            background: "var(--color-bg)",
            borderTop: "1px solid var(--color-border)",
          }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                fontSize: "14px",
              }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                flex: 2,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "14px",
                opacity: loading ? 0.7 : 1,
              }}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
