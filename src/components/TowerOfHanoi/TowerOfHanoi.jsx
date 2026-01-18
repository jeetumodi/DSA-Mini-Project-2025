import React, { useState, useEffect } from 'react'
import Header from '../Header'
import TowerVisualization from '../TowerVisualization'
import Controls from '../Controls'
import CallStack from '../CallStack'
import AlgorithmPanel from '../AlgorithmPanel'

const TowerOfHanoi = () => {
  const [numDisks, setNumDisks] = useState(3)
  const [towers, setTowers] = useState({ A: [], B: [], C: [] })
  const [moves, setMoves] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [callStack, setCallStack] = useState([])
  const [totalMoves, setTotalMoves] = useState(0)
  const [algorithm, setAlgorithm] = useState('')
  const [animatingDisk, setAnimatingDisk] = useState(null)
  const [mode, setMode] = useState('auto')
  const [selectedDisk, setSelectedDisk] = useState(null)
  const [manualMoves, setManualMoves] = useState(0)
  const [isValidMove, setIsValidMove] = useState(true)
  // TIMING -------------------------------------------------
  // Elapsed-time tracking for Auto mode. If you don't need it, you can
  // remove or comment these lines again.
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  // -------------------------------------------------------

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']

  useEffect(() => {
    resetGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDisks])

  useEffect(() => {
    if (mode === 'auto' && isPlaying && currentStep < moves.length) {
      const timer = setTimeout(() => {
        setCurrentStep((s) => s + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (currentStep >= moves.length) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, moves.length, speed, mode])
  // TIMING: detect finish
  // Compute elapsedTime when the auto-play run finishes.
  useEffect(() => {
    if (moves.length > 0 && currentStep >= moves.length) {
      if (startTime) {
        const now = Date.now()
        setEndTime(now)
        setElapsedTime(now - startTime)
      }
      setIsPlaying(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, moves.length])

  useEffect(() => {
    if (mode === 'auto' && currentStep > 0 && currentStep <= moves.length) {
      const move = moves[currentStep - 1]
      animateMove(move)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, mode])

  const generateAlgorithm = () => {
  return `# Iterative Tower of Hanoi (non-recursive)
# Uses the modulo-3 rule to determine which rods to move between.
# For even n, swap target and auxiliary to get correct move sequence.

function solveIterative(n, source, target, auxiliary):
    total_moves = 2^n - 1
    if n % 2 == 0:
        swap(target, auxiliary)

    for move in 1..total_moves:
        if move % 3 == 1:
            # Move between source and target rods
            CALL Move_Disk_Between_Two_Rods(source, target)
        else if move % 3 == 2:
            # Move between source and auxiliary rods
            CALL Move_Disk_Between_Two_Rods(source, auxiliary)
        else:
            # move % 3 == 0
            # Move between auxiliary and target rods
            CALL Move_Disk_Between_Two_Rods(auxiliary, target)

function Move_Disk_Between_Two_Rods(rod1, rod2):
    # Move smaller top disk onto larger one or to an empty rod
    if rod1 is empty:
        move top disk from rod2 → rod1
    else if rod2 is empty:
        move top disk from rod1 → rod2
    else if top(rod1) > top(rod2):
        move top disk from rod2 → rod1
    else:
        move top disk from rod1 → rod2`
}


  // Iterative move generator (non-recursive)
  // Simulates the pegs and produces the sequence of moves.
  const solveHanoi = (n, source, target, auxiliary) => {
    const movesList = []

    // Initialize pegs with arrays (top at end)
    const pegs = {
      [source]: Array.from({ length: n }, (_, i) => n - i),
      [target]: [],
      [auxiliary]: []
    }

    const totalMoves = Math.pow(2, n) - 1

    // For even n, swap target and auxiliary to get the correct rotation for the smallest disk
    let dst = target
    let aux = auxiliary
    if (n % 2 === 0) {
      dst = auxiliary
      aux = target
    }

    const names = [source, dst, aux]

    // Helper to record a move
    const recordMove = (from, to) => {
      const disk = pegs[from].pop()
      if (disk === undefined) return
      pegs[to].push(disk)
      movesList.push({
        from,
        to,
        disk,
        stack: [`iterative step ${movesList.length + 1}`],
        description: `Move disk ${disk} from ${from} to ${to}`
      })
    }

    for (let i = 1; i <= totalMoves; i++) {
      if (i % 2 === 1) {
        // Move the smallest disk to the next peg in rotation
        // Find which peg has disk 1
        let fromIdx = names.findIndex((p) => pegs[p].length && pegs[p][pegs[p].length - 1] === 1)
        if (fromIdx === -1) {
          // fallback: search anywhere
          fromIdx = names.findIndex((p) => pegs[p].includes(1))
        }
        const toIdx = (fromIdx + 1) % 3
        recordMove(names[fromIdx], names[toIdx])
      } else {
        // Make the only legal move that doesn't involve the smallest disk
        const withoutSmall = names.filter((p) => !(pegs[p].length && pegs[p][pegs[p].length - 1] === 1))
        const p1 = withoutSmall[0]
        const p2 = withoutSmall[1]

        const top1 = pegs[p1].length ? pegs[p1][pegs[p1].length - 1] : Infinity
        const top2 = pegs[p2].length ? pegs[p2][pegs[p2].length - 1] : Infinity

        if (top1 < top2) {
          recordMove(p1, p2)
        } else {
          recordMove(p2, p1)
        }
      }
    }

    return movesList
  }

  const resetGame = () => {
    const initialTowers = {
      A: Array.from({ length: numDisks }, (_, i) => numDisks - i),
      B: [],
      C: []
    }
    setTowers(initialTowers)
    const generatedMoves = solveHanoi(numDisks, 'A', 'C', 'B')
    setMoves(generatedMoves)
    setCurrentStep(0)
    setIsPlaying(false)
    setCallStack([])
    setTotalMoves(generatedMoves.length)
    setAlgorithm(generateAlgorithm())
    setAnimatingDisk(null)
    setSelectedDisk(null)
    setManualMoves(0)
    setIsValidMove(true)
    // Clear timing
    setStartTime(null)
    setEndTime(null)
    setElapsedTime(0)
  }

  const animateMove = (move) => {
    const disk = towers[move.from][towers[move.from].length - 1]

    setAnimatingDisk({
      disk,
      from: move.from,
      to: move.to
    })

    setCallStack(move.stack || [])

    setTimeout(() => {
      setTowers((prevTowers) => {
        const newTowers = {
          A: [...prevTowers.A],
          B: [...prevTowers.B],
          C: [...prevTowers.C]
        }

        const movedDisk = newTowers[move.from].pop()
        if (movedDisk !== undefined) {
          newTowers[move.to].push(movedDisk)
        }

        return newTowers
      })

      setAnimatingDisk(null)
    }, 800)
  }

  const handlePlayPause = () => {
    if (currentStep >= moves.length) {
      // If finished: reset then immediately start a new run and timing
      resetGame()
      setTimeout(() => {
        setStartTime(Date.now())
        setIsPlaying(true)
      }, 0)
      return
    }

    // Starting fresh from step 0 -> mark start time
    if (!isPlaying && currentStep === 0) {
      setStartTime(Date.now())
      setEndTime(null)
      setElapsedTime(0)
    }

    setIsPlaying((p) => !p)
  }

  const handleNext = () => {
    if (currentStep < moves.length && !animatingDisk) {
      setCurrentStep((s) => s + 1)
    }
  }

  const canMoveDisk = (from, to) => {
    if (towers[from].length === 0) return false
    if (towers[to].length === 0) return true

    const diskToMove = towers[from][towers[from].length - 1]
    const topDiskOnTarget = towers[to][towers[to].length - 1]

    return diskToMove < topDiskOnTarget
  }

  const handleDiskClick = (tower) => {
    if (animatingDisk || mode === 'auto') return

    const topDisk = towers[tower][towers[tower].length - 1]

    if (selectedDisk === null) {
      if (towers[tower].length > 0) {
        setSelectedDisk({ disk: topDisk, from: tower })
      }
    } else {
      if (selectedDisk.from === tower) {
        setSelectedDisk(null)
      } else {
        if (canMoveDisk(selectedDisk.from, tower)) {
          animateManualMove(selectedDisk.from, tower)
          setManualMoves((m) => m + 1)
          setIsValidMove(true)
        } else {
          setIsValidMove(false)
          setTimeout(() => setIsValidMove(true), 500)
        }
        setSelectedDisk(null)
      }
    }
  }

  const animateManualMove = (from, to) => {
    const disk = towers[from][towers[from].length - 1]

    setAnimatingDisk({
      disk,
      from,
      to
    })

    setTimeout(() => {
      setTowers((prevTowers) => {
        const newTowers = {
          A: [...prevTowers.A],
          B: [...prevTowers.B],
          C: [...prevTowers.C]
        }

        const movedDisk = newTowers[from].pop()
        if (movedDisk !== undefined) {
          newTowers[to].push(movedDisk)
        }

        return newTowers
      })

      setAnimatingDisk(null)
    }, 800)
  }

  const getDiskWidth = (disk) => {
    return 40 + disk * 20
  }

  const getTowerPosition = (tower) => {
    const positions = { A: 0, B: 1, C: 2 }
    return positions[tower]
  }

  const getDiskPosition = (disk, tower, index) => {
    if (animatingDisk && animatingDisk.disk === disk && towers[tower].includes(disk)) {
      return {
        transform: `translateY(-300px)`,
        transition: 'transform 0.4s ease-in-out'
      }
    }

    if (animatingDisk && animatingDisk.disk === disk && !towers[tower].includes(disk)) {
      const fromPos = getTowerPosition(animatingDisk.from)
      const toPos = getTowerPosition(animatingDisk.to)
      const translateX = (toPos - fromPos) * 240

      return {
        transform: `translate(${translateX}px, -300px)`,
        transition: 'transform 0.4s ease-in-out 0.4s'
      }
    }

    return {
      transform: 'translateY(0)',
      transition: 'transform 0.4s ease-in-out 0.8s'
    }
  }

  const isGameWon = () => {
    return towers.C.length === numDisks
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => { setMode('auto'); resetGame(); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'auto'
                ? 'bg-purple-600 border-2 border-purple-400'
                : 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600'
            }`}
          >
            Auto Mode
          </button>
          <button
            onClick={() => { setMode('manual'); resetGame(); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'manual'
                ? 'bg-purple-600 border-2 border-purple-400'
                : 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600'
            }`}
          >
            Manual Mode
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <TowerVisualization
              towers={towers}
              colors={colors}
              getDiskWidth={getDiskWidth}
              getDiskPosition={getDiskPosition}
              handleDiskClick={handleDiskClick}
              selectedDisk={selectedDisk}
              animatingDisk={animatingDisk}
              mode={mode}
              isValidMove={isValidMove}
              manualMoves={manualMoves}
              isGameWon={isGameWon}
            />
          </div>

          <CallStack callStack={callStack} mode={mode} />
        </div>

        <AlgorithmPanel algorithm={algorithm} totalMoves={totalMoves} mode={mode} />

        <Controls
          numDisks={numDisks}
          setNumDisks={setNumDisks}
          speed={speed}
          setSpeed={setSpeed}
          mode={mode}
          isPlaying={isPlaying}
          handlePlayPause={handlePlayPause}
          handleNext={handleNext}
          resetGame={resetGame}
          currentStep={currentStep}
          totalMoves={totalMoves}
          animatingDisk={animatingDisk}
          manualMoves={manualMoves}
          // Pass elapsedTime to Controls
          elapsedTime={elapsedTime}
        />
      </div>
    </div>
  )
}

export default TowerOfHanoi
