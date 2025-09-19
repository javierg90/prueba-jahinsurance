import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import apiRoutes from './routes';

/* eslint-disable @typescript-eslint/no-var-requires */
const db = require('../db/models'); // 
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());


app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/v1', apiRoutes);


const port = Number(process.env.PORT || 3000);


(async () => {
    try {
        await db.sequelize.authenticate();
        console.log('DB OK');
        app.listen(port, () => console.log(`API running at http://localhost:${port}`));
    } catch (e) {
        console.error('DB connection error', e);
        process.exit(1);
    }
})();