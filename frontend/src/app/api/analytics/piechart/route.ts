const DEFAULT_SERVICE_URL = "http://localhost:8000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getServiceBaseUrl() {
  const raw = process.env.ANALYSIS_SERVICE_URL?.trim();
  if (!raw) {
    return DEFAULT_SERVICE_URL;
  }
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export async function GET(request: Request) {
  const serviceBaseUrl = getServiceBaseUrl();
  const incomingUrl = new URL(request.url);
  const targetUrl = new URL("/analytics/piechart", serviceBaseUrl);

  incomingUrl.searchParams.forEach((value, key) => {
    if (value) {
      targetUrl.searchParams.append(key, value);
    }
  });

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to reach analytics piechart service:", error);
    return new Response("Analytics piechart service unavailable", { status: 502 });
  }

  if (!upstreamResponse.ok) {
    const errorBody = await upstreamResponse.text();
    const status = upstreamResponse.status || 502;
    const message =
      errorBody || upstreamResponse.statusText || "Gagal memuat piechart";
    return new Response(message, {
      status,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const contentType =
    upstreamResponse.headers.get("content-type") ?? "application/json";

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
