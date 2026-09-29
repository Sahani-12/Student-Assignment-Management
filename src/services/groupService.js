import { getGroups, saveGroups, getUsers } from '../utils/storage';

export const groupService = {
  getGroupsByCourse: (courseId) => {
    const groups = getGroups();
    return groups.filter((g) => g.courseId === courseId);
  },

  getGroupById: (groupId) => {
    const groups = getGroups();
    return groups.find((g) => g.id === groupId) || null;
  },

  getStudentGroup: (courseId, studentId) => {
    const groups = getGroups();
    return (
      groups.find(
        (g) => g.courseId === courseId && g.memberIds?.includes(studentId)
      ) || null
    );
  },

  getGroupWithMembers: (groupId) => {
    const groups = getGroups();
    const group = groups.find((g) => g.id === groupId);
    if (!group) return null;

    const allUsers = getUsers();
    const members = (group.memberIds || []).map((id) => {
      const u = allUsers.find((user) => user.id === id);
      return {
        id,
        name: u?.name || 'Student',
        email: u?.email || '',
        rollNo: u?.rollNo || '',
        isLeader: id === group.leaderId,
      };
    });

    return {
      ...group,
      members,
    };
  },

  createGroup: ({ name, courseId, leaderId, leaderName }) => {
    const groups = getGroups();
    const newGroup = {
      id: `group-${Date.now()}`,
      name: name.trim(),
      courseId,
      leaderId,
      leaderName,
      memberIds: [leaderId],
      createdAt: new Date().toISOString(),
    };
    const updated = [...groups, newGroup];
    saveGroups(updated);
    return newGroup;
  },

  joinGroup: (groupId, studentId) => {
    const groups = getGroups();
    const index = groups.findIndex((g) => g.id === groupId);
    if (index === -1) return null;

    const group = { ...groups[index] };
    if (!group.memberIds.includes(studentId)) {
      group.memberIds = [...group.memberIds, studentId];
    }

    const updated = [...groups];
    updated[index] = group;
    saveGroups(updated);
    return group;
  },
};
