import { Server as ServerWebSocket } from 'ws';

const websocketServerCreator = (server) => {
  const wss = new ServerWebSocket({ server, path: '/ws' });

  return wss;
};

export default websocketServerCreator;
