// SVG Faceless Avatars for Male, Female, and Third Gender (Other/Non-binary)

export const MALE_SVG_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="%231b3b2b"/><circle cx="64" cy="46" r="22" fill="%23e2ece9"/><path d="M42 42c0-14 10-24 22-24s22 10 22 24c0 3-1 7-2 9-4-10-12-14-20-14s-16 4-20 14c-1-2-2-6-2-9z" fill="%230f241a"/><path d="M64 74c-22 0-38 12-42 28a64 64 0 0 0 84 0c-4-16-20-28-42-28z" fill="%23c5d8d1"/></svg>`;

export const FEMALE_SVG_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="%23c85a32"/><path d="M40 50c0-18 11-28 24-28s24 10 24 28c0 18-5 36-9 42h-30c-4-6-9-24-9-42z" fill="%237a280c"/><circle cx="64" cy="48" r="20" fill="%23faeae2"/><path d="M64 74c-22 0-38 12-42 28a64 64 0 0 0 84 0c-4-16-20-28-42-28z" fill="%23f2d2c4"/></svg>`;

export const OTHER_SVG_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="%231d7a82"/><path d="M44 44c0-14 9-22 20-22s20 8 20 22v12h-40v-12z" fill="%230d4247"/><circle cx="64" cy="46" r="20" fill="%23e8f6f7"/><path d="M64 74c-22 0-38 12-42 28a64 64 0 0 0 84 0c-4-16-20-28-42-28z" fill="%23bde2e6"/></svg>`;

export const getDefaultAvatar = (gender?: string): string => {
  if (gender === 'female') return FEMALE_SVG_AVATAR;
  if (gender === 'male') return MALE_SVG_AVATAR;
  return OTHER_SVG_AVATAR;
};

export const getUserAvatar = (user?: { avatar?: string; gender?: string } | null): string => {
  if (!user) return OTHER_SVG_AVATAR;
  if (user.avatar && user.avatar.trim() && !user.avatar.includes('unsplash.com')) {
    return user.avatar;
  }
  return getDefaultAvatar(user.gender);
};
