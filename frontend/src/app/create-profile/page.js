"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SecretKeyGate from "@/components/admin/SecretKeyGate";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { createProfile } from "@/services/profileService";

// Dynamic styles using CSS variables
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

// Chip Input Component for Tools/Hobbies
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
            background: "#2a2a2a",
            color: "#fff",
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

const Label = ({ children }) => (
  <div
    style={{
      fontSize: "11px",
      color: "var(--color-text-muted)",
      letterSpacing: "1.2px",
      textTransform: "uppercase",
      fontWeight: 600,
      marginBottom: "6px",
    }}>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: "18px" }}>
    <Label>{label}</Label>
    {children}
  </div>
);

export default function CreateProfilePage() {
  const router = useRouter();
  const [secret, setSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    profileSlug: "",
    FirstName: "",
    LastName: "",
    CurrentJobRole: "",
    Bio: "",
    YearsOfExperience: "",
    Skills: [{ Name: "", Rating: "" }],
    IndustryTools: [], // Changed to empty array for chips
    Education: [{ Degree: "", Institution: "", PassOutYear: "" }],
    Hobbies: [], // Changed to empty array for chips
    Address: { Street: "", State: "", Pin: "", Country: "" },
    ContactInfo: { PhoneNo: "", Email: "", LinkedIn: "" },
  });

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

  const setArrItem = (arr, idx, key, value) => {
    const newArr = [...form[arr]];
    newArr[idx] = { ...newArr[idx], [key]: value };
    setForm({ ...form, [arr]: newArr });
  };

  const addItem = (arr, empty) =>
    setForm({ ...form, [arr]: [...form[arr], empty] });

  const removeItem = (arr, idx) =>
    setForm({ ...form, [arr]: form[arr].filter((_, i) => i !== idx) });

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
        Education: form.Education.filter((e) => e.Degree),
        Projects: [],
        WorkExperience: {},
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
            Redirecting to panel...
          </div>
        </div>
      </div>
    );
  }

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
          {/* Basic Info */}
          <div
            style={{
              fontSize: "13px",
              color: "#6366f1",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "20px",
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
          <Field label="Current Job Role">
            <input
              style={inputStyle}
              value={form.CurrentJobRole}
              onChange={(e) => set("CurrentJobRole", e.target.value)}
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

          <div
            style={{
              height: "1px",
              background: "var(--color-border)",
              margin: "28px 0",
            }}
          />

          {/* Skills */}
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
              marginBottom: "16px",
            }}>
            + Add Skill
          </button>

          <div
            style={{
              height: "1px",
              background: "var(--color-border)",
              margin: "20px 0",
            }}
          />

          {/* Industry Tools (Chips) */}
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

          <div
            style={{
              height: "1px",
              background: "var(--color-border)",
              margin: "20px 0",
            }}
          />

          {/* Education */}
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
              marginBottom: "16px",
            }}>
            + Add Education
          </button>

          <div
            style={{
              height: "1px",
              background: "var(--color-border)",
              margin: "20px 0",
            }}
          />

          {/* Hobbies (Chips) */}
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

          <div
            style={{
              height: "1px",
              background: "var(--color-border)",
              margin: "20px 0",
            }}
          />

          {/* Contact */}
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

          <div
            style={{
              height: "1px",
              background: "var(--color-border)",
              margin: "20px 0",
            }}
          />

          {/* Address */}
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
              {loading ? "Creating..." : "Create Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
