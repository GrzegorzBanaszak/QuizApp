declare global {
  interface Window {
    FB?: {
      init: (config: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          status?: string;
          authResponse?: { accessToken?: string };
        }) => void,
        options?: { scope?: string; auth_type?: string },
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

let facebookScriptPromise: Promise<void> | null = null;

function loadFacebookScript(appId: string): Promise<void> {
  if (window.FB?.login) {
    return Promise.resolve();
  }

  if (facebookScriptPromise) {
    return facebookScriptPromise;
  }

  facebookScriptPromise = new Promise((resolve, reject) => {
    window.fbAsyncInit = () => {
      if (!window.FB) {
        reject(new Error("Facebook SDK is unavailable."));
        return;
      }

      window.FB.init({
        appId,
        cookie: true,
        xfbml: false,
        version: "v19.0",
      });

      resolve();
    };

    const existingScript = document.querySelector(
      'script[src="https://connect.facebook.net/en_US/sdk.js"]',
    );

    if (existingScript) {
      if (window.FB?.login) {
        resolve();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onerror = () =>
      reject(new Error("Nie udało się załadować Facebook SDK."));
    document.body.appendChild(script);
  });

  return facebookScriptPromise;
}

export async function requestFacebookAccessToken(
  appId: string,
): Promise<string> {
  await loadFacebookScript(appId);

  const facebook = window.FB;
  if (!facebook) {
    throw new Error("Facebook SDK jest niedostępny.");
  }

  return new Promise<string>((resolve, reject) => {
    facebook.login(
      (response) => {
        const accessToken = response.authResponse?.accessToken;
        if (!accessToken) {
          reject(new Error("Nie otrzymano access tokena z Facebooka."));
          return;
        }

        resolve(accessToken);
      },
      {
        scope: "public_profile",
        auth_type: "rerequest",
      },
    );
  });
}
