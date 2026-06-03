export type SsoProvider = "google" | "microsoft";
export type SsoIntent = "login" | "signup";

function requiredEnv(name: string, value?: string): string {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function buildGoogleUrl(intent: SsoIntent): string {
  const clientId = requiredEnv("NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID", process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID);
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:3000/auth/callback";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    access_type: "online",
    state: `google:${intent}`,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function buildMicrosoftUrl(intent: SsoIntent): string {
  const clientId = requiredEnv("NEXT_PUBLIC_MICROSOFT_OAUTH_CLIENT_ID", process.env.NEXT_PUBLIC_MICROSOFT_OAUTH_CLIENT_ID);
  const tenantId = process.env.NEXT_PUBLIC_MICROSOFT_OAUTH_TENANT_ID || "common";
  const redirectUri = process.env.NEXT_PUBLIC_MICROSOFT_OAUTH_REDIRECT_URI || "http://localhost:3000/auth/callback";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    response_mode: "query",
    scope: "openid profile email User.Read",
    state: `microsoft:${intent}`,
  });
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
}

export function buildSsoAuthorizeUrl(provider: SsoProvider, intent: SsoIntent): string {
  if (provider === "google") {
    return buildGoogleUrl(intent);
  }
  return buildMicrosoftUrl(intent);
}
