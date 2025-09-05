import { AppServer, AppSession, ViewType } from '@mentra/sdk';
import * as fs from 'fs';
import * as path from 'path';
import {MySessionInfo} from './session/sessioninfo.ts';
import { SessionManager } from './session/sessionmanager';


const PACKAGE_NAME = process.env.PACKAGE_NAME ?? (() => { throw new Error('PACKAGE_NAME is not set in .env file'); })();
const MENTRAOS_API_KEY = process.env.MENTRAOS_API_KEY ?? (() => { throw new Error('MENTRAOS_API_KEY is not set in .env file'); })();
const PORT = parseInt(process.env.PORT || '3000');
const sessionManager = new SessionManager(); 

class ExampleMentraOSApp extends AppServer {

  constructor() {
    super({
      packageName: PACKAGE_NAME,
      apiKey: MENTRAOS_API_KEY,
      port: PORT,
    });
  }

  protected async onSession(session: AppSession, sessionId: string, userId: string): Promise<void> {
    // Show welcome message
    session.layouts.showTextWall("Starting Pomodoro");
    const working_interval_length = session.settings.get<string>("working_interval_length", "25");
    const num_working_intervals = session.settings.get<string>("num_working_intervals", "4");
    const long_break_length = session.settings.get<string>("long_break_length", "20");
    const short_break_length = session.settings.get<string>("short_break_length", "5");
    const newSessionInfo: MySessionInfo = { minutes: 0, seconds: 0 };

    var textWallLeft = ""

    var textWallTimer = ""
    sessionManager.initializeSession(sessionId);

    sessionManager.setMinSec(sessionId, 0, 0);
    // Working intervals
    for (let i = 0; i < parseInt(num_working_intervals); i++) {
      textWallLeft = `Working Interval ${i + 1}\n`
      // Pomodoro time
      for (let j = parseInt(working_interval_length) * 60; j > 0; j--) {
        sessionManager.setMinSec(sessionId, Math.floor(j / 60), j % 60);
        const { minutes, seconds } = sessionManager.getMinSec(sessionId) || { minutes: 0, seconds: 0 };
        textWallTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        session.layouts.showTextWall(textWallLeft + textWallTimer);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      // Short break
      textWallLeft = `Short Break\n`
      for (let k = 0; k < parseInt(short_break_length) * 60; k++) {
        sessionManager.setMinSec(sessionId, Math.floor(k / 60), k % 60);
        const { minutes, seconds } = sessionManager.getMinSec(sessionId) || { minutes: 0, seconds: 0 };
        textWallTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        session.layouts.showTextWall(textWallLeft + textWallTimer);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    // Long break
    textWallLeft = `Long Break\n`
    for (let i = 0; i < parseInt(long_break_length) * 60; i++) {
      sessionManager.setMinSec(sessionId, Math.floor(i / 60), i % 60);
      const { minutes, seconds } = sessionManager.getMinSec(sessionId) || { minutes: 0, seconds: 0 };
      textWallTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      session.layouts.showTextWall(textWallLeft + textWallTimer);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Handle real-time transcription
    // requires microphone permission to be set in the developer console
    session.events.onTranscription((data) => {
      if (data.isFinal) {
        if (data.text.toLowerCase().includes("start pomodoro")) {
          session.layouts.showTextWall("Starting Pomodoro");
        }
      }
    })

  }
}


// Start the server
// DEV CONSOLE URL: https://console.mentra.glass/
// Get your webhook URL from ngrok (or whatever public URL you have)
const app = new ExampleMentraOSApp();

app.start().catch(console.error);