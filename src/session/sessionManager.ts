import { MySessionInfo } from "./sessioninfo";
interface SessionEntry {
  info: MySessionInfo;
}

export class SessionManager {
    private activeSessions: Map<string, SessionEntry> = new Map();

  /**
   * Initializes a new session with a starting state and data.
   * Retrieves the initial settings internally via the SettingsManager.
   * @param sessionId The unique identifier of the session.
   * @param initialState The initial state for the session.
   * @param userId Optional identifier of the user.
   * @returns The created MySessionInfo.
   */
public initializeSession(sessionId: string): MySessionInfo { 
  const newSessionInfo: MySessionInfo = {
      minutes: 0,
      seconds: 0,
      sessionId: sessionId
  };
  this.activeSessions.set(sessionId, { info: newSessionInfo }); // <-- Add this line
  return newSessionInfo;
}

public setMinSec(sessionId: string, min: number, sec: number) {
    const info = this.activeSessions.get(sessionId)?.info;
    if (info) {
      info.minutes = min;
      info.seconds = sec;
        }
    }

    public getMinSec(sessionId: string): { minutes: number; seconds: number } | undefined {
    const info = this.activeSessions.get(sessionId)?.info;
    if (info) {
      return { minutes: info.minutes, seconds: info.seconds };
    }
    return undefined;
  }

};
