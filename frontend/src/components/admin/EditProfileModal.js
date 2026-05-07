"use client";
import { useState } from "react";
import { updateProfile } from "@/services/profileService";

// Reusing styles with CSS Variables
const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg)", // Dynamic BG
  color: "var(--color-text)", // Dynamic Text
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const Label = ({ children }) => (
  <div
    style={{
      color: "var(--color-text-muted)", // Dynamic Muted Text
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
        background: "var(--color-bg)", // Dynamic BG
        minHeight: "50px",
        alignItems: "center",
      }}>
      {items.map((item, index) => (
        <span
          key={index}
          style={{
            background: "var(--color-border)", // Using border color as chip bg usually works well in both modes, or a specific var(--color-chip-bg)
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
    CurrentJobRole: profile.CurrentJobRole || "",
    Bio: profile.Bio || "",
    YearsOfExperience: profile.YearsOfExperience || "",

    Skills:
      profile.Skills && profile.Skills.length > 0
        ? profile.Skills
        : [{ Name: "", Rating: "" }],

    IndustryTools: profile.IndustryTools || [],

    Education:
      profile.Education && profile.Education.length > 0
        ? profile.Education
        : [{ Degree: "", Institution: "", PassOutYear: "" }],

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

  const handleSave = async () => {
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
        Education: form.Education.filter((e) => e.Degree),
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
      <div
        style={{
          background: "var(--color-bg)", // Dynamic Modal BG
          border: "1px solid var(--color-border)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "40px",
          position: "relative",
          color: "var(--color-text)",
        }}
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "var(--color-bg)", // Button BG
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            color: "var(--color-text-muted)",
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: "13px",
            zIndex: 10,
          }}>
          ✕
        </button>

        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: "24px",
            paddingRight: "40px",
          }}>
          Edit Profile
        </div>

        {/* --- Basic Info --- */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "13px",
              color: "#6366f1", // Accent
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

          <Field label="Current Job Role">
            <input
              style={inputStyle}
              value={form.CurrentJobRole}
              onChange={(e) => setNested("CurrentJobRole", e.target.value)}
            />
          </Field>

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
                background: "var(--color-bg)", // Nested Item BG
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

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
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
  );
}
