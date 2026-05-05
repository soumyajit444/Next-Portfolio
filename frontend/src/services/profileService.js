import axiosInstance from "./axiosInstance";

export const createProfile = async (data, secret) => {
  const response = await axiosInstance.post(
    `/api/profile?secret=${secret}`,
    data,
  );
  return response.data;
};

export const updateProfile = async (slug, data, secret) => {
  const response = await axiosInstance.put(
    `/api/profile/${slug}?secret=${secret}`,
    data,
  );
  return response.data;
};

export const deleteProfile = async (slug, secret) => {
  const response = await axiosInstance.delete(
    `/api/profile/${slug}?secret=${secret}`,
  );
  return response.data;
};

// Get Single Profile Details
export const getProfileDetails = async (slug) => {
  const response = await axiosInstance.get(`/api/profile/${slug}`);
  return response.data;
};

// Get All Profiles
export const getAllProfiles = async () => {
  const response = await axiosInstance.get("/api/profile/");
  return response.data;
};
