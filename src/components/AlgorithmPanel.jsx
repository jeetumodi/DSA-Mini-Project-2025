import React from 'react'

const AlgorithmPanel = ({ algorithm, totalMoves, mode }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-green-400">Non Recursive Algorithm</h2>
      <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-sm font-mono text-green-300">
        {algorithm}
      </pre>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-purple-900 bg-opacity-30 p-3 rounded border border-purple-500">
          <div className="font-semibold text-purple-300 mb-1">Time Complexity:</div>
          <div className="text-gray-300">O(2^n) - Exponential</div>
        </div>
        <div className="bg-blue-900 bg-opacity-30 p-3 rounded border border-blue-500">
          <div className="font-semibold text-blue-300 mb-1">Space Complexity:</div>
          <div className="text-gray-300">O(n) - Recursion depth</div>
        </div>
      </div>
    </div>
  )
}

export default AlgorithmPanel
