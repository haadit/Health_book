import { useState, useEffect, useRef } from 'react';

function MeditationGuide() {
  const [duration, setDuration] = useState(5); // Default 5 minutes
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // Initialize with default duration
  const [currentImage, setCurrentImage] = useState(0);
  const [currentTheme, setCurrentTheme] = useState('nature');
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const audioRef = useRef(null);

  const meditationThemes = {
    nature: {
      name: "Peaceful Nature",
      sound: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_meditation-music-ambient-7b-145285.mp3?filename=meditation-music-ambient-7b-145285.mp3",
      images: [
        {
          id: 1,
          title: "Mountain Lake",
          url: "https://images.unsplash.com/photo-1439853949127-fa647821eba0",
          description: "Serene mountain lake at sunset"
        },
        {
          id: 2,
          title: "Alpine Peaks",
          url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606",
          description: "Majestic mountain peaks in morning light"
        },
        {
          id: 3,
          title: "Forest Lake",
          url: "https://images.unsplash.com/photo-1511497584788-876760111969",
          description: "Tranquil forest lake reflection"
        },
        {
          id: 4,
          title: "Mountain Valley",
          url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
          description: "Peaceful mountain valley vista"
        }
      ]
    },
    ocean: {
      name: "Ocean Serenity",
      sound: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_meditation-music-ambient-7b-145285.mp3?filename=meditation-music-ambient-7b-145285.mp3",
      images: [
        {
          id: 1,
          title: "Calm Waters",
          url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0",
          description: "Peaceful ocean waves at sunset"
        },
        {
          id: 2,
          title: "Ocean Sunset",
          url: "https://images.unsplash.com/photo-1520942702018-0862200e6873",
          description: "Golden sunset over calm ocean"
        },
        {
          id: 3,
          title: "Tropical Beach",
          url: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a",
          description: "Serene tropical beach scene"
        },
        {
          id: 4,
          title: "Ocean Waves",
          url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
          description: "Gentle ocean waves at dusk"
        }
      ]
    },
    zen: {
      name: "Zen Garden",
      sound: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_meditation-music-ambient-7b-145285.mp3?filename=meditation-music-ambient-7b-145285.mp3",
      images: [
        {
          id: 1,
          title: "Stone Garden",
          url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
          description: "Peaceful zen rock garden"
        },
        {
          id: 2,
          title: "Bamboo Grove",
          url: "https://images.unsplash.com/photo-1507334699472-5853ef6483f9",
          description: "Serene bamboo forest"
        },
        {
          id: 3,
          title: "Lotus Pond",
          url: "https://images.unsplash.com/photo-1474557157537-7a152d43dc3f",
          description: "Tranquil lotus flowers"
        },
        {
          id: 4,
          title: "Sand Patterns",
          url: "https://images.unsplash.com/photo-1499728603263-13726abce5fd",
          description: "Calming zen garden patterns"
        }
      ]
    }
  };

  // Update timeLeft when duration changes
  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  // Handle background sounds
  useEffect(() => {
    if (isPlaying && !isSoundMuted) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(meditationThemes[currentTheme].sound);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4; // Increased from 0.15 to 0.4 for better sound levels
      audioRef.current.play().catch(error => {
        console.log('Audio autoplay prevented:', error);
        // Try to play with user interaction
        const playAudio = () => {
          audioRef.current.play().catch(e => console.log('Playback failed:', e));
        };
        document.addEventListener('click', playAudio, { once: true });
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isPlaying, currentTheme, isSoundMuted]);

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

  // Timer for meditation countdown
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Play completion sound
      const alarmSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-timer-1190.mp3');
      alarmSound.volume = 0.5;
      alarmSound.play();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Timer for image slideshow
  useEffect(() => {
    let slideshow;
    if (isPlaying) {
      slideshow = setInterval(() => {
        setCurrentImage(prev => (prev + 1) % meditationThemes[currentTheme].images.length);
      }, 5000); // Change image every 5 seconds
    }
    return () => clearInterval(slideshow);
  }, [isPlaying, currentTheme]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setTimeLeft(duration * 60); // Ensure we start with the current duration
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeLeft(duration * 60);
    setCurrentImage(0);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    if (!isPlaying) {
      setTimeLeft(newDuration * 60); // Update timeLeft immediately if not playing
    }
  };

  const toggleSound = () => {
    setIsSoundMuted(!isSoundMuted);
    if (audioRef.current) {
      if (!isSoundMuted) {
        audioRef.current.pause();
      } else if (isPlaying) {
        audioRef.current.play();
      }
    }
  };

  const handleThemeChange = () => {
    const themes = Object.keys(meditationThemes);
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setCurrentTheme(themes[nextIndex]);
    setCurrentImage(0);
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current = new Audio(meditationThemes[themes[nextIndex]].sound);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4; // Increased from 0.15 to 0.4 for better sound levels
      if (!isSoundMuted) {
        audioRef.current.play().catch(error => console.log('Audio autoplay prevented:', error));
      }
    }
  };

  return (
    <div className="meditation-guide">
      <div className="meditation-header">
        <h2>Meditation Guide</h2>
        <p>Find your inner peace with soothing meditation sessions</p>
      </div>

      <div className="meditation-content">
        {isPlaying && (
          <div className="meditation-background">
            <div 
              className="background-image"
              style={{
                backgroundImage: `url(${meditationThemes[currentTheme].images[currentImage].url})`,
                transition: 'background-image 0.3s ease-in-out'
              }}
            >
              <div className="background-overlay">
                <h3>{meditationThemes[currentTheme].images[currentImage].title}</h3>
                <p>{meditationThemes[currentTheme].images[currentImage].description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="meditation-controls">
          <div className="theme-selector">
            <button 
              className="theme-btn"
              onClick={handleThemeChange}
              disabled={isPlaying}
            >
              Current Theme: {meditationThemes[currentTheme].name}
            </button>
            <button
              className={`sound-btn ${isSoundMuted ? 'muted' : ''}`}
              onClick={toggleSound}
            >
              {isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
            </button>
          </div>

          <div className="timer-settings">
            <h3>Set Your Meditation Duration</h3>
            <div className="duration-selector">
              <button 
                className={`duration-btn ${duration === 5 ? 'active' : ''}`}
                onClick={() => handleDurationChange(5)}
                disabled={isPlaying}
              >
                5 min
              </button>
              <button 
                className={`duration-btn ${duration === 10 ? 'active' : ''}`}
                onClick={() => handleDurationChange(10)}
                disabled={isPlaying}
              >
                10 min
              </button>
              <button 
                className={`duration-btn ${duration === 15 ? 'active' : ''}`}
                onClick={() => handleDurationChange(15)}
                disabled={isPlaying}
              >
                15 min
              </button>
              <button 
                className={`duration-btn ${duration === 20 ? 'active' : ''}`}
                onClick={() => handleDurationChange(20)}
                disabled={isPlaying}
              >
                20 min
              </button>
              <button 
                className={`duration-btn ${duration === 30 ? 'active' : ''}`}
                onClick={() => handleDurationChange(30)}
                disabled={isPlaying}
              >
                30 min
              </button>
            </div>
          </div>

          <div className="timer-display">
            <div className="time">{formatTime(timeLeft)}</div>
            <div className="timer-controls">
              {!isPlaying ? (
                <button className="control-btn start" onClick={handleStart}>
                  Start Meditation
                </button>
              ) : (
                <>
                  <button className="control-btn stop" onClick={handleStop}>
                    Pause
                  </button>
                  <button className="control-btn reset" onClick={handleReset}>
                    Reset
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeditationGuide; 