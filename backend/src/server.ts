import { createApp } from './app.js';
import { createDatabase } from './database.js';
import { OverviewRepository } from './repository.js';

const port = Number(process.env.PORT ?? 3001);
const app = createApp(new OverviewRepository(await createDatabase()));

app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
