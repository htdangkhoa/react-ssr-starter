import serverConfig from 'configs/server';
import app from './app';
import terminate from './terminate';

app.listen(serverConfig.PORT);

const exitHandler = terminate(app);

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));
