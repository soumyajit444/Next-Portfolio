import axiosInstance from "./axiosInstance"; // adjust path as needed

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

/** Appends a primitive array as indexed multipart fields: name[0], name[1] … */
function appendPrimitiveArray(fd, name, arr = []) {
  arr.forEach((val, i) => fd.append(`${name}[${i}]`, val ?? ""));
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE  – multipart/form-data
// All arrays / objects use indexed bracket notation (matches the CREATE curl).
// ─────────────────────────────────────────────────────────────────────────────
export const createProfile = async (data, secret) => {
  const formData = new FormData();

  // ── Scalars ───────────────────────────────────────────────────────────────
  formData.append("profileSlug", data.profileSlug || "");
  formData.append("FirstName", data.FirstName || "");
  formData.append("LastName", data.LastName || "");
  formData.append("Bio", data.Bio || "");
  formData.append("YearsOfExperience", String(data.YearsOfExperience || ""));

  // ── Top-level file uploads ────────────────────────────────────────────────
  if (data.profilePicture instanceof File)
    formData.append("profilePicture", data.profilePicture);
  if (data.resume instanceof File) formData.append("resume", data.resume);

  // ── Primitive arrays ──────────────────────────────────────────────────────
  appendPrimitiveArray(formData, "JobRoles", data.JobRoles);
  appendPrimitiveArray(formData, "IndustryTools", data.IndustryTools);
  appendPrimitiveArray(formData, "Hobbies", data.Hobbies);

  // ── Skills ────────────────────────────────────────────────────────────────
  (data.Skills || []).forEach((s, i) => {
    formData.append(`Skills[${i}][Name]`, s.Name || "");
    formData.append(`Skills[${i}][Rating]`, String(s.Rating || ""));
  });

  // ── Education ─────────────────────────────────────────────────────────────
  (data.Education || []).forEach((e, i) => {
    formData.append(`Education[${i}][Degree]`, e.Degree || "");
    formData.append(`Education[${i}][Institution]`, e.Institution || "");
    formData.append(
      `Education[${i}][PassOutYear]`,
      String(e.PassOutYear || ""),
    );
  });

  // ── WorkExperience ────────────────────────────────────────────────────────
  (data.WorkExperience || []).forEach((exp, i) => {
    formData.append(`WorkExperience[${i}][CompanyName]`, exp.CompanyName || "");
    formData.append(`WorkExperience[${i}][Role]`, exp.Role || "");
    formData.append(`WorkExperience[${i}][StartDate]`, exp.StartDate || "");
    formData.append(`WorkExperience[${i}][EndDate]`, exp.EndDate || "");
    formData.append(`WorkExperience[${i}][Description]`, exp.Description || "");
    formData.append(
      `WorkExperience[${i}][WorkLocation]`,
      exp.WorkLocation || "",
    );
    (exp.KeySkills || []).forEach((skill, j) =>
      formData.append(`WorkExperience[${i}][KeySkills][${j}]`, skill),
    );
  });

  // ── Projects + project media ──────────────────────────────────────────────
  const projectMediaMeta = [];
  (data.Projects || []).forEach((proj, i) => {
    formData.append(`Projects[${i}][Name]`, proj.Name || "");
    formData.append(`Projects[${i}][Description]`, proj.Description || "");
    (proj.Links || []).forEach((link, j) =>
      formData.append(`Projects[${i}][Links][${j}]`, link),
    );
    (proj.media || []).forEach((file) => {
      if (file instanceof File) {
        formData.append("projectMedia", file);
        projectMediaMeta.push({
          projectIndex: i,
          resourceType: file.type.startsWith("video/") ? "video" : "image",
        });
      }
    });
  });
  if (projectMediaMeta.length > 0)
    formData.append("projectMediaMeta", JSON.stringify(projectMediaMeta));

  // ── Address & ContactInfo ─────────────────────────────────────────────────
  formData.append("Address[Street]", data.Address?.Street || "");
  formData.append("Address[State]", data.Address?.State || "");
  formData.append("Address[Pin]", data.Address?.Pin || "");
  formData.append("Address[Country]", data.Address?.Country || "");

  formData.append("ContactInfo[PhoneNo]", data.ContactInfo?.PhoneNo || "");
  formData.append("ContactInfo[Email]", data.ContactInfo?.Email || "");
  formData.append("ContactInfo[LinkedIn]", data.ContactInfo?.LinkedIn || "");

  const response = await axiosInstance.post(
    `/api/profile?secret=${secret}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE  – multipart/form-data
//
// The backend UPDATE controller does:
//   updateData = { ...req.body }          ← multer spreads all text fields
//   JSON.parse(updateData.Projects)       ← Projects must be a JSON string
//
// To avoid multer deep-parse issues with nested arrays (WorkExperience,
// Skills, Education, Address, ContactInfo) we send ALL complex fields as
// JSON strings, exactly like the original EditProfileModal did.
// Only primitive scalars, file binaries, and the projectMediaMeta are
// treated differently.
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = async (slug, data, secret) => {
  const formData = new FormData();

  // ── Scalars ───────────────────────────────────────────────────────────────
  formData.append("FirstName", data.FirstName || "");
  formData.append("LastName", data.LastName || "");
  formData.append("Bio", data.Bio || "");
  formData.append("YearsOfExperience", String(data.YearsOfExperience || 0));

  // ── Arrays of primitives → JSON strings ──────────────────────────────────
  formData.append(
    "JobRoles",
    JSON.stringify((data.JobRoles || []).filter(Boolean)),
  );
  formData.append(
    "IndustryTools",
    JSON.stringify((data.IndustryTools || []).filter(Boolean)),
  );
  formData.append(
    "Hobbies",
    JSON.stringify((data.Hobbies || []).filter(Boolean)),
  );

  // ── Complex arrays → JSON strings ────────────────────────────────────────
  formData.append(
    "Skills",
    JSON.stringify(
      (data.Skills || [])
        .filter((s) => s.Name)
        .map((s) => ({ ...s, Rating: Number(s.Rating) || 0 })),
    ),
  );

  formData.append(
    "Education",
    JSON.stringify((data.Education || []).filter((e) => e.Degree)),
  );

  formData.append(
    "WorkExperience",
    JSON.stringify(
      (data.WorkExperience || [])
        .filter((exp) => exp.CompanyName || exp.Role)
        .map((exp) => ({
          ...exp,
          StartDate: exp.StartDate || "",
          EndDate: exp.EndDate || "",
          KeySkills: (exp.KeySkills || []).filter(Boolean),
        })),
    ),
  );

  formData.append("Address", JSON.stringify(data.Address || {}));
  formData.append("ContactInfo", JSON.stringify(data.ContactInfo || {}));

  // ── Projects → JSON string ────────────────────────────────────────────────
  // Strip File objects — new media is handled separately via projectMedia.
  // Existing server assets (url + publicId) are preserved in the JSON so
  // the backend knows to keep them.
  const filteredProjects = (data.Projects || []).filter(
    (p) => p.Name || p.Description,
  );
  const projectsPayload = filteredProjects.map((p) => ({
    Name: p.Name || "",
    Description: p.Description || "",
    Links: (p.Links || []).filter(Boolean),
    Media: (p.Media || [])
      .filter((m) => m.url && m.publicId) // existing uploads only
      .map((m) => ({
        url: m.url,
        publicId: m.publicId,
        resourceType: m.resourceType || "image",
      })),
  }));
  formData.append("Projects", JSON.stringify(projectsPayload));

  // ── New project media files ───────────────────────────────────────────────
  const projectMediaMeta = [];
  filteredProjects.forEach((proj, projIdx) => {
    (proj.Media || []).forEach((media) => {
      if (media.file instanceof File) {
        formData.append("projectMedia", media.file);
        projectMediaMeta.push({
          projectIndex: projIdx,
          resourceType: media.resourceType || "image",
        });
      }
    });
  });
  if (projectMediaMeta.length > 0)
    formData.append("projectMediaMeta", JSON.stringify(projectMediaMeta));

  // ── New file uploads (only when the user picked a new file) ──────────────
  // Sending nothing means the backend controller's  `if (req.files?.profilePicture?.[0])`
  // branch is skipped and the existing Cloudinary asset is untouched.
  if (data.profilePicture instanceof File)
    formData.append("profilePicture", data.profilePicture);
  if (data.resume instanceof File) formData.append("resume", data.resume);

  const response = await axiosInstance.put(
    `/api/profile/${slug}?secret=${secret}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────
export const deleteProfile = async (slug, secret) => {
  const response = await axiosInstance.delete(
    `/api/profile/${slug}?secret=${secret}`,
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────────────────────
export const getProfileDetails = async (slug) => {
  const response = await axiosInstance.get(`/api/profile/${slug}`);
  return response.data;
};

export const getAllProfiles = async () => {
  const response = await axiosInstance.get("/api/profile/");
  return response.data;
};
