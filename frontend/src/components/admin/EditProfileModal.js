"use client";
import React from "react";
import { useState } from "react";
import { updateProfile } from "@/services/profileService";
import DatePicker from "@/components/ui/DatePicker";

// Reusing styles with CSS Variables
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

// Chip Input Component with CSS Variables
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

  const removeItem = (itemToRemove) => {
    onChange(items.filter((item) => item !== itemToRemove));
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

    // FIXED: Normalize dates to strings, ensure KeySkills is array
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
        : [
            {
              CompanyName: "",
              Role: "",
              StartDate: "",
              EndDate: "",
              Description: "",
              WorkLocation: "",
              KeySkills: [],
            },
          ],

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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setNested = (path, value) => {
    const keys = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
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

  const addItem = (arrName, emptyItem) => {
    setForm((prev) => ({
      ...prev,
      [arrName]: [...(prev[arrName] || []), emptyItem],
    }));
  };

  const removeItem = (arrName, idx) => {
    setForm((prev) => ({
      ...prev,
      [arrName]: prev[arrName].filter((_, i) => i !== idx),
    }));
  };

  // ✅ HELPERS FOR WORK EXPERIENCE
  const addExperience = () => {
    setForm({
      ...form,
      WorkExperience: [
        ...form.WorkExperience,
        {
          CompanyName: "",
          Role: "",
          StartDate: "",
          EndDate: "",
          Description: "",
          WorkLocation: "",
          KeySkills: [],
        },
      ],
    });
  };

  const removeExperience = (index) => {
    setForm({
      ...form,
      WorkExperience: form.WorkExperience.filter((_, i) => i !== index),
    });
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...form.WorkExperience];
    newExp[index] = { ...newExp[index], [field]: value };
    setForm({ ...form, WorkExperience: newExp });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        YearsOfExperience: Number(form.YearsOfExperience),

        // Filter & format Skills
        Skills: form.Skills.filter((s) => s.Name).map((s) => ({
          ...s,
          Rating: Number(s.Rating),
        })),

        // Filter arrays
        IndustryTools: form.IndustryTools.filter(Boolean),
        Hobbies: form.Hobbies.filter(Boolean),
        JobRoles: form.JobRoles.filter(Boolean),

        // Filter & clean Education
        Education: form.Education.filter((e) => e.Degree),

        // ✅ Filter & clean WorkExperience with date string safety
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
      };

      await updateProfile(profile.profileSlug, payload, secret);
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Update failed. Check your secret key.",
      );
    } finally {
      setLoading(false);
    }
  };

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
      {/* ✅ MODAL CONTAINER - Flex Column for Sticky Header/Footer */}
      <div
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          color: "var(--color-text)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* ✅ HEADER - Fixed at Top (No Scroll, No Border) */}
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* ✅ SCROLLABLE CONTENT AREA */}
        <div
          style={{ flex: 1, overflowY: "auto", padding: "0 40px 24px 40px" }}>
          {/* --- Basic Info --- */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "16px",
              }}>
              Basic Info
            </div>

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
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid var(--color-border)",
              margin: "24px 0",
            }}
          />

          {/* --- Job Roles (Chips) --- */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "16px",
              }}>
              Job Roles
            </div>
            <ChipInput
              items={form.JobRoles}
              onChange={(newItems) => setForm({ ...form, JobRoles: newItems })}
            />
            <div
              style={{
                fontSize: "11px",
                color: "var(--color-text-muted)",
                marginTop: "6px",
              }}>
              Add roles like: Frontend Developer, UI Developer, React JS
              Developer
            </div>
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid var(--color-border)",
              margin: "24px 0",
            }}
          />

          {/* --- Skills --- */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "16px",
              }}>
              Skills
            </div>
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
              style={{
                background: "transparent",
                border: "1px dashed var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-text-muted)",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "13px",
                marginTop: "8px",
              }}>
              + Add Skill
            </button>
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid var(--color-border)",
              margin: "24px 0",
            }}
          />

          {/* --- Industry Tools (Chips) --- */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "16px",
              }}>
              Industry Tools
            </div>
            <ChipInput
              items={form.IndustryTools}
              onChange={(newItems) =>
                setForm({ ...form, IndustryTools: newItems })
              }
            />
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid var(--color-border)",
              margin: "24px 0",
            }}
          />

          {/* --- Education --- */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "16px",
              }}>
              Education
            </div>
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
                        setArrItem(
                          "Education",
                          i,
                          "PassOutYear",
                          ev.target.value,
                        )
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
              style={{
                background: "transparent",
                border: "1px dashed var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-text-muted)",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "13px",
                marginTop: "8px",
              }}>
              + Add Education
            </button>
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid var(--color-border)",
              margin: "24px 0",
            }}
          />

          {/* --- Work Experience --- */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "16px",
              }}>
              Work Experience
            </div>

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
                {/* Header with Remove */}
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

                {/* Company & Role */}
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

                {/* 📅 Start & End Date - Native Date Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Start Date */}
                  <Field label="Start Date">
                    <DatePicker
                      id={`start-date-${i}`}
                      value={exp.StartDate || ""}
                      onChange={(date) =>
                        updateExperience(i, "StartDate", date)
                      }
                      max={exp.EndDate || undefined}
                      placeholder="Select start date"
                    />
                  </Field>

                  {/* End Date */}
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

                {/* ✅ Currently Working Here Checkbox */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!exp.EndDate}
                      onChange={(e) => {
                        updateExperience(
                          i,
                          "EndDate",
                          e.target.checked ? "" : exp.EndDate,
                        );
                      }}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                    />
                    I currently work here
                  </label>
                </div>

                {/* Work Location */}
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

                {/* Description */}
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
                    placeholder="Brief description of your role and responsibilities..."
                  />
                </Field>

                {/* Key Skills (comma-separated) */}
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

            {/* Add Experience Button */}
            <button
              onClick={addExperience}
              style={{
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
              }}>
              <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
              Add Work Experience
            </button>
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid var(--color-border)",
              margin: "24px 0",
            }}
          />

          {/* --- Hobbies (Chips) --- */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "16px",
              }}>
              Hobbies
            </div>
            <ChipInput
              items={form.Hobbies}
              onChange={(newItems) => setForm({ ...form, Hobbies: newItems })}
            />
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid var(--color-border)",
              margin: "24px 0",
            }}
          />

          {/* --- Contact Info --- */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "16px",
              }}>
              Contact Info
            </div>
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
                onChange={(e) =>
                  setNested("ContactInfo.PhoneNo", e.target.value)
                }
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
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid var(--color-border)",
              margin: "24px 0",
            }}
          />

          {/* --- Address --- */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "16px",
              }}>
              Address
            </div>
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
          </div>

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

        {/* ✅ FOOTER - Fixed at Bottom (No Scroll, No Border) */}
        <div
          style={{
            padding: "24px 40px",
            flexShrink: 0,
            background: "var(--color-bg)",
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
