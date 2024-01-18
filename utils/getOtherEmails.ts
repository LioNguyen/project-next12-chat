export const getOtherEmails = (users: [], currentUser: any) => {
  if (!currentUser || !currentUser?.email) return [];

  return users?.filter((user) => user !== currentUser?.email)[0] || "";
};
