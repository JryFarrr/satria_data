import Image from "next/image";

type UrlRow = {
  id: number;
  url: string;
  isActive?: boolean;
};

type Metric = {
  label: string;
  value: string;
  hint: string;
  icon: string;
  accentBg: string;
  accentText: string;
};

type TimeStamp = {
  time: string;
  desc: string;
};

type WordToken = {
  text: string;
  size: string;
  color: string;
  top: string;
  left: string;
  rotate?: string;
};

const urlRows: UrlRow[] = [
  { id: 1, url: "https://instagram.com/reel/alpha" },
  { id: 2, url: "https://instagram.com/reel/beta", isActive: true },
  { id: 3, url: "https://instagram.com/reel/gamma" },
  { id: 4, url: "https://instagram.com/reel/delta" },
  { id: 5, url: "https://instagram.com/reel/epsilon" },
  { id: 6, url: "https://instagram.com/reel/zeta" },
  { id: 7, url: "https://instagram.com/reel/theta" },
  { id: 8, url: "https://instagram.com/reel/iota" },
];

const metrics: Metric[] = [
  {
    label: "Like",
    value: "506",
    hint: "Naik 2x",
    icon: "/assets/Following.png",
    accentBg: "bg-[#e8f0ff]",
    accentText: "text-[#0f3fa8]",
  },
  {
    label: "Comment",
    value: "100",
    hint: "Topik aktif",
    icon: "/assets/Chat Bubble.png",
    accentBg: "bg-[#fff4e0]",
    accentText: "text-[#b45309]",
  },
  {
    label: "Durasi Video",
    value: "3295 s",
    hint: "54 menit",
    icon: "/assets/Video Call.png",
    accentBg: "bg-[#e7faf5]",
    accentText: "text-[#0f766e]",
  },
  {
    label: "Tanggal dibuat",
    value: "30/09/2025",
    hint: "Campaign #7",
    icon: "/assets/Schedule.png",
    accentBg: "bg-[#eef1ff]",
    accentText: "text-[#344173]",
  },
];

const captionText =
  "Dulu videoku sepi. Setelah fokus ke hook 3 detik pertama, CTR naik 2x. Ini caraku.";

const summaryText =
  "Pembukaan mengangkat persoalan postur lalu menunjukkan latihan inti. Letakkan CTA sebelum detik ke-40 sambil sisipkan contoh hasil di detik 20.";

const sentimentCounts = {
  positive: 20,
  negative: 9,
};

const sentimentComments = [
  "Wahh video ini sangat keren sekali",
  "Bodynya agak kegendutan ya?",
];

const hashtags = ["#DigitalMarketing", "#AI", "#KontenSehat"];

const topics = [
  "Optimasi hook 3 detik pertama",
  "Soroti manfaat alat bantu latihan",
  "CTA ajak komentar di akhir video",
];

const timeStamps: TimeStamp[] = [
  { time: "05:07", desc: "Pembukaan" },
  { time: "12:43", desc: "Pergantian angle" },
  { time: "23:10", desc: "Highlight manfaat alat" },
  { time: "41:55", desc: "CTA penutup" },
];

const wordTokens: WordToken[] = [
  { text: "duduk", size: "text-[3.6rem]", color: "text-[#384395]", top: "12%", left: "8%" },
  { text: "beban", size: "text-[3.2rem]", color: "text-[#3f5ac9]", top: "38%", left: "38%" },
  { text: "push", size: "text-4xl", color: "text-[#5cc27a]", top: "36%", left: "8%" },
  { text: "punggung", size: "text-3xl", color: "text-[#4f9ad5]", top: "60%", left: "22%" },
  { text: "lakukan", size: "text-2xl", color: "text-[#e1c238]", top: "6%", left: "58%", rotate: "-4deg" },
  { text: "angkat", size: "text-2xl", color: "text-[#4890f0]", top: "70%", left: "62%" },
  { text: "dumbbell", size: "text-xl", color: "text-[#5f3bbf]", top: "48%", left: "72%" },
  { text: "menggunakan", size: "text-xl", color: "text-[#2f9f9f]", top: "74%", left: "6%" },
  { text: "tegakkan", size: "text-lg", color: "text-[#209db7]", top: "24%", left: "66%" },
  { text: "tembok", size: "text-lg", color: "text-[#3abbbb]", top: "10%", left: "34%" },
  { text: "kursi", size: "text-lg", color: "text-[#46a58c]", top: "60%", left: "80%" },
  { text: "follow", size: "text-base", color: "text-[#1f7cc2]", top: "30%", left: "26%", rotate: "6deg" },
  { text: "tips", size: "text-base", color: "text-[#54c2b7]", top: "52%", left: "30%" },
  { text: "overhead", size: "text-sm", color: "text-[#4d68c2]", top: "78%", left: "48%", rotate: "-6deg" },
  { text: "press", size: "text-sm", color: "text-[#66d36f]", top: "18%", left: "74%" },
  { text: "row", size: "text-sm", color: "text-[#57b1db]", top: "48%", left: "18%" },
  { text: "seated", size: "text-sm", color: "text-[#35a8a8]", top: "34%", left: "70%" },
  { text: "lanjut", size: "text-sm", color: "text-[#7062d8]", top: "64%", left: "8%" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f1f3ff] px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
        <div className="flex h-[14px] w-60 overflow-hidden rounded-full">
          <div className="w-1/3 bg-[#f4b400]" />
          <div className="w-1/3 bg-[#1766ff]" />
          <div className="w-1/3 bg-[#1f2c6d]" />
        </div>
        <header className="space-y-1 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1766ff]">
            Analitik Sosial
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-[2.45rem] font-semibold text-[#1f2355]">
              Content Engagement Dashboard
            </h1>
            <span className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-lg">
              Update 30/09/2025
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <section className="card flex flex-col gap-4 p-6">
            <div className="flex w-full items-center justify-between">
              <p className="card-title text-[#54608d]">Mockup Video</p>
              <span className="tag px-4 py-1 text-xs uppercase">Screenshot</span>
            </div>
            <div className="relative flex justify-center rounded-[32px] bg-[rgba(233,239,255,0.9)] p-6">
              <div className="relative w-[320px]">
                <Image src="/assets/iphone-mockup.png" alt="Mockup iPhone" width={620} height={1240} priority />
                <div className="absolute inset-[18%] flex items-center justify-center rounded-[30px] bg-gradient-to-b from-[#bad7ff] via-[#d2e3ff] to-white px-6 text-center">
                  <span className="text-sm font-semibold uppercase text-[#213975]">
                    Insert your Screenshot
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-4">
            <section className="card overflow-hidden">
              <div className="flex items-center justify-between rounded-t-[22px] bg-[#1748a6] px-5 py-3 text-white">
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-80">Daftar Konten</p>
                  <h2 className="text-lg font-semibold">Link reel terpilih</h2>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">8 tautan</span>
              </div>
              <div className="max-h-[236px] overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-[#2754c4] text-white">
                    <tr>
                      <th className="w-20 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">Id</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">Url</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urlRows.map((row) => (
                      <tr
                        key={row.id}
                        className={`border-b border-slate-100 ${row.isActive ? "bg-[#eef4ff]" : "bg-white"}`}
                      >
                        <td className="px-4 py-2 font-semibold text-slate-600">
                          {row.id.toString().padStart(2, "0")}
                        </td>
                        <td className="px-4 py-2">
                          <a
                            href={row.url}
                            className={`truncate font-medium ${row.isActive ? "text-[#1748a6]" : "text-slate-600"}`}
                          >
                            {row.url}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card px-4 py-4">
              <div className="grid gap-4 lg:grid-cols-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="flex items-center gap-3 rounded-2xl bg-[#f7f8ff] px-4 py-3 shadow-sm">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${metric.accentBg}`}>
                      <Image src={metric.icon} alt={metric.label} width={22} height={22} />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${metric.accentText}`}>
                        {metric.label}
                      </p>
                      <p className="text-lg font-bold text-[#1f2a55]">{metric.value}</p>
                      <p className="text-xs text-slate-500">{metric.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
              <section className="card overflow-hidden">
                <div className="bg-[#f5ba45] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#1f2a55]">
                  Caption
                </div>
                <p className="px-4 pb-4 pt-3 text-sm text-slate-700">{captionText}</p>
              </section>
              <section className="card flex flex-wrap gap-2 p-4">
                <div className="w-full text-xs font-semibold uppercase tracking-wide text-[#1766ff]">Hashtag</div>
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#1766ff]/30 bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#1766ff]"
                  >
                    {tag}
                  </span>
                ))}
              </section>
            </div>
          </div>
        </div>

        <section className="card flex flex-col gap-3 p-5">
          <p className="card-title text-[#1766ff]">Judul (Topic)</p>
          <div className="flex flex-col gap-2 text-sm text-slate-600">
            {topics.map((topic) => (
              <div key={topic} className="flex items-start gap-2">
                <span className="mt-[6px] h-2 w-2 rounded-full bg-[#1766ff]" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]">
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <p className="card-title text-[#1766ff]">Time Stamps</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3ff]">
                <Image src="/assets/Schedule.png" alt="Clock icon" width={22} height={22} />
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-100">
              <table className="min-w-full text-sm">
                <thead className="bg-[#eff4ff] text-[#4b587c]">
                  <tr>
                    <th className="w-24 px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {timeStamps.map((row, idx) => (
                    <tr key={`${row.time}-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-[#f6f8ff]"}>
                      <td className="px-4 py-2 font-semibold text-slate-700">{row.time}</td>
                      <td className="px-4 py-2 text-slate-600">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card flex flex-col gap-3 p-5">
            <p className="card-title text-[#1766ff]">Summarize</p>
            <p className="text-sm leading-relaxed text-slate-600">{summaryText}</p>
          </section>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)]">
          <section className="card flex flex-col gap-4 p-5">
            <p className="card-title text-[#1766ff]">Sentiment Comment</p>
            <div className="flex flex-col gap-2">
              {sentimentComments.map((comment) => (
                <div
                  key={comment}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
                >
                  {comment}
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-1">
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-[#eef3ff] px-3 py-3">
                <Image src="/assets/Happy.png" alt="Positive" width={34} height={34} />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Positive</p>
                  <p className="text-lg font-bold text-slate-900">{sentimentCounts.positive}</p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-[#ffe9ef] px-3 py-3">
                <Image src="/assets/Sad.png" alt="Negative" width={34} height={34} />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Negative</p>
                  <p className="text-lg font-bold text-slate-900">{sentimentCounts.negative}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="card flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <p className="card-title text-[#1766ff]">Word Cloud</p>
              <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#1766ff]">
                Top kata
              </span>
            </div>
            <div className="relative h-[230px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#eef4ff] via-[#f5f7ff] to-[#ffffff]">
              {wordTokens.map((token) => (
                <span
                  key={`${token.text}-${token.top}-${token.left}`}
                  className={`pointer-events-none absolute font-semibold leading-tight ${token.size} ${token.color}`}
                  style={{ top: token.top, left: token.left, transform: `rotate(${token.rotate ?? "0deg"})` }}
                >
                  {token.text}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Image src="/assets/logo-its.png" alt="Logo ITS" width={42} height={42} />
              <Image src="/assets/logo-2025.png" alt="Logo 2025" width={42} height={42} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
