import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const datasetRoot = path.join(process.cwd(), "dataset");
const DEFAULT_SERVICE_URL = "http://localhost:8000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getServiceBaseUrl() {
  const raw = process.env.ANALYSIS_SERVICE_URL?.trim();
  if (!raw) {
    return DEFAULT_SERVICE_URL;
  }
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

async function readVideoFile(id: string) {
  const videoPath = path.join(datasetRoot, id, `${id}.mp4`);

  try {
    const stat = await fs.stat(videoPath);
    if (!stat.isFile()) {
      return null;
    }
  } catch {
    return null;
  }

  return fs.readFile(videoPath);
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!/^\d+$/.test(id)) {
    return new Response("Invalid dataset id", { status: 400 });
  }

  const fileBuffer = await readVideoFile(id);

  if (!fileBuffer) {
    return new Response("Video not found", { status: 404 });
  }

  const serviceBaseUrl = getServiceBaseUrl();
  const endpoint = `${serviceBaseUrl}/video-analysis/full`;

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([fileBuffer], { type: "video/mp4" }),
    `${id}.mp4`,
  );

  let analysisResponse: Response;
  try {
    analysisResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: formData,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to reach analysis service:", error);
    return new Response("Analysis service unavailable", { status: 502 });
  }

  if (!analysisResponse.ok) {
    const message = await analysisResponse.text();
    return new Response(message || "Analysis failed", { status: 502 });
  }

  const analysis = await analysisResponse.json();

  return new Response(JSON.stringify(analysis), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
