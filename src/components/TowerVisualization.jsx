import React from 'react'

const TowerVisualization = ({ towers, colors, getDiskWidth, getDiskPosition, handleDiskClick, selectedDisk, animatingDisk, mode, isValidMove, manualMoves, isGameWon }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-purple-400">
        Tower Visualization
        {mode === 'manual' && (
          <span className="text-sm text-gray-400 ml-3 font-normal">
            Click on a disk to select, then click on target tower
          </span>
        )}
      </h2>
      <div className="flex justify-around items-end h-80 mb-4 relative">
        {['A', 'B', 'C'].map((tower) => (
          <div
            key={tower}
            className={`flex flex-col items-center ${
              mode === 'manual' && !animatingDisk ? 'cursor-pointer' : ''
            }`}
            onClick={() => handleDiskClick(tower)}
          >
            <div className="flex flex-col-reverse items-center gap-1 h-64 justify-end relative">
              {towers[tower].map((disk, idx) => {
                const isSelected = selectedDisk && selectedDisk.disk === disk && selectedDisk.from === tower
                return (
                  <div
                    key={`${tower}-${disk}-${idx}`}
                    className={`rounded absolute ${
                      mode === 'manual' && idx === towers[tower].length - 1 && !animatingDisk
                        ? 'hover:scale-105 cursor-pointer'
                        : ''
                    } ${isSelected ? 'ring-4 ring-yellow-400' : ''}`}
                    style={{
                      width: `${getDiskWidth(disk)}px`,
                      height: '30px',
                      backgroundColor: colors[(disk - 1) % colors.length],
                      boxShadow: `0 4px 6px rgba(0, 0, 0, 0.3), 0 0 20px ${colors[(disk - 1) % colors.length]}40`,
                      bottom: `${idx * 32}px`,
                      ...getDiskPosition(disk, tower, idx)
                    }}
                  >
                    <div className="h-full flex items-center justify-center text-sm font-bold text-gray-900">
                      {disk}
                    </div>
                  </div>
                )
              })}
              <div className="w-2 h-64 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t"></div>
            </div>
            <div className="w-40 h-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded mt-1"></div>
            <div className="text-xl font-bold mt-2 text-purple-300">{tower}</div>
          </div>
        ))}
      </div>

      {mode === 'manual' && !isValidMove && (
        <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4 mb-4 animate-pulse">
          <p className="text-lg font-semibold text-red-300">
            ❌ Invalid move! You can't place a larger disk on a smaller one.
          </p>
        </div>
      )}

      {mode === 'manual' && isGameWon() && (
        <div className="bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-4 mb-4">
          <p className="text-lg font-semibold text-green-300">
            🎉 Congratulations! You solved it in {manualMoves} moves!
          </p>
        </div>
      )}

      {mode === 'auto' && (
        <div className="bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg p-4">
          <p className="text-lg font-semibold text-purple-300">Auto-playing moves</p>
        </div>
      )}
    </div>
  )
}

export default TowerVisualization
