import fs from "fs";
import path from "path";

export type DatasetEntryMetrics = {
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  videoDurationSeconds?: number;
  takenAt?: string;
};

export type DatasetEntry = {
  id: number;
  title: string;
  href: string;
  folder: string;
  hasVideo: boolean;
  metrics: DatasetEntryMetrics;
  caption?: string;
  hashtags: string[];
  summary?: string;
  topics: string[];
  chapters: DatasetChapter[];
};

export type DatasetChapter = {
  startTime: string;
  title: string;
};
const REQUIRED_JSON_FILES = ["chapter.json", "metadata.json", "ringkasan.json", "scrape.json", "transcript.json"] as const;

const datasetRoot = path.join(process.cwd(), "dataset");

type RingkasanJson = {
  judul?: string;
  ringkasan?: string;
  topik?: string | string[];
};

type MetadataJson = {
  video_url?: string;
};

type HashtagEntry = string | { name?: string };

type ScrapeJson = {
  post?: {
    like_count?: number;
    comment_count?: number;
    view_count?: number;
    video_duration?: number;
    taken_at?: string;
    caption?: string;
    hashtags?: HashtagEntry[];
  };
};

type ChapterJsonEntry = {
  start_time?: string;
  title?: string;
};

type ChapterJson = ChapterJsonEntry[];

function readJson<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isCompleteFolder(folderPath: string, folderName: string): boolean {
  const expectedFiles = [
    `${folderName}.mp3`,
    `${folderName}.mp4`,
    ...REQUIRED_JSON_FILES,
  ];

  return expectedFiles.every((filename) => fs.existsSync(path.join(folderPath, filename)));
}

export function getDatasetEntries(): DatasetEntry[] {
  if (!fs.existsSync(datasetRoot)) {
    return [];
  }

  const entries = fs.readdirSync(datasetRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((folderName) => /^\d+$/.test(folderName))
    .map((folderName) => {
      const folderPath = path.join(datasetRoot, folderName);

      if (!isCompleteFolder(folderPath, folderName)) {
        return null;
      }

      const ringkasan = readJson<RingkasanJson>(path.join(folderPath, "ringkasan.json"));
      const metadata = readJson<MetadataJson>(path.join(folderPath, "metadata.json"));
      const scrape = readJson<ScrapeJson>(path.join(folderPath, "scrape.json"));
      const chapters = readJson<ChapterJson>(path.join(folderPath, "chapter.json"));
      const hasVideo = fs.existsSync(path.join(folderPath, `${folderName}.mp4`));
      const hashtagList =
        Array.isArray(scrape?.post?.hashtags)
          ? scrape?.post?.hashtags
              .map((tag) => {
                if (!tag) {
                  return null;
                }
                if (typeof tag === "string") {
                  const trimmed = tag.trim();
                  if (!trimmed) {
                    return null;
                  }
                  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
                }
                if (typeof tag === "object" && typeof tag.name === "string") {
                  const trimmed = tag.name.trim();
                  if (!trimmed) {
                    return null;
                  }
                  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
                }
                return null;
              })
              .filter((tag): tag is string => Boolean(tag))
          : [];

      return {
        id: Number(folderName),
        title: ringkasan?.judul ?? `ID ${folderName}`,
        href: metadata?.video_url ?? "#",
        folder: folderName,
        hasVideo,
        metrics: {
          likeCount: scrape?.post?.like_count,
          commentCount: scrape?.post?.comment_count,
          viewCount: scrape?.post?.view_count,
          videoDurationSeconds: scrape?.post?.video_duration,
          takenAt: scrape?.post?.taken_at,
        },
        caption: scrape?.post?.caption,
        hashtags: hashtagList,
        summary: ringkasan?.ringkasan,
        topics: Array.isArray(ringkasan?.topik)
          ? ringkasan?.topik.filter((topic): topic is string => Boolean(topic && topic.trim())).map((topic) => topic.trim())
          : typeof ringkasan?.topik === "string" && ringkasan.topik.trim() !== ""
            ? ringkasan.topik.trim().split(",").map((topic) => topic.trim()).filter(Boolean)
            : [],
        chapters:
          Array.isArray(chapters)
            ? chapters
                .map((entry) => {
                  const time = entry.start_time?.trim();
                  const title = entry.title?.trim();
                  if (!time || !title) {
                    return null;
                  }
                  return {
                    startTime: time,
                    title,
                  };
                })
                .filter((entry): entry is DatasetChapter => Boolean(entry))
            : [],
      };
    })
    .filter((entry): entry is DatasetEntry => entry !== null)
    .sort((a, b) => a.id - b.id);
}
