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

  useEffect(() => {
    if (mode === 'auto' && currentStep > 0 && currentStep <= moves.length) {
      const move = moves[currentStep - 1]
      animateMove(move)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, mode])

  const generateAlgorithm = () => {
    return `def hanoi(n, source, target, auxiliary):\n    # Base case: only 1 disk to move\n    if n == 1:\n        move disk from source to target\n        return\n    \n    # Recursive case:\n    # Step 1: Move n-1 disks from source to auxiliary\n    hanoi(n-1, source, auxiliary, target)\n    \n    # Step 2: Move the largest disk to target\n    move disk from source to target\n    \n    # Step 3: Move n-1 disks from auxiliary to target\n    hanoi(n-1, auxiliary, target, source)`
  }

  const solveHanoi = (n, source, target, auxiliary, movesList = [], stack = []) => {
    if (n === 1) {
      movesList.push({
        from: source,
        to: target,
        disk: 1,
        stack: [...stack, `hanoi(1, ${source}, ${target}, ${auxiliary})`],
        description: `Base case: Move disk 1 from ${source} to ${target}`
      })
      return movesList
    }

    const currentCall = `hanoi(${n}, ${source}, ${target}, ${auxiliary})`
    const newStack = [...stack, currentCall]

    solveHanoi(n - 1, source, auxiliary, target, movesList, newStack)

    movesList.push({
      from: source,
      to: target,
      disk: n,
      stack: [...newStack],
      description: `Move disk ${n} from ${source} to ${target}`
    })

    solveHanoi(n - 1, auxiliary, target, source, movesList, newStack)

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
      resetGame()
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
        />
      </div>
    </div>
  )
}

export default TowerOfHanoi
