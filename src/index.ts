var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
var COOKIE_NAME = "visitor_id";
var COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
function getVisitorIdFromCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );
  return match ? match[1] : null;
}
__name(getVisitorIdFromCookie, "getVisitorIdFromCookie");
var index_default = {
  async fetch(request) {
    const cookieHeader = request.headers.get("Cookie");
    const existingId = getVisitorIdFromCookie(cookieHeader);
    if (existingId) {
      return fetch(request);
    }
    const response = await fetch(request);
    const uuid = crypto.randomUUID();
    const newResponse = new Response(response.body, response);
    newResponse.headers.append(
      "Set-Cookie",
      `${COOKIE_NAME}=${uuid}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`
    );
    return newResponse;
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
