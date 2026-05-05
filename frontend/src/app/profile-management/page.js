"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SecretKeyGate from "@/components/admin/SecretKeyGate";
import ThemeToggle from "@/components/ui/ThemeToggle"; // Adjust path
import ProfileCard from "@/components/admin/ProfileCard";
import ProfileModal from "@/components/admin/ProfileModal";
import EditProfileModal from "@/components/admin/EditProfileModal";
import { getAllProfiles, deleteProfile } from "@/services/profileService";

export default function ProfileManagementPage() {
  const [secret, setSecret] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewProfile, setViewProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllProfiles();
      setProfiles(Array.isArray(data) ? data : data.profiles || []);
    } catch {
      setError("Failed to load profiles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (secret) fetchProfiles();
  }, [secret, fetchProfiles]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteProfile(deleteTarget.profileSlug, secret);
      showToast("Profile deleted successfully.");
      setDeleteTarget(null);
      fetchProfiles();
    } catch {
      showToast("Delete failed. Check your secret key.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!secret) return <SecretKeyGate onUnlock={setSecret} />;

  return (
    <div
      style={{
        minHeight: "100vh",

        padding: "40px 24px",
        fontFamily: "'DM Sans', sans-serif",
        color: "var(--color-text)", // Dynamic Text
      }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 9999,
            padding: "14px 22px",
            borderRadius: "12px",
            background:
              toast.type === "error"
                ? "rgba(239, 68, 68, 0.1)"
                : "rgba(34, 197, 94, 0.1)",
            border: `1px solid ${toast.type === "error" ? "#ef4444" : "#22c55e"}`,
            color: toast.type === "error" ? "#ef4444" : "#22c55e",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "var(--card-shadow)",
          }}>
          {toast.type === "error" ? "❌ " : "✅ "}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "48px",
            flexWrap: "wrap",
            gap: "16px",
          }}>
          <div>
            <div
              style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}>
              Admin Panel
            </div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 800,
                margin: 0,
                letterSpacing: "-1px",
              }}>
              Profile Management
            </h1>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {/* Theme Toggle */}
            <ThemeToggle />

            <Link
              href="/create-profile"
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
                display: "inline-block",
              }}>
              + Create Profile
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "14px",
            padding: "20px 28px",
            marginBottom: "36px",
            display: "flex",
            gap: "32px",
            boxShadow: "var(--card-shadow)",
          }}>
          <div>
            <div
              style={{ fontSize: "28px", fontWeight: 800, color: "#6366f1" }}>
              {profiles.length}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                marginTop: "2px",
              }}>
              Total Profiles
            </div>
          </div>
        </div>

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "var(--color-text-muted)",
            }}>
            Loading profiles...
          </div>
        )}
        {error && (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
            {error}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
              gap: "20px",
            }}>
            {profiles.map((p, i) => (
              <ProfileCard
                key={p.profileSlug || i}
                profile={p}
                onView={setViewProfile}
                onEdit={setEditProfile}
                onDelete={setDeleteTarget}
              />
            ))}
            {profiles.length === 0 && (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "80px 20px",
                  color: "var(--color-text-muted)",
                }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗂️</div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}>
                  No profiles yet
                </div>
                <Link
                  href="/create-profile"
                  style={{
                    color: "#6366f1",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}>
                  Create your first profile →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {viewProfile && (
        <ProfileModal
          profile={viewProfile}
          onClose={() => setViewProfile(null)}
        />
      )}
      {editProfile && (
        <EditProfileModal
          profile={editProfile}
          secret={secret}
          onClose={() => setEditProfile(null)}
          onSuccess={() => {
            showToast("Profile updated!");
            fetchProfiles();
          }}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(6px)",
          }}>
          <div
            style={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "36px",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
              color: "var(--color-text)",
            }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "10px",
              }}>
              Delete Profile?
            </div>
            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: "14px",
                marginBottom: "28px",
              }}>
              Are you sure you want to delete{" "}
              <strong style={{ color: "var(--color-text)" }}>
                {deleteTarget.Name || deleteTarget.FirstName}
              </strong>
              ? This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setDeleteTarget(null)}
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
                onClick={handleDelete}
                disabled={deleteLoading}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  opacity: deleteLoading ? 0.7 : 1,
                }}>
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
