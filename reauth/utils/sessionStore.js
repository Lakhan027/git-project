// utils/sessionStore.js
import { randomUUID } from 'crypto';

const sessionStore = {
  sessions: {},

  createSession(userId, userName) {
    const sessionId = randomUUID();
    sessionStore.sessions[sessionId] = {
      userId,
      name: userName,
    };
    return sessionId;
  },

  getUserFromSession(sessionId) {
    return sessionStore.sessions[sessionId] || null;
  },

  destroySession(sessionId) {
    delete sessionStore.sessions[sessionId];
    
  },

  printSessions() {
    console.log('Current Sessions:', sessionStore.sessions);
  },
};

export default sessionStore;
