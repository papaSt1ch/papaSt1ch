
import { Build, Comment, ActivityItem } from '../types';

const BUILDS_KEY = 'motoengine_builds';
const COMMENTS_KEY = 'motoengine_comments';
const ACTIVITY_KEY = 'motoengine_activities';

export const buildStore = {
  getBuilds: (): Build[] => {
    const data = localStorage.getItem(BUILDS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveBuild: (build: Omit<Build, 'id' | 'createdAt' | 'likes'>): Build => {
    const builds = buildStore.getBuilds();
    const newBuild: Build = {
      ...build,
      id: `build_${Math.random().toString(36).substr(2, 9)}`,
      likes: [],
      createdAt: new Date().toISOString()
    };
    builds.push(newBuild);
    localStorage.setItem(BUILDS_KEY, JSON.stringify(builds));
    
    buildStore.addActivity({
      userId: build.userId,
      userName: build.userName,
      type: 'NEW_BUILD',
      targetId: newBuild.id,
      targetName: newBuild.name
    });

    return newBuild;
  },

  getComments: (targetId: string): Comment[] => {
    const data = localStorage.getItem(COMMENTS_KEY);
    const all: Comment[] = data ? JSON.parse(data) : [];
    return all.filter(c => c.targetId === targetId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  },

  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>): Comment => {
    const data = localStorage.getItem(COMMENTS_KEY);
    const all: Comment[] = data ? JSON.parse(data) : [];
    const newComment: Comment = {
      ...comment,
      id: `comm_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    all.push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
    return newComment;
  },

  getActivities: (): ActivityItem[] => {
    const data = localStorage.getItem(ACTIVITY_KEY);
    return data ? JSON.parse(data) : [];
  },

  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const activities = buildStore.getActivities();
    const newItem: ActivityItem = {
      ...activity,
      id: `act_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    activities.unshift(newItem);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities.slice(0, 100)));
  },

  toggleLike: (buildId: string, userId: string) => {
    const builds = buildStore.getBuilds();
    const idx = builds.findIndex(b => b.id === buildId);
    if (idx === -1) return;
    
    const likes = builds[idx].likes || [];
    if (likes.includes(userId)) builds[idx].likes = likes.filter(id => id !== userId);
    else builds[idx].likes = [...likes, userId];
    
    localStorage.setItem(BUILDS_KEY, JSON.stringify(builds));
  }
};
