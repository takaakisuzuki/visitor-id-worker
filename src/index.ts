const COOKIE_NAME = "visitor_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getVisitorIdFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );
  return match ? match[1] : null;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const cookieHeader = request.headers.get("Cookie");
    const existingId = getVisitorIdFromCookie(cookieHeader);

    // If the visitor already has a cookie, pass through
    if (existingId) {
      return fetch(request);
    }

    const response = await fetch(request);

    // Generate a new UUID v4 and set it as a cookie
    const uuid = crypto.randomUUID();
    const newResponse = new Response(response.body, response);
    newResponse.headers.append(
      "Set-Cookie",
      `${COOKIE_NAME}=${uuid}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`
    );

    return newResponse;
  },
} satisfies ExportedHandler;
