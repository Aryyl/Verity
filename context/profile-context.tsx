"use client";

import React, { createContext, useContext, useState } from "react";

interface ProfileData {
  name: string;
  role: string;
  email: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: { name: "Daniel Rivera", role: "Senior Analyst", email: "d.rivera@mediarights.ai" },
  updateProfile: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>({
    name: "Daniel Rivera",
    role: "Senior Analyst",
    email: "d.rivera@mediarights.ai",
  });

  const updateProfile = (data: Partial<ProfileData>) =>
    setProfile((prev) => ({ ...prev, ...data }));

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
