import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 4000);
const { app } = createApp(process.env.DATABASE_PATH ?? './qred.db');
app.listen(port, () => console.log(`Qred API listening on http://localhost:${port}`));