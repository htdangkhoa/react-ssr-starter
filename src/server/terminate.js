const terminate = (server) => {
  // Exit function
  const exit = (code) => {
    process.exit(code);
  };

  // eslint-disable-next-line no-unused-vars
  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here
      console.log(err.message, err.stack);
    }

    // Attempt a graceful shutdown
    server.close(exit);

    process.nextTick(exit);
  };
};

export default terminate;
