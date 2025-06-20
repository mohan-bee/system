import { Check, Loader, Power, Trophy, Star, Crown, Zap, Target, Rocket } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const Points = () => {
  const defaultTasks = [
    { id: 1, name: "Go to gym", status: "not yet", xp: 20 },
    { id: 2, name: "Read for 30 minutes", status: "not yet", xp: 15 },
    { id: 3, name: "Drink 3 jug of water", status: "not yet", xp: 10 },
    { id: 4, name: "Cook a healthy meal", status: "not yet", xp: 15 },
    { id: 5, name: "Take creatine", status: "not yet", xp: 5 },
    { id: 6, name: "Read one chapter", status: "not yet", xp: 10 },
    { id: 7, name: "Learn for 1 hour", status: "not yet", xp: 15 },
    { id: 8, name: "Learn for 2 hours", status: "not yet", xp: 30 },
    { id: 9, name: "Learn for 3 hours", status: "not yet", xp: 50 },
    { id: 12, name: "Take a 30-minute walk", status: "not yet", xp: 10 },
    { id: 13, name: "Clean your room", status: "not yet", xp: 10 },
    { id: 14, name: "Sleep 8 hours", status: "not yet", xp: 10 },
    { id: 15, name: "Plan tomorrow's tasks", status: "not yet", xp: 5 }
  ]


  const levels = [
    { level: 1, minXP: 0, maxXP: 499, title: "Beginner", icon: Target, color: "text-gray-600", bgColor: "bg-gray-100" },
    { level: 2, minXP: 500, maxXP: 999, title: "Motivated", icon: Zap, color: "text-blue-600", bgColor: "bg-blue-100" },
    { level: 3, minXP: 1000, maxXP: 1499, title: "Focused", icon: Star, color: "text-purple-600", bgColor: "bg-purple-100" },
    { level: 4, minXP: 1500, maxXP: 2499, title: "Dedicated", icon: Trophy, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { level: 5, minXP: 2500, maxXP: 3999, title: "Champion", icon: Crown, color: "text-orange-600", bgColor: "bg-orange-100" },
    { level: 6, minXP: 4000, maxXP: Infinity, title: "Legend", icon: Rocket, color: "text-red-600", bgColor: "bg-red-100" }
  ]

  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('dailyTasks')) ||  defaultTasks)
  const [earnedXP, setEarnedXP] = useState(localStorage.getItem('earnedXP') || 0)
  const [totalLifetimeXP, setTotalLifetimeXP] = useState(localStorage.getItem('totalLifetimeXP') || 0)
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString())

  // Get current level based on lifetime XP
  const getCurrentLevel = () => {
    return levels.find(level => totalLifetimeXP >= level.minXP && totalLifetimeXP <= level.maxXP) || levels[0]
  }

  const getNextLevel = () => {
    const currentLevel = getCurrentLevel()
    return levels.find(level => level.level === currentLevel.level + 1)
  }

  const getProgressToNextLevel = () => {
    const currentLevel = getCurrentLevel()
    const nextLevel = getNextLevel()
    
    if (!nextLevel) return 100 // Max level reached
    
    const progressInCurrentLevel = totalLifetimeXP - currentLevel.minXP
    const totalXPNeededForNextLevel = nextLevel.minXP - currentLevel.minXP
    
    return Math.min((progressInCurrentLevel / totalXPNeededForNextLevel) * 100, 100)
  }

  useEffect(() => {
    const savedTasks = localStorage.getItem('dailyTasks')
    const savedXP = localStorage.getItem('earnedXP')
    const savedLifetimeXP = localStorage.getItem('totalLifetimeXP')
    const savedDate = localStorage.getItem('lastResetDate')
    
    const today = new Date().toDateString()
    
    // Load lifetime XP first (always load this)
    if (savedLifetimeXP) {
      setTotalLifetimeXP(parseInt(savedLifetimeXP))
      localStorage.setItem("xp", totalLifetimeXP)
    }
    
    // Check if it's a new day
    if (savedDate && savedDate !== today) {
      // Reset daily tasks but keep lifetime XP
      setTasks(defaultTasks)
      setEarnedXP(0)
      setLastResetDate(today)
      localStorage.setItem('dailyTasks', JSON.stringify(defaultTasks))
      localStorage.setItem('earnedXP', '0')
      localStorage.setItem('lastResetDate', today)
    } else {
      // Load saved data if same day OR first time loading
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
      if (savedXP) {
        setEarnedXP(parseInt(savedXP))
      }
      if (savedDate) {
        setLastResetDate(savedDate)
      } else {
        // First time user - set today as reset date
        setLastResetDate(today)
        localStorage.setItem('lastResetDate', today)
      }
    }
  }, [])

  // Save to localStorage whenever tasks or XP change
  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks))
    localStorage.setItem('earnedXP', earnedXP.toString())
    localStorage.setItem('totalLifetimeXP', totalLifetimeXP.toString())
  }, [tasks, earnedXP, totalLifetimeXP])

  const getStatusIcon = (status) => {
    switch (status) {
      case "not yet":
        return <Power className="w-4 h-4 text-red-500" />
      case "progress":
        return <Loader className="w-4 h-4 text-yellow-500 animate-spin" />
      case "completed":
        return <Check className="w-4 h-4 text-green-500" />
      default:
        return <Power className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "not yet":
        return "border-red-200 bg-red-50 cursor-pointer hover:bg-red-100 hover:scale-105"
      case "progress":
        return "border-yellow-200 bg-yellow-50 cursor-pointer hover:bg-yellow-100 hover:scale-105"
      case "completed":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const handleTaskClick = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.status === "not yet") {
            return { ...task, status: "progress" }
          } else if (task.status === "progress") {
            setEarnedXP(prev => prev + task.xp)
            setTotalLifetimeXP(prev => prev + task.xp)
            return { ...task, status: "completed" }
          }
        }
        return task
      })
    )
  }

  const currentLevel = getCurrentLevel()
  const nextLevel = getNextLevel()
  const progress = getProgressToNextLevel()
  const LevelIcon = currentLevel.icon

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header with Level System */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Daily Quest Board</h1>
        
        {/* Level Display */}
        <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${currentLevel.bgColor} mb-4`}>
          <LevelIcon className={`w-8 h-8 ${currentLevel.color}`} />
          <div className="text-left">
            <div className={`text-lg font-bold ${currentLevel.color}`}>
              Level {currentLevel.level} - {currentLevel.title}
            </div>
            <div className="text-sm text-gray-600">
              {totalLifetimeXP} XP Total
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {nextLevel && (
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress to {nextLevel.title}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {nextLevel.minXP - totalLifetimeXP} XP to next level
            </div>
          </div>
        )}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => handleTaskClick(task.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${getStatusColor(task.status)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(task.status)}
                <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                  {task.name}
                </h3>
              </div>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex-shrink-0">
                +{task.xp}
              </span>
            </div>
            <div className="ml-6">
              <span className={`text-xs font-medium capitalize ${
                task.status === "completed" ? "text-green-700" :
                task.status === "progress" ? "text-yellow-700" : "text-red-700"
              }`}>
                {task.status === "not yet" ? "Not started" : task.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Today's XP</p>
              <p className="text-2xl font-bold text-green-600">{earnedXP}</p>
            </div>
            <Zap className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Possible Today</p>
              <p className="text-2xl font-bold text-blue-600">
                {tasks.reduce((total, task) => total + task.xp, 0)}
              </p>
            </div>
            <Target className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100)}%
              </p>
            </div>
            <Trophy className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Tasks reset daily at midnight • {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default Points