import { useState } from "react";
import {
  ArrowLeft, Play, Lock, CheckCircle2, ChevronDown,
  Clock, BookOpen, Cloud, ExternalLink, PlayCircle,
} from "lucide-react";

export interface VideoTopic {
  title: string;
  duration?: string;
  videoUrl?: string; // Google Drive share/embed link
  completed?: boolean;
}

export interface VideoModule {
  module: string;
  topics: VideoTopic[];
}

export interface CourseContent {
  id: string;
  title: string;
  subtitle: string;
  accentFrom: string;
  accentTo: string;
  modules: VideoModule[];
}

function getDriveEmbedUrl(url: string): string {
  // Convert various Google Drive URL formats to embed format
  // https://drive.google.com/file/d/FILE_ID/view → https://drive.google.com/file/d/FILE_ID/preview
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }
  // Already an embed or unknown format — return as-is
  return url;
}

export default function CourseContentPage({
  content,
  onBack,
}: {
  content: CourseContent;
  onBack: () => void;
}) {
  const [activeModule, setActiveModule] = useState(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([0]));

  const currentTopic = content.modules[activeModule]?.topics[activeTopic];
  const hasVideo = !!currentTopic?.videoUrl;

  const totalTopics = content.modules.reduce((s, m) => s + m.topics.length, 0);

  function toggleModule(i: number) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function selectTopic(modIdx: number, topIdx: number) {
    setActiveModule(modIdx);
    setActiveTopic(topIdx);
    // ensure module is open
    setOpenModules((prev) => new Set([...prev, modIdx]));
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#4361ee] flex items-center justify-center">
              <Cloud className="w-3 h-3 text-white" />
            </div>
            <span
              className="font-bold text-sm tracking-tight"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              SkillVane <span className="text-[#4361ee]">IT Academy</span>
            </span>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5" />
            {totalTopics} lessons
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-0 sm:px-6 gap-0 sm:gap-6 py-0 sm:py-6">
        {/* ── Sidebar ──────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0">
          {/* Course info */}
          <div
            className="rounded-xl p-4 mb-4 border border-white/8"
            style={{
              background: `linear-gradient(135deg, ${content.accentFrom}18 0%, ${content.accentTo}0a 100%)`,
            }}
          >
            <p
              className="text-xs font-mono uppercase tracking-widest mb-1"
              style={{ color: content.accentFrom }}
            >
              Enrolled
            </p>
            <h2
              className="text-base font-bold text-white leading-tight"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              {content.title}
            </h2>
            <p className="text-xs text-white/40 mt-0.5">{content.subtitle}</p>
          </div>

          {/* Module list */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {content.modules.map((mod, modIdx) => (
              <div
                key={modIdx}
                className="border border-white/8 rounded-xl overflow-hidden bg-card"
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
                  onClick={() => toggleModule(modIdx)}
                >
                  <span className="text-xs font-semibold text-white/80 leading-snug pr-2">
                    {mod.module}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-white/30 flex-shrink-0 transition-transform duration-200 ${
                      openModules.has(modIdx) ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openModules.has(modIdx) && (
                  <ul className="border-t border-white/6">
                    {mod.topics.map((topic, topIdx) => {
                      const isActive = activeModule === modIdx && activeTopic === topIdx;
                      return (
                        <li key={topIdx}>
                          <button
                            onClick={() => selectTopic(modIdx, topIdx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isActive
                                ? "bg-white/8 text-white"
                                : "text-white/50 hover:text-white/80 hover:bg-white/4"
                            }`}
                          >
                            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                              {topic.videoUrl ? (
                                isActive ? (
                                  <PlayCircle
                                    className="w-4 h-4"
                                    style={{ color: content.accentFrom }}
                                  />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-white/30" />
                                )
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-white/20" />
                              )}
                            </div>
                            <span className="text-xs flex-1 leading-snug">{topic.title}</span>
                            {topic.duration && (
                              <span className="text-[10px] text-white/25 flex-shrink-0 flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {topic.duration}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Video player */}
          <div className="bg-black rounded-none sm:rounded-xl overflow-hidden aspect-video w-full relative flex items-center justify-center">
            {hasVideo ? (
              <iframe
                key={`${activeModule}-${activeTopic}`}
                src={getDriveEmbedUrl(currentTopic!.videoUrl!)}
                className="w-full h-full"
                allow="autoplay"
                allowFullScreen
                title={currentTopic?.title}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-center px-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${content.accentFrom}30 0%, ${content.accentTo}18 100%)`,
                    border: `1px solid ${content.accentFrom}30`,
                  }}
                >
                  <Lock className="w-7 h-7 text-white/30" />
                </div>
                <p className="text-white/40 text-sm">
                  Video link not added yet. Add a Google Drive link to unlock this lesson.
                </p>
              </div>
            )}
          </div>

          {/* Topic info */}
          <div className="px-4 sm:px-0 py-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-[10px] font-mono uppercase tracking-widest mb-1"
                  style={{ color: content.accentFrom }}
                >
                  {content.modules[activeModule]?.module}
                </p>
                <h1
                  className="text-lg sm:text-xl font-bold text-white leading-tight"
                  style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                  {currentTopic?.title}
                </h1>
              </div>
              {currentTopic?.videoUrl && (
                <a
                  href={currentTopic.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Drive
                </a>
              )}
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const flat = content.modules.flatMap((m, mi) =>
                    m.topics.map((_, ti) => ({ mi, ti }))
                  );
                  const cur = flat.findIndex(
                    (x) => x.mi === activeModule && x.ti === activeTopic
                  );
                  if (cur > 0) {
                    selectTopic(flat[cur - 1].mi, flat[cur - 1].ti);
                  }
                }}
                className="px-4 py-2 rounded-lg border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  const flat = content.modules.flatMap((m, mi) =>
                    m.topics.map((_, ti) => ({ mi, ti }))
                  );
                  const cur = flat.findIndex(
                    (x) => x.mi === activeModule && x.ti === activeTopic
                  );
                  if (cur < flat.length - 1) {
                    selectTopic(flat[cur + 1].mi, flat[cur + 1].ti);
                  }
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                style={{
                  background: `linear-gradient(135deg, ${content.accentFrom} 0%, ${content.accentTo} 100%)`,
                }}
              >
                Next Lesson →
              </button>
            </div>
          </div>

          {/* Mobile: module list */}
          <div className="lg:hidden px-4 pb-8 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3">
              Course Content
            </h3>
            {content.modules.map((mod, modIdx) => (
              <div
                key={modIdx}
                className="border border-white/8 rounded-xl overflow-hidden bg-card"
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  onClick={() => toggleModule(modIdx)}
                >
                  <span className="text-xs font-semibold text-white/80 pr-2">{mod.module}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-white/30 flex-shrink-0 transition-transform duration-200 ${
                      openModules.has(modIdx) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openModules.has(modIdx) && (
                  <ul className="border-t border-white/6">
                    {mod.topics.map((topic, topIdx) => {
                      const isActive = activeModule === modIdx && activeTopic === topIdx;
                      return (
                        <li key={topIdx}>
                          <button
                            onClick={() => selectTopic(modIdx, topIdx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isActive ? "bg-white/8 text-white" : "text-white/50"
                            }`}
                          >
                            {topic.videoUrl ? (
                              <Play className="w-3.5 h-3.5 flex-shrink-0 text-white/40" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 flex-shrink-0 text-white/20" />
                            )}
                            <span className="text-xs flex-1 leading-snug">{topic.title}</span>
                            {topic.duration && (
                              <span className="text-[10px] text-white/25 flex-shrink-0">
                                {topic.duration}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
