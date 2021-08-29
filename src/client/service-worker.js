/* eslint-disable */
export function register() {
  if (!__DEV__ && 'serviceWorker' in navigator) {
    window.self.__WB_DISABLE_DEV_LOGS = true;

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;

            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log(
                    'New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA.',
                  );

                  if (window.confirm(`New app update is available!. Click OK to refresh`)) {
                    window.location.reload();
                  }
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((err) => console.error(err.message));
  }
}
