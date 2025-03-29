import { useState, useEffect } from 'react';
import { statsAPI } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [userStats, setUserStats] = useState({
    totalSessions: 0,
    averageAccuracy: 0,
    recentPoses: [],
    weeklyProgress: Array(7).fill(0),
    poseAccuracies: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await statsAPI.getDashboardStats();
        setUserStats(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h2>Your Yoga Progress</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sessions</h3>
          <p className="stat-number">{userStats.totalSessions}</p>
        </div>
        <div className="stat-card">
          <h3>Average Accuracy</h3>
          <p className="stat-number">{userStats.averageAccuracy}%</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card weekly-progress">
          <h3>Weekly Progress</h3>
          <div className="progress-chart">
            {userStats.weeklyProgress.map((value, index) => (
              <div key={index} className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ height: `${value}%` }}
                >
                  <span className="progress-value">{value}%</span>
                </div>
                <span className="day-label">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card recent-poses">
          <h3>Recent Practice</h3>
          {userStats.recentPoses.length > 0 ? (
            <div className="recent-poses-list">
              {userStats.recentPoses.map((pose, index) => (
                <div key={index} className="recent-pose-item">
                  <div className="pose-info">
                    <h4>{pose.name}</h4>
                    <span className="pose-date">{pose.date}</span>
                  </div>
                  <div className="pose-accuracy">
                    <div className="mini-progress-bar">
                      <div 
                        className="mini-progress-fill"
                        style={{ width: `${pose.accuracy}%` }}
                      />
                    </div>
                    <span>{pose.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">No recent poses practiced</p>
          )}
        </div>

        <div className="dashboard-card pose-breakdown">
          <h3>Pose Breakdown</h3>
          {Object.keys(userStats.poseAccuracies).length > 0 ? (
            <div className="pose-accuracies">
              {Object.entries(userStats.poseAccuracies).map(([pose, accuracy]) => (
                <div key={pose} className="pose-accuracy-item">
                  <span className="pose-name">{pose}</span>
                  <div className="accuracy-bar-container">
                    <div 
                      className="accuracy-bar"
                      style={{ width: `${accuracy}%` }}
                    />
                    <span className="accuracy-value">{accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">No pose data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 