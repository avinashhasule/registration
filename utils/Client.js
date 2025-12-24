export const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const includeToken = process.env.NEXT_PUBLIC_SEND_AUTH_TOKEN === "true";

export async function apihelper(
  endpoint,
  { method = "GET", data, headers: customHeaders, ...customConfig } = {}
) {
  try {
    const token = JSON.parse(
      window.localStorage.getItem("patient-portal-token")
    );
    const config = {
      method: method,
      ...(data && { body: JSON.stringify(data) }),
      headers: {
        ...(includeToken && token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        ...customHeaders,
      },
      ...customConfig,
    };
    const response = await fetch(`${apiURL}/${endpoint}`, config);
    if (response.status === 401) {
      // if (!token) {
      //   return await response.json();
      // }
      window.localStorage.removeItem("patient-portal-token");
      window.location.assign("/");
    }
    if (customConfig?.requestType === "blob") {
      const result = await response.blob();
      return result;
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return { message: error?.message || "Something went wrong" };
  }
}
