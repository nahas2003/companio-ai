'use client'

import * as React from 'react'
import { Trophy, Clock, Award, Shield } from 'lucide-react'

export interface LeaderboardEntry {
  id: string
  participantName: string
  score: number
  timeTaken: number
  completedAt: string | Date
  isCurrentUser: boolean
}

export interface RoomLeaderboardProps {
  entries: LeaderboardEntry[]
  title: string
}

export function RoomLeaderboard({ entries, title }: RoomLeaderboardProps) {
  const sortedEntries = React.useMemo(() => {
    return [...entries].sort((a, b) => {
      // Primary: Score descending
      if (b.score !== a.score) {
        return b.score - a.score
      }
      // Secondary: Time taken ascending (faster is better)
      return a.timeTaken - b.timeTaken
    })
  }, [entries])

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const secs = sec % 60
    return `${mins}m ${secs}s`
  }

  // Split out top 3 for the visual podium
  const podium = React.useMemo(() => {
    const top3 = sortedEntries.slice(0, 3)
    // Order as: 2nd place (left), 1st place (center), 3rd place (right)
    const reordered: (LeaderboardEntry | null)[] = [null, null, null]
    if (top3[1]) reordered[0] = top3[1] // 2nd
    if (top3[0]) reordered[1] = top3[0] // 1st
    if (top3[2]) reordered[2] = top3[2] // 3rd
    return { top3, reordered }
  }, [sortedEntries])

  return (
    <div className="space-y-8 text-left max-w-3xl mx-auto pb-12 animate-fade-in w-full">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-primary" /> Live Lobby Standings
        </span>
        <h1 className="text-xl font-bold text-text-primary line-clamp-1 mt-0.5">{title}</h1>
      </div>

      {/* Visual Podium (Only show if we have entries) */}
      {podium.top3.length > 0 && (
        <div className="grid grid-cols-3 items-end gap-3 max-w-xl mx-auto pt-6 pb-2">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            {podium.reordered[0] ? (
              <div className="text-center space-y-2 w-full">
                <span className="text-xs font-bold text-text-primary truncate block px-2">
                  {podium.reordered[0].participantName}
                </span>
                <span className="text-[10px] text-text-secondary font-bold block">
                  {Math.round(podium.reordered[0].score)}% (
                  {formatTimer(podium.reordered[0].timeTaken)})
                </span>
                <div className="h-20 w-full bg-surface-secondary border border-border rounded-t-large flex flex-col items-center justify-center shadow-sm relative">
                  <span className="text-2xl font-extrabold text-text-secondary">2</span>
                  <div className="absolute top-1.5 w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                    🥈
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-20 w-full bg-surface/5 border border-dashed border-border rounded-t-large" />
            )}
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            {podium.reordered[1] ? (
              <div className="text-center space-y-2 w-full">
                <span className="text-xs font-extrabold text-primary truncate block px-2">
                  {podium.reordered[1].participantName}
                </span>
                <span className="text-[10px] text-text-secondary font-bold block">
                  {Math.round(podium.reordered[1].score)}% (
                  {formatTimer(podium.reordered[1].timeTaken)})
                </span>
                <div className="h-28 w-full bg-primary/10 border-2 border-primary/20 rounded-t-large flex flex-col items-center justify-center shadow-md relative">
                  <span className="text-3xl font-extrabold text-primary">1</span>
                  <div className="absolute top-2.5 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    🥇
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-28 w-full bg-surface/5 border border-dashed border-border rounded-t-large" />
            )}
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            {podium.reordered[2] ? (
              <div className="text-center space-y-2 w-full">
                <span className="text-xs font-bold text-text-primary truncate block px-2">
                  {podium.reordered[2].participantName}
                </span>
                <span className="text-[10px] text-text-secondary font-bold block">
                  {Math.round(podium.reordered[2].score)}% (
                  {formatTimer(podium.reordered[2].timeTaken)})
                </span>
                <div className="h-16 w-full bg-surface-secondary border border-border rounded-t-large flex flex-col items-center justify-center shadow-sm relative">
                  <span className="text-xl font-extrabold text-text-secondary">3</span>
                  <div className="absolute top-1 w-4.5 h-4.5 rounded-full bg-amber-700 dark:bg-amber-800 flex items-center justify-center text-[9px] font-bold text-white">
                    🥉
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-16 w-full bg-surface/5 border border-dashed border-border rounded-t-large" />
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="bg-surface border border-border rounded-large shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-secondary flex items-center justify-between text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">Rank</span>
            <span>Candidate Name</span>
          </div>
          <div className="flex items-center gap-12">
            <span className="w-16 text-right">Accuracy</span>
            <span className="w-20 text-right">Duration</span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {sortedEntries.map((entry, index) => {
            const rank = index + 1
            const isCurrentUser = entry.isCurrentUser

            return (
              <div
                key={entry.id}
                className={`p-4 flex items-center justify-between text-xs transition duration-150 ${
                  isCurrentUser
                    ? 'bg-primary/5 text-primary font-bold'
                    : 'text-text-primary hover:bg-surface-secondary'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className={`w-8 text-center font-extrabold text-xs ${
                      rank === 1
                        ? 'text-yellow-500'
                        : rank === 2
                          ? 'text-slate-400'
                          : rank === 3
                            ? 'text-amber-600'
                            : 'text-text-secondary'
                    }`}
                  >
                    {rank}
                  </span>
                  <span className="truncate max-w-[200px] font-semibold">
                    {entry.participantName}{' '}
                    {isCurrentUser && (
                      <span className="text-[10px] font-normal text-text-secondary">(You)</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-12 flex-shrink-0 font-mono">
                  <span
                    className={`w-16 text-right font-bold ${isCurrentUser ? 'text-primary' : 'text-text-primary'}`}
                  >
                    {Math.round(entry.score)}%
                  </span>
                  <span className="w-20 text-right text-text-secondary">
                    {formatTimer(entry.timeTaken)}
                  </span>
                </div>
              </div>
            )
          })}

          {sortedEntries.length === 0 && (
            <div className="p-8 text-center text-xs text-text-secondary font-semibold">
              No entries logged in this session yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
