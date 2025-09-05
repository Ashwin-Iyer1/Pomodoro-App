import { AppServer, AppSession, ViewType } from '@mentra/sdk';
import * as fs from 'fs';
import * as path from 'path';


const PACKAGE_NAME = process.env.PACKAGE_NAME ?? (() => { throw new Error('PACKAGE_NAME is not set in .env file'); })();
const MENTRAOS_API_KEY = process.env.MENTRAOS_API_KEY ?? (() => { throw new Error('MENTRAOS_API_KEY is not set in .env file'); })();
const PORT = parseInt(process.env.PORT || '3000');

class ExampleMentraOSApp extends AppServer {

  constructor() {
    super({
      packageName: PACKAGE_NAME,
      apiKey: MENTRAOS_API_KEY,
      port: PORT,
    });
  }
  protected async onSession(session: AppSession, sessionId: string, userId: string): Promise<void> {
    // convert bitmap to base64
      const imagePath = path.join(__dirname, `./nokia.bmp`);
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBase64 = imageBuffer.toString('base64');
      session.logger.info(`Generated Bitmap Base64: ${imageBase64}`);

      const myText = "Nokia by Drake";
      const myTextBase64 = Buffer.from(myText).toString('base64');
      session.logger.info(`Generated Text Base64: ${myTextBase64}`);

      session.layouts.showBitmapView(imageBase64);
      session.dashboard.content.writeToMain('Your text content');


      // session.layouts.showTextWall(myTextBase64, {
      //   view: ViewType.MAIN,
      //   durationMs: 3000
      // });



    // // Subscribe to audio chunk stream
    // await session.subscribe('AUDIO_CHUNK');

    // // Buffer to store audio chunks
    // const audioChunks: Buffer[] = [];

    // // Register handler for audio chunks
    // const unsubscribe = session.events.onAudioChunk((data) => {
    //   // Log the AudioChunk object to inspect its structure
    //   session.logger.info('AudioChunk received:', data);
    //   // ...existing code...
    // });

    // // Example: Save audio after 10 seconds (replace with session end logic as needed)
    // setTimeout(() => {
    //   if (audioChunks.length > 0) {
    //     const audioBuffer = Buffer.concat(audioChunks);
    //     const audioFilePath = path.join(__dirname, `recorded_audio.raw`); // Use .wav if you have header info
    //     fs.writeFileSync(audioFilePath, audioBuffer);
    //     session.logger.info(`Saved audio to ${audioFilePath}`);
    //   }
    //   unsubscribe();
    // }, 10000);
  }
}

// Start the server
// DEV CONSOLE URL: https://console.mentra.glass/
// Get your webhook URL from ngrok (or whatever public URL you have)
const app = new ExampleMentraOSApp();

app.start().catch(console.error);