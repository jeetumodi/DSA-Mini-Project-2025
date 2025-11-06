import React from 'react'

const CallStack = ({ callStack, mode }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Call Stack</h2>
      <div className="space-y-2 overflow-y-auto max-h-80">
        {callStack.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            {mode === 'manual'
              ? 'Play in Auto mode to see the recursive call stack'
              : 'Stack is empty'}
          </div>
        ) : (
          callStack.slice().reverse().map((call, idx) => (
            <div
              key={idx}
              className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded p-3 font-mono text-sm animate-pulse"
              style={{ animationDuration: '2s' }}
            >
              {call}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CallStack
