"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Maximize2, Minimize2 } from "lucide-react";

interface iAppProps {
  title: string;
  overview: string;
  youtubeUrl: string;
  state: boolean;
  changeState: any;
  release: number;
  age: number;
  duration: number;
  videoSource: string;
  movieId: string;
}

export default function PlayVideoModal({
  changeState,
  overview,
  state,
  title,
  youtubeUrl,
  age,
  duration,
  release,
  videoSource,
  movieId,
}: iAppProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeServer, setActiveServer] = useState(1); // Default to cleanest server

  // Extract TMDB ID from videoSource URL
  const getVideoId = () => {
    const match = videoSource?.match(/\/(?:movie|tv)\/([a-zA-Z0-9]+)/);
    return match ? match[1] : movieId;
  };

  // Servers ranked by ad level - CLEANEST FIRST
  // Strategy: xyz has cleaner start, .to/.me have aggressive initial ads
  const servers = [
    {
      name: "XYZ",
      url: (id: string) => `https://vidsrc.xyz/embed/movie/${id}`,
      desc: "Cleanest"
    },
    {
      name: "CC",
      url: (id: string) => `https://vidsrc.cc/v2/embed/movie/${id}`,
      desc: "Clean"
    },
    {
      name: "Pro",
      url: (id: string) => `https://vidsrc.pro/embed/movie/${id}`,
      desc: "Good"
    },
    {
      name: "Multi",
      url: (id: string) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
      desc: "Backup"
    },
  ];

  const getSource = (server: number) => {
    const id = getVideoId();
    if (!id) return videoSource || "";

    const serverIndex = server - 1;
    if (serverIndex >= 0 && serverIndex < servers.length) {
      return servers[serverIndex].url(id);
    }
    return videoSource || "";
  };

  const currentSource = getSource(activeServer);

  return (
    <Dialog open={state} onOpenChange={() => changeState(!state)}>
      <DialogContent
        className={`${isMaximized
          ? "!fixed !inset-0 !w-screen !h-screen !max-w-none !max-h-none !rounded-none !border-none !translate-x-0 !translate-y-0 !top-0 !left-0 z-50 transform-none"
          : "sm:max-w-[900px]"
          } bg-black/95 border-gray-800 transition-all duration-300`}
      >
        <DialogHeader className="relative">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl">{title}</DialogTitle>
            <div className="flex gap-2 items-center">
              <div className="flex bg-gray-900 rounded-md p-0.5 border border-gray-800">
                {servers.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveServer(i + 1)}
                    className={`px-2 py-1 text-xs rounded-sm transition-colors flex flex-col items-center ${activeServer === i + 1
                      ? "bg-green-600 text-white"
                      : "text-gray-400 hover:text-white"
                      }`}
                    title={s.desc}
                  >
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-5 h-5 text-white" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
          {!isMaximized && (
            <>
              <DialogDescription className="line-clamp-2 text-gray-400">
                {overview}
              </DialogDescription>
              <div className="flex gap-x-3 items-center text-sm text-gray-300">
                <span>{release}</span>
                <span className="border py-0.5 px-2 border-gray-600 rounded text-xs">
                  {age}+
                </span>
                <span>{duration}h</span>
                <span className="text-green-400 text-xs">🛡️ Minimal Ads</span>
              </div>
            </>
          )}
        </DialogHeader>

        <div className={`${isMaximized ? "h-[calc(100vh-80px)]" : "h-[500px]"} w-full`}>
          {currentSource ? (
            <iframe
              src={currentSource}
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              referrerPolicy="origin"
            ></iframe>
          ) : (
            <iframe
              src={youtubeUrl}
              className="w-full h-full rounded-lg"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
