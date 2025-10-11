import fs from "fs";
import path from "path";

const datasetRoot = path.join(process.cwd(), "dataset");

function streamToWeb(stream: fs.ReadStream): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(new Uint8Array(chunk)));
      stream.on("end", () => controller.close());
      stream.on("error", (error) => controller.error(error));
    },
    cancel() {
      stream.destroy();
    },
  });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!/^\d+$/.test(id)) {
    return new Response("Invalid dataset id", { status: 400 });
  }

  const videoPath = path.join(datasetRoot, id, `${id}.mp4`);

  if (!fs.existsSync(videoPath)) {
    return new Response("Video not found", { status: 404 });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = request.headers.get("range");

  if (range) {
    const match = range.match(/bytes=(\d+)-(\d*)/);

    if (!match) {
      return new Response("Malformed Range header", { status: 416 });
    }

    const start = Number.parseInt(match[1], 10);
    const end = match[2] ? Number.parseInt(match[2], 10) : fileSize - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= fileSize) {
      return new Response("Invalid Range", { status: 416 });
    }

    const chunkSize = end - start + 1;
    const stream = fs.createReadStream(videoPath, { start, end });

    return new Response(streamToWeb(stream), {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": "video/mp4",
      },
    });
  }

  const stream = fs.createReadStream(videoPath);

  return new Response(streamToWeb(stream), {
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Length": fileSize.toString(),
      "Content-Type": "video/mp4",
    },
  });
}
