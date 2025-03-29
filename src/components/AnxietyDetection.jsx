import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const AnxietyDetection = () => {
  const webcamRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [anxietyLevel, setAnxietyLevel] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);

  useEffect(() => {
    let progressInterval;
    if (isAnalyzing) {
      progressInterval = setInterval(() => {
        setDetectionProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(progressInterval);
  }, [isAnalyzing]);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setFaceDetected(true);
    setDetectionProgress(0);

    // Simulated analysis
    setTimeout(() => {
      const randomValue = Math.random();
      let level;
      let stress;

      if (randomValue < 0.33) {
        level = 0; // Low anxiety
        stress = Math.floor(Math.random() * 30) + 10; // 10-40%
      } else if (randomValue < 0.66) {
        level = 1; // Medium anxiety
        stress = Math.floor(Math.random() * 20) + 40; // 40-60%
      } else {
        level = 2; // High anxiety
        stress = Math.floor(Math.random() * 30) + 70; // 70-100%
      }

      setAnxietyLevel(level);
      setStressLevel(stress);
      setIsAnalyzing(false);
    }, 5000);
  };

  const getMeditationRecommendation = () => {
    if (anxietyLevel === 0) {
      return {
        title: "Maintenance Meditation",
        description: "Practice mindful breathing for 5-10 minutes to maintain your calm state.",
        techniques: [
          "Deep breathing exercises",
          "Mindful walking",
          "Simple body scan meditation"
        ]
      };
    } else if (anxietyLevel === 1) {
      return {
        title: "Balancing Meditation",
        description: "Try these 15-minute meditation techniques to restore balance.",
        techniques: [
          "Progressive muscle relaxation",
          "Guided visualization",
          "Mindful breathing with counting"
        ]
      };
    } else {
      return {
        title: "Calming Meditation",
        description: "Focus on these soothing techniques for 20-30 minutes to reduce anxiety.",
        techniques: [
          "Loving-kindness meditation",
          "Extended body scan meditation",
          "Deep breathing with positive affirmations"
        ]
      };
    }
  };

  return (
    <div className="anxiety-detection">
      <div className="webcam-container">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="webcam"
        />
      </div>

      <div className="controls">
        {!isAnalyzing ? (
          <button onClick={startAnalysis} className="analyze-btn">
            Start Analysis
          </button>
        ) : (
          <div className="analysis-status">
            <p>Analyzing facial expressions and patterns...</p>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${detectionProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {faceDetected && !isAnalyzing && anxietyLevel !== null && (
        <div className="analysis-results">
          <h3>Analysis Results</h3>
          
          <div className="stress-level">
            <h4>Stress Level</h4>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${stressLevel}%`,
                  backgroundColor: stressLevel > 70 ? '#ff4d4d' : stressLevel > 40 ? '#ffd700' : '#4CAF50'
                }}
              ></div>
            </div>
            <span className="percentage">{stressLevel}%</span>
          </div>

          {anxietyLevel !== null && (
            <div className="meditation-recommendation">
              <h3>{getMeditationRecommendation().title}</h3>
              <p>{getMeditationRecommendation().description}</p>
              <ul>
                {getMeditationRecommendation().techniques.map((technique, index) => (
                  <li key={index}>{technique}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnxietyDetection; 