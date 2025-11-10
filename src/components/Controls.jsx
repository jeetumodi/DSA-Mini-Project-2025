import React from 'react'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'

const Controls = ({ numDisks, setNumDisks, speed, setSpeed, mode, isPlaying, handlePlayPause, handleNext, resetGame, currentStep, totalMoves, animatingDisk, manualMoves, elapsedTime }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Disks:</label>
          <input
            type="range"
            min="2"
            max="7"
            value={numDisks}
            onChange={(e) => setNumDisks(parseInt(e.target.value))}
            className="w-32"
            disabled={isPlaying || animatingDisk}
          />
          <span className="text-lg font-bold w-8">{numDisks}</span>
        </div>

        {mode === 'auto' && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Speed:</label>
              <input
                type="range"
                min="200"
                max="2000"
                step="200"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-sm w-16">{(2200 - speed) / 200}x</span>
            </div>

            {/* Elapsed time display */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Elapsed:</label>
              <div className="text-sm font-bold">
                {elapsedTime && elapsedTime > 0 ? `${(elapsedTime / 1000).toFixed(2)}s` : '--'}
              </div>
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={handlePlayPause}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? 'Pause' : currentStep >= totalMoves ? 'Restart' : 'Play'}
              </button>

              <button
                onClick={handleNext}
                disabled={currentStep >= totalMoves || isPlaying || animatingDisk}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition"
              >
                <ChevronRight className="w-5 h-5" />
                Next
              </button>
            </div>
          </>
        )}

        <button
          onClick={resetGame}
          className={`flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition ${
            mode === 'manual' ? 'ml-auto' : ''
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>
    </div>
  )
}

export default Controls
