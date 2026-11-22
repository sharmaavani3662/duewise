
import './LandingPage.css'

function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-page">

      <nav className="landing-nav">
        <h2>DueWise<span>.</span></h2>
        <span>Your personal planner</span>
        <button onClick={onGetStarted}>
          Open Dashboard →
        </button>
      </nav>

      <main className="landing-hero">
        <p className="eyebrow">A LITTLE MORE ORGANIZED</p>

        <h1>
          Less stress.
          <br />
          <span>More done.</span>
        </h1>

        <p className="hero-description">
          Assignments, exams and purchases —
          keep everything in one place.
          Stay ahead without the last-minute panic.
        </p>

        <button
          className="start-button"
          onClick={onGetStarted}
        >
          Let's get started →
        </button>

        <p className="hero-note">
          Your deadlines deserve attention, not anxiety.
        </p>
      </main>

      <footer className="landing-footer">
        Made for busy days and bigger dreams.
      </footer>

    </div>
  )
}

export default LandingPage
