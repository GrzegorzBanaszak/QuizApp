declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            ux_mode?: "popup" | "redirect";
            redirect_uri?: string;
            callback: (response: {
              code?: string;
              error?: string;
              error_description?: string;
            }) => void;
            error_callback?: (error: { type?: string; message?: string }) => void;
          }) => {
            requestCode: () => void;
          };
        };
      };
    };
  }
}

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) {
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
        if (window.google?.accounts?.oauth2) {
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
    script.onerror = () =>
      reject(new Error("Nie udało się załadować Google Sign-In."));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export async function requestGoogleAuthorizationCode(
  clientId: string,
): Promise<string> {
  await loadGoogleScript();

  const googleOauth = window.google?.accounts?.oauth2;
  if (!googleOauth) {
    throw new Error("Google Sign-In jest niedostępny.");
  }

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      if (settled) {
        return;
      }

      settled = true;
      reject(new Error("Przekroczono czas oczekiwania na logowanie Google."));
    }, 120000);

    const finishResolve = (value: string) => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timeoutId);
      resolve(value);
    };

    const finishReject = (error: Error) => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timeoutId);
      reject(error);
    };

    const codeClient = googleOauth.initCodeClient({
      client_id: clientId,
      scope: "openid email profile",
      ux_mode: "popup",
      redirect_uri: window.location.origin,
      callback: (response) => {
        if (response.error) {
          finishReject(
            new Error(
              response.error_description ?? response.error ?? "Google auth error.",
            ),
          );
          return;
        }

        if (!response.code) {
          finishReject(new Error("Nie otrzymano kodu autoryzacji Google."));
          return;
        }

        finishResolve(response.code);
      },
      error_callback: (error) => {
        finishReject(
          new Error(error.message ?? error.type ?? "Google auth error."),
        );
      },
    });

    codeClient.requestCode();
  });
}
