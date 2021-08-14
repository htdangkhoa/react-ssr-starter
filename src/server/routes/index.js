import { Router } from 'pure-http';

const router = Router('/api');

router.get('/health', (req, res) => res.status(200).send({ status: 'ok' }));

export default router;
