import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const features = [
    {
      id: 1,
      title: "Easy Spin",
      description: "Simple and intuitive interface for everyone",
      icon: "🎯"
    },
    {
      id: 2,
      title: "Auto Save",
      description: "Your data is automatically saved",
      icon: "💾"
    },
    {
      id: 3,
      title: "Fast",
      description: "Lightning fast performance",
      icon: "⚡"
    }
  ];

  return (
    <section className="hero-section" id="home">
      <div className="hero-container">
        <div className="hero-main">
          <div className="hero-left">
            <h1 className="hero-title">Myat Taw Win Spin Wheel</h1>
            <p className="hero-description">
              Create exciting spin wheel experiences for your games, contests, and decision making.
              Fast, reliable, and easy to use.
            </p>
            <Link to="/spin" className="hero-cta">Get Started</Link>
          </div>

          <div className="hero-right">
            <div className="wheel-container">
              <svg className="spin-wheel" viewBox="0 0 200 200" width="300" height="300">
                <circle cx="100" cy="100" r="90" fill="#667eea" opacity="0.2"/>
                <circle cx="100" cy="100" r="85" fill="none" stroke="#667eea" strokeWidth="2"/>

                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const angle = (i * 45) * Math.PI / 180;
                  const x1 = 100;
                  const y1 = 100;
                  const x2 = 100 + 85 * Math.cos(angle);
                  const y2 = 100 + 85 * Math.sin(angle);
                  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

                  return (
                    <g key={i}>
                      <path
                        d={`M ${x1} ${y1} L ${x2} ${y2} A 85 85 0 0 1 ${100 + 85 * Math.cos((i + 1) * 45 * Math.PI / 180)} ${100 + 85 * Math.sin((i + 1) * 45 * Math.PI / 180)} Z`}
                        fill={colors[i % colors.length]}
                        opacity="0.8"
                      />
                    </g>
                  );
                })}

                <circle cx="100" cy="100" r="15" fill="white"/>
                <circle cx="100" cy="100" r="10" fill="#667eea"/>

                <polygon points="100,10 95,25 105,25" fill="#ff6b6b"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2 className="features-title">Why Choose Our Spin Wheel?</h2>
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
