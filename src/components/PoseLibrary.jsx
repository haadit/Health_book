import React, { useState } from 'react';

import img1 from './poses/warrior1.png';
import img2 from './poses/warrior2.png';
import img3 from './poses/mountain.png';
import img4 from './poses/tree.png';
import img5 from './poses/warrior3.png';
import img6 from './poses/wheel.png';
import img7 from './poses/child.png';
import img8 from './poses/seatedtwist.png';
import img9 from './poses/cobra.png';
import img10 from './poses/bridge.png';
import img11 from './poses/wheel.png';
import img12 from './poses/downdog.png';
import img13 from './poses/headstand.png';
import img14 from './poses/shoulderstand.png';
import img15 from './poses/seatedtwist.png';
import img16 from './poses/bridge.png';

function PoseLibrary() {
  const [filters, setFilters] = useState({
    difficulty: '',
    category: ''
  });

  
  const poses = [
    // Standing Poses
    {
      id: 1,
      name: 'Warrior I (Virabhadrasana I)',
      difficulty: 'Intermediate',
      description: 'A standing pose that strengthens your legs, opens your hips and chest, and improves balance and stability.',
      benefits: ['Strengthens legs and core', 'Opens hips and chest', 'Improves balance', 'Builds concentration'],
      image: img1,
      category: 'Standing Poses'
    },
    {
      id: 2,
      name: 'Warrior II (Virabhadrasana II)',
      difficulty: 'Intermediate',
      description: 'A powerful standing pose that strengthens the legs while opening the hips and shoulders.',
      benefits: ['Builds leg strength', 'Increases hip flexibility', 'Improves stamina', 'Enhances focus'],
      image: img2,
      category: 'Standing Poses'
    },
    {
      id: 3,
      name: 'Mountain Pose (Tadasana)',
      difficulty: 'Beginner',
      description: 'The foundation of all standing poses, teaching proper alignment and body awareness.',
      benefits: ['Improves posture', 'Strengthens thighs and ankles', 'Increases body awareness', 'Reduces anxiety'],
      image: img3,
      category: 'Standing Poses'
    },

    // Balance Poses
    {
      id: 4,
      name: 'Tree Pose (Vrksasana)',
      difficulty: 'Beginner',
      description: 'A balancing pose that strengthens your legs and core while improving your focus and concentration.',
      benefits: ['Improves balance', 'Strengthens legs', 'Increases focus', 'Calms the mind'],
        image: img4,
      category: 'Balance Poses'
    },
    {
      id: 5,
      name: 'Eagle Pose (Garudasana)',
      difficulty: 'Intermediate',
      description: 'A challenging balance pose that works on concentration while strengthening and stretching the body.',
      benefits: ['Enhances balance', 'Improves concentration', 'Strengthens legs', 'Stretches upper back'],
      image: img5,
      category: 'Balance Poses'
    },
    {
      id: 6,
      name: 'Half Moon Pose (Ardha Chandrasana)',
      difficulty: 'Advanced',
      description: 'A standing balance pose that challenges stability while opening the hips and strengthening the legs.',
      benefits: ['Improves balance', 'Strengthens core', 'Opens hips', 'Builds confidence'],
      image: img6,
      category: 'Balance Poses'
    },

    // Floor Poses
    {
      id: 7,
      name: 'Child\'s Pose (Balasana)',
      difficulty: 'Beginner',
      description: 'A resting pose that gently stretches the back, hips, thighs, and ankles while promoting relaxation.',
      benefits: ['Relaxes the body', 'Stretches back and hips', 'Calms the mind', 'Relieves stress'],
      image: img7,
      category: 'Floor Poses'
    },
    {
      id: 8,
      name: 'Seated Forward Bend (Paschimottanasana)',
      difficulty: 'Beginner',
      description: 'A seated forward bend that stretches the entire back of the body and promotes calm.',
      benefits: ['Stretches spine', 'Calms nervous system', 'Improves digestion', 'Reduces stress'],
      image: img8,
      category: 'Floor Poses'
    },

    // Backbends
    {
      id: 9,
      name: 'Cobra Pose (Bhujangasana)',
      difficulty: 'Beginner',
      description: 'A backbend that strengthens the spine and opens the chest while stimulating abdominal organs.',
      benefits: ['Strengthens spine', 'Opens chest', 'Improves posture', 'Increases flexibility'],
      image: img9,
      
      category: 'Backbends'
    },
    {
      id: 10,
      name: 'Bridge Pose (Setu Bandha Sarvangasana)',
      difficulty: 'Intermediate',
      description: 'A gentle backbend that opens the chest and strengthens the back while energizing the body.',
      benefits: ['Opens chest', 'Strengthens back', 'Improves circulation', 'Reduces anxiety'],
      image: img10,
      category: 'Backbends'
    },
    {
      id: 11,
      name: 'Wheel Pose (Urdhva Dhanurasana)',
      difficulty: 'Advanced',
      description: 'A deep backbend that opens the entire front body while strengthening the back and arms.',
      benefits: ['Increases flexibility', 'Strengthens arms and legs', 'Energizes body', 'Improves posture'],
      image: img11,
      category: 'Backbends'
    },

    // Inversions
    {
      id: 12,
      name: 'Downward Dog (Adho Mukha Svanasana)',
      difficulty: 'Beginner',
      description: 'An inversion pose that stretches and strengthens the entire body while calming the mind.',
      benefits: ['Full body stretch', 'Strengthens arms and legs', 'Energizes the body', 'Relieves stress'],
      image: img12,
      category: 'Inversions'
    },
    {
      id: 13,
      name: 'Headstand (Sirsasana)',
      difficulty: 'Advanced',
      description: 'The king of all yoga poses, this inversion builds strength, balance, and focus.',
      benefits: ['Builds strength', 'Improves balance', 'Increases focus', 'Boosts confidence'],
      image: img13,
      category: 'Inversions'
    },
    {
      id: 14,
      name: 'Shoulder Stand (Sarvangasana)',
      difficulty: 'Advanced',
      description: 'An inverted pose that calms the nervous system and improves circulation.',
      benefits: ['Calms mind', 'Improves circulation', 'Strengthens core', 'Promotes sleep'],
      image: img14,
      category: 'Inversions'
    },

    // Twists
    {
      id: 15,
      name: 'Seated Twist (Ardha Matsyendrasana)',
      difficulty: 'Intermediate',
      description: 'A seated twist that improves spinal mobility and aids digestion.',
      benefits: ['Improves digestion', 'Increases spine mobility', 'Detoxifies organs', 'Reduces stress'],
      image: img15,
      category: 'Twists'
    },
    {
      id: 16,
      name: 'Revolved Triangle (Parivrtta Trikonasana)',
      difficulty: 'Advanced',
      description: 'A standing twist that combines strength, balance, and flexibility.',
      benefits: ['Strengthens legs', 'Improves balance', 'Increases flexibility', 'Detoxifies body'],
      image: img16,
      category: 'Twists'
    }
  ];

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter poses based on selected filters
  const filteredPoses = poses.filter(pose => {
    const matchesDifficulty = !filters.difficulty || pose.difficulty === filters.difficulty;
    const matchesCategory = !filters.category || pose.category === filters.category;
    return matchesDifficulty && matchesCategory;
  });

  // Get unique categories and difficulties for filter options
  const categories = [...new Set(poses.map(pose => pose.category))];
  const difficulties = [...new Set(poses.map(pose => pose.difficulty))];

  return (
    <div className="pose-library">
      <div className="pose-library-header">
        <h2>Yoga Pose Library</h2>
        <p>Explore our collection of yoga poses with detailed instructions and benefits</p>
      </div>

      <div className="pose-filters">
        <select 
          className="pose-filter"
          name="difficulty"
          value={filters.difficulty}
          onChange={handleFilterChange}
        >
          <option value="">All Difficulties</option>
          {difficulties.map(difficulty => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>

        <select 
          className="pose-filter"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="poses-grid">
        {filteredPoses.length > 0 ? (
          filteredPoses.map((pose) => (
            <div key={pose.id} className="pose-card">
              <div className="pose-card-image">
                <img src={pose.image} alt={pose.name} />
                <div className="pose-difficulty">{pose.difficulty}</div>
              </div>
              <div className="pose-card-content">
                <h3>{pose.name}</h3>
                <p className="pose-category">{pose.category}</p>
                <p className="pose-description">{pose.description}</p>
                <div className="pose-benefits">
                  <h4>Benefits:</h4>
                  <ul>
                    {pose.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                <button className="validate-pose-btn" onClick={() => navigate(`/PoseValidator`)}>
                  Try This Pose
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-poses-message">
            No poses found matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default PoseLibrary; 