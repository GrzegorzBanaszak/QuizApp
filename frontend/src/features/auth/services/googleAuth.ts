declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (callback?: (notification: any) => void) => void;
        };
      };
    };
  }
}

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      const poll = window.setInterval(() => {
        if (window.google?.accounts?.id) {
          window.clearInterval(poll);
          resolve();
        }
      }, 50);

      window.setTimeout(() => {
        window.clearInterval(poll);
        reject(new Error("Google Identity Services did not initialize."));
      }, 5000);

      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Nie udało się załadować Google Sign-In."));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export async function requestGoogleIdToken(clientId: string): Promise<string> {
  await loadGoogleScript();

  const googleId = window.google?.accounts?.id;
  if (!googleId) {
    throw new Error("Google Sign-In jest niedostępny.");
  }

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error("Przekroczono czas oczekiwania na logowanie Google."));
    }, 120000);

    const finishResolve = (value: string) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve(value);
    };

    const finishReject = (value: Error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      reject(value);
    };

    googleId.initialize({
      client_id: clientId,
      auto_select: false,
      cancel_on_tap_outside: false,
      callback: (response) => {
        if (!response.credential) {
          finishReject(new Error("Nie otrzymano id_token z Google."));
          return;
        }

        finishResolve(response.credential);
      },
    });

    googleId.prompt((notification: any) => {
      if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
        const reason =
          notification?.getNotDisplayedReason?.() ??
          notification?.getSkippedReason?.() ??
          "Google prompt was not displayed.";
        finishReject(new Error(String(reason)));
      }
    });
  });
}
