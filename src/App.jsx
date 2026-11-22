
import { useState, useEffect } from 'react'
import './App.css'
import LandingPage from './LandingPage'

const initialTasks = [
  {
    id: 1,
    title: 'DBMS Assignment',
    category: 'Assignment',
    subject: 'Database Management',
    date: '2026-11-21',
    priority: 'High',
    completed: false
  },
  {
    id: 2,
    title: 'Data Structures Exam',
    category: 'Exam',
    subject: 'Computer Science',
    date: '2026-11-23',
    priority: 'High',
    completed: false
  },
  {
    id: 3,
    title: 'Laptop Warranty',
    category: 'Purchase',
    subject: 'Electronics',
    date: '2026-11-25',
    priority: 'Medium',
    completed: false
  }
]

function App() {

  const [showDashboard, setShowDashboard] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState(
  'Notification' in window ? Notification.permission : 'unsupported'
)

function enableNotifications() {
  if (!('Notification' in window)) {
    alert('Your browser does not support notifications.')
    return
  }

  Notification.requestPermission().then(permission => {
    setNotificationPermission(permission)

    if (permission === 'granted') {
      alert('Notifications enabled successfully!')
    }
  })
}

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('duewise-tasks')
      return saved ? JSON.parse(saved) : initialTasks
    } catch {
      return initialTasks
    }
  })

  const [category, setCategory] = useState('All')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Assignment',
    subject: '',
    date: '',
    priority: 'Medium'
  })

  useEffect(() => {
    localStorage.setItem('duewise-tasks', JSON.stringify(tasks))
  }, [tasks])

useEffect(() => {
  if (
    notificationPermission !== 'granted' ||
    !('Notification' in window)
  ) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let notified = []

  try {
    notified = JSON.parse(
      localStorage.getItem('duewise-notifications') || '[]'
    )
  } catch {
    notified = []
  }

  tasks.forEach(task => {
    if (task.completed) return

    const reminders = [
      { date: task.date, label: 'Deadline' },
      { date: task.returnDate, label: 'Return deadline' },
      { date: task.warrantyDate, label: 'Warranty expiry' }
    ].filter(item => item.date)

    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.date + 'T00:00:00')
      const days = Math.round(
        (reminderDate - today) / (1000 * 60 * 60 * 24)
      )
if ([0, 1, 3, 7, 30].includes(days)) {
        const key = `${task.id}-${reminder.label}-${reminder.date}-${days}`

        if (!notified.includes(key)) {
          new Notification(`DueWise: ${reminder.label}`, {
body: `${task.title}: ${reminder.label} ${
  days === 0 ? 'is today' :
  days === 1 ? 'is tomorrow' :
  `is in ${days} days`
}!`
          })

          notified.push(key)
        }
      }
    })
  })

  localStorage.setItem(
    'duewise-notifications',
    JSON.stringify(notified)
  )
}, [tasks, notificationPermission])


  const categories = ['All', 'Assignment', 'Exam', 'Purchase']
const filteredTasks = tasks.filter(task =>
  category === 'All' ||
  category === 'Calendar' ||
  task.category === category
)

  const completedCount = tasks.filter(task => task.completed).length
  const pendingCount = tasks.length - completedCount

  const upcomingCount = tasks.filter(task => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadline = new Date(task.date + 'T00:00:00')
    return !task.completed && deadline >= today
  }).length
  const overdueCount = tasks.filter(task => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(task.date + 'T00:00:00')

  return !task.completed && deadline < today
}).length

const todayCount = tasks.filter(task => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(task.date + 'T00:00:00')

  return !task.completed && deadline.getTime() === today.getTime()
}).length

 function addTask(e) {
  e.preventDefault()

  if (editingTaskId !== null) {
    setTasks(previous =>
      previous.map(task =>
        task.id === editingTaskId
          ? { ...task, ...newTask }
          : task
      )
    )
  } else {
    const task = {
      ...newTask,
      id: Date.now(),
      completed: false
    }

    setTasks(previous => [...previous, task])
  }

  setNewTask({
    title: '',
    category: 'Assignment',
    subject: '',
    date: '',
    priority: 'Medium'
  })

  setEditingTaskId(null)
  setShowForm(false)
}

function openEditForm(task) {
  setNewTask({
  title: task.title,
  category: task.category,
  subject: task.subject,
  date: task.date,
  priority: task.priority
})

  setEditingTaskId(task.id)
  setShowForm(true)
}

  function toggleComplete(id) {
    setTasks(previous =>
      previous.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  function deleteTask(id) {
    setTasks(previous => previous.filter(task => task.id !== id))
  }
function getCalendarDays() {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  return [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1)
  ]
}
  function daysLeft(date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const deadline = new Date(date + 'T00:00:00')
    const difference = Math.ceil(
      (deadline - today) / (1000 * 60 * 60 * 24)
    )

    if (difference < 0) return `${Math.abs(difference)} days overdue`
    if (difference === 0) return 'Due today'
    if (difference === 1) return 'Due tomorrow'
    return `${difference} days left`
  }
if (!showDashboard) {
  return (
    <LandingPage
      onGetStarted={() => setShowDashboard(true)}
    />
  )
}
  return (
    <div className="app-shell">

      {/* Sidebar */}
      <aside className="sidebar">
        <a href="#dashboard" className="brand">
          <span className="brand-mark">D.</span>
          DueWise
        </a>

        <p className="menu-label">WORKSPACE</p>

        {[
          ['Overview', '⌂', 'All'],
          ['Assignments', '▤', 'Assignment'],
          ['Exams', '▧', 'Exam'],
          ['Purchases', '◇', 'Purchase'],
['Calendar', '▦', 'Calendar']
        ].map(([label, icon, value]) => (
          <button
            key={label}
            className={`side-link ${category === value ? 'active' : ''}`}
            onClick={() => setCategory(value)}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}

        <div className="sidebar-bottom">
          <p className="menu-label">YOUR PROGRESS</p>
          <div className="sidebar-progress">
            <strong>
              {tasks.length
                ? Math.round(completedCount / tasks.length * 100)
                : 0}%
            </strong>
            <span>Tasks completed</span>
          </div>
          <p className="sidebar-note">Plan thoughtfully. Stay ahead.</p>
        </div>
      </aside>

      {/* Main dashboard */}
      <main className="main-content">

        <header className="topbar">
          <div>
            <span className="section-label">YOUR PERSONAL WORKSPACE</span>
            <h1>Good to see you! <em>✦</em></h1>
            <p>Let's make today a productive one.</p>
          </div>
<button
  className="add-button"
  onClick={enableNotifications}
  disabled={notificationPermission === 'granted'}
>
  {notificationPermission === 'granted'
    ? '✓ Notifications Enabled'
    : '🔔 Enable Notifications'}
</button>
          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add New
          </button>
        </header>

        {/* Statistics */}
        <section className="stats-grid">

  <div className="stat-card peach">
    <span>▤</span>
    <p>Total Tasks</p>
    <h2>{tasks.length}</h2>
  </div>

  <div className="stat-card sage">
    <span>✓</span>
    <p>Completed</p>
    <h2>{completedCount}</h2>
  </div>

  <div className="stat-card rose">
    <span>◷</span>
    <p>Pending</p>
    <h2>{pendingCount}</h2>
  </div>

  <div className="stat-card lavender">
    <span>↗</span>
    <p>Upcoming</p>
    <h2>{upcomingCount}</h2>
  </div>

  <div className="stat-card rose">
    <span>!</span>
    <p>Overdue</p>
    <h2>{overdueCount}</h2>
  </div>

  <div className="stat-card peach">
    <span>◷</span>
    <p>Due Today</p>
    <h2>{todayCount}</h2>
  </div>

</section>

        {/* Tasks */}
        

   
<section className="tasks-section">

  {category === 'Calendar' ? (
    <>
      <div className="section-heading">
        <div>
          <span className="section-label">PLAN YOUR MONTH</span>
          <h2>Deadline Calendar</h2>
          <p>All your important dates in one place.</p>
        </div>
      </div>

      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1
        ))}>←</button>

        <h2>
          {currentMonth.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          })}
        </h2>

        <button onClick={() => setCurrentMonth(new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        ))}>→</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div className="calendar-weekday" key={day}>{day}</div>
        ))}

        {getCalendarDays().map((day, index) => {
          const dateString = day
            ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : null

          const dayTasks = tasks.filter(task => task.date === dateString)

          return (
            <div className="calendar-day" key={index}>
              {day && <strong>{day}</strong>}

              {dayTasks.map(task => (
                <div
                  className={`calendar-event ${task.category.toLowerCase()}`}
                  key={task.id}
                  title={task.title}
                >
                  {task.title}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </>
  ) : (
    <>
      <div className="section-heading">
        <div>
          <span className="section-label">STAY ON TRACK</span>
          <h2>Upcoming deadlines</h2>
          <p>Everything important, in one place.</p>
        </div>
        <button className="add-button" onClick={() => setShowForm(true)}>
          + Add Task
        </button>
      </div>

      <div className="category-tabs">
        {categories.map(item => (
          <button
            key={item}
            className={category === item ? 'tab selected' : 'tab'}
            onClick={() => setCategory(item)}
          >
            {item === 'All' ? 'All Tasks' : item + 's'}
          </button>
        ))}
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <span>✦</span>
            <h3>Nothing here yet</h3>
            <p>Add a task to get started.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <article className="task-row" key={task.id}>
              <button
                className={`complete-check ${task.completed ? 'checked' : ''}`}
                onClick={() => toggleComplete(task.id)}
                aria-label="Toggle completion"
              >
                {task.completed ? '✓' : ''}
              </button>

              <div className="task-details">
                <h3 className={task.completed ? 'done' : ''}>
                  {task.title}
                </h3>
                <p>{task.subject} · {task.category}</p>
              </div>

              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>

              <span className="deadline-label">
                {daysLeft(task.date)}
              </span>

              <button
                className="edit-button"
                onClick={() => openEditForm(task)}
                title="Edit task"
              >✎</button>

              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
                title="Delete task"
              >×</button>
            </article>
          ))
        )}
      </div>
    </>
  )}

</section>


        {/* Progress */}
        <section className="progress-section">
          <div>
            <span className="section-label">YOUR JOURNEY</span>
            <h2>Small steps. Big progress.</h2>
            <p>
              You've completed {completedCount} out of {tasks.length} tasks.
            </p>
          </div>

          <div className="progress-bar">
            <div
              className="progress-value"
              style={{
                width: `${tasks.length ? completedCount / tasks.length * 100 : 0}%`
              }}
            />
          </div>
        </section>

      </main>

      {/* Add task modal */}
      {showForm && (
        <div className="modal-overlay">
          <form className="task-form" onSubmit={addTask}>

            <div className="form-heading">
              <div>
                <span className="section-label">NEW ENTRY</span>
                <h2>{editingTaskId !== null ? 'Edit task' : 'Add something new'}</h2>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <label>Task name</label>
            <input
              type="text"
              placeholder="e.g. DBMS Assignment"
              value={newTask.title}
              onChange={e => setNewTask({
                ...newTask,
                title: e.target.value
              })}
              required
            />

            <label>Category</label>
            <select
              value={newTask.category}
              onChange={e => setNewTask({
                ...newTask,
                category: e.target.value
              })}
            >
              <option>Assignment</option>
              <option>Exam</option>
              <option>Purchase</option>
            </select>

            <label>Subject / Details</label>
            <input
              type="text"
              placeholder="Enter subject or details"
              value={newTask.subject}
              onChange={e => setNewTask({
                ...newTask,
                subject: e.target.value
              })}
              required
            />

{newTask.category === 'Purchase' && (
  <>
    <label>Purchase Date</label>
    <input
      type="date"
      value={newTask.purchaseDate || ''}
      onChange={e => setNewTask({
        ...newTask,
        purchaseDate: e.target.value
      })}
    />

    <label>Return Deadline</label>
    <input
      type="date"
      value={newTask.returnDate || ''}
      onChange={e => setNewTask({
        ...newTask,
        returnDate: e.target.value
      })}
    />

    <label>Warranty Expiry</label>
    <input
      type="date"
      value={newTask.warrantyDate || ''}
      onChange={e => setNewTask({
        ...newTask,
        warrantyDate: e.target.value
      })}
    />
  </>
)}

            <label>Deadline</label>
            <input
              type="date"
              value={newTask.date}
              onChange={e => setNewTask({
                ...newTask,
                date: e.target.value
              })}
              min="2020-01-01"
              required
            />

            <label>Priority</label>
            <select
              value={newTask.priority}
              onChange={e => setNewTask({
                ...newTask,
                priority: e.target.value
              })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button type="submit" className="submit-button">
  {editingTaskId !== null ? 'Save Changes →' : 'Save Task →'}
</button>
          </form>
        </div>
      )}

    </div>
  )
}

export default App
