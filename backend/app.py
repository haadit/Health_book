import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import os
import time
import pickle
from sklearn.preprocessing import StandardScaler
import argparse

# Define yoga poses
YOGA_POSES = ['Mountain Pose', 'Tree Pose', 'Warrior Pose', 'Downward Dog', 'Cobra Pose']

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Function to extract landmarks from MediaPipe results
def extract_landmarks(results):
    landmarks = []
    if results.pose_landmarks:
        for landmark in results.pose_landmarks.landmark:
            landmarks.append([landmark.x, landmark.y, landmark.z, landmark.visibility])
    return np.array(landmarks)

# Function to preprocess landmarks for the model
def preprocess_landmarks(landmarks_array):
    if landmarks_array.size == 0:
        return None
        
    # Flatten the landmarks array
    flattened = landmarks_array.flatten()
    
    # Calculate pairwise distances between landmarks
    distances = []
    for i in range(len(landmarks_array)):
        for j in range(i+1, len(landmarks_array)):
            dist = np.linalg.norm(landmarks_array[i, :2] - landmarks_array[j, :2])
            distances.append(dist)
    
    features = np.concatenate([flattened, np.array(distances)])
    return features

# Function to provide feedback on pose correctness
def provide_feedback(pose_name, landmarks):
    if landmarks.size == 0:
        return ["No pose detected"]
        
    feedback = []
    
    if pose_name == "Mountain Pose":
        # Check if shoulders are level
        left_shoulder = landmarks[11][:2]
        right_shoulder = landmarks[12][:2]
        
        if abs(left_shoulder[1] - right_shoulder[1]) > 0.05:
            feedback.append("Keep your shoulders level")
            
        # Check if standing straight
        hip_center = (landmarks[23][:2] + landmarks[24][:2]) / 2
        shoulder_center = (landmarks[11][:2] + landmarks[12][:2]) / 2
        
        if abs(hip_center[0] - shoulder_center[0]) > 0.05:
            feedback.append("Align your hips and shoulders")
    
    elif pose_name == "Tree Pose":
        # Check if one foot is raised
        left_ankle = landmarks[27][:2]
        right_ankle = landmarks[28][:2]
        
        if abs(left_ankle[1] - right_ankle[1]) < 0.1:
            feedback.append("Raise one foot against the inner thigh of the standing leg")
    
    elif pose_name == "Warrior Pose":
        # Check if arms are extended
        left_wrist = landmarks[15][:2]
        right_wrist = landmarks[16][:2]
        left_shoulder = landmarks[11][:2]
        right_shoulder = landmarks[12][:2]
        
        left_arm_extension = np.linalg.norm(left_wrist - left_shoulder)
        right_arm_extension = np.linalg.norm(right_wrist - right_shoulder)
        
        if left_arm_extension < 0.15 or right_arm_extension < 0.15:
            feedback.append("Extend your arms fully")
            
        # Check if legs are in position
        left_ankle = landmarks[27][:2]
        right_ankle = landmarks[28][:2]
        left_hip = landmarks[23][:2]
        right_hip = landmarks[24][:2]
        
        if abs(left_ankle[0] - right_ankle[0]) < 0.1:
            feedback.append("Widen your stance")
    
    elif pose_name == "Downward Dog":
        # Check if forming an inverted V
        head = landmarks[0][:2]
        hip_center = (landmarks[23][:2] + landmarks[24][:2]) / 2
        ankle_center = (landmarks[27][:2] + landmarks[28][:2]) / 2
        
        if head[1] > hip_center[1]:
            feedback.append("Lower your head below your hips")
            
        if hip_center[1] < ankle_center[1]:
            feedback.append("Raise your hips higher")
    
    elif pose_name == "Cobra Pose":
        # Check if chest is lifted
        shoulder_center = (landmarks[11][:2] + landmarks[12][:2]) / 2
        hip_center = (landmarks[23][:2] + landmarks[24][:2]) / 2
        
        if shoulder_center[1] > hip_center[1]:
            feedback.append("Lift your chest higher")
    
    # If no specific issues found, provide general feedback
    if not feedback:
        feedback.append("Good form! Hold the pose and breathe deeply")
    
    return feedback

# Function to run the yoga pose detection system
def run_yoga_detection(model_path=None, scaler_path=None, camera_id=0, demo_mode=False, selected_pose=None):
    # Check if model and scaler exist, otherwise use demo mode
    if (model_path is None or not os.path.exists(model_path) or 
        scaler_path is None or not os.path.exists(scaler_path)):
        print("Model or scaler not found. Running in demo mode.")
        demo_mode = True
    
    # Load model and scaler if not in demo mode
    if not demo_mode:
        try:
            model = load_model(model_path)
            with open(scaler_path, 'rb') as f:
                scaler = pickle.load(f)
            print("Model and scaler loaded successfully!")
        except Exception as e:
            print(f"Error loading model or scaler: {e}")
            print("Running in demo mode instead.")
            demo_mode = True
    
    # Open webcam
    cap = cv2.VideoCapture(camera_id)
    if not cap.isOpened():
        print(f"Error: Could not open camera {camera_id}")
        return
    
    # Set webcam properties
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    # Create window
    cv2.namedWindow('Yoga Pose Detection', cv2.WINDOW_NORMAL)
    
    # Initialize pose detection
    with mp_pose.Pose(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5) as pose:
        
        # Variables for FPS calculation
        prev_time = 0
        fps = 0
        
        while cap.isOpened():
            # Read frame from webcam
            success, frame = cap.read()
            if not success:
                print("Error: Failed to read frame from camera")
                break
            
            # Calculate FPS
            current_time = time.time()
            if (current_time - prev_time) > 0:
                fps = 1 / (current_time - prev_time)
            prev_time = current_time
            
            # Flip the frame horizontally for a selfie-view display
            frame = cv2.flip(frame, 1)
            
            # Convert the BGR image to RGB
            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Process the image and detect pose
            results = pose.process(image_rgb)
            
            # Create a copy of the frame for drawing
            output_image = frame.copy()
            
            # Draw pose landmarks
            if results.pose_landmarks:
                mp_drawing.draw_landmarks(
                    output_image,
                    results.pose_landmarks,
                    mp_pose.POSE_CONNECTIONS,
                    landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())
            
            # Extract landmarks
            landmarks = extract_landmarks(results)
            
            pose_name = selected_pose if selected_pose else "No pose detected"
            confidence = 0.0
            feedback = ["Stand in the frame to begin"]
            
            if len(landmarks) > 0:
                # Preprocess landmarks
                features = preprocess_landmarks(landmarks)
                
                if features is not None:
                    if demo_mode:
                        # In demo mode, randomly select a pose if no pose is selected
                        if not selected_pose:
                            pose_idx = np.random.randint(0, len(YOGA_POSES))
                            pose_name = YOGA_POSES[pose_idx]
                        confidence = np.random.uniform(0.7, 1.0)
                    else:
                        # Use the trained model to predict the pose
                        features_scaled = scaler.transform([features])
                        prediction = model.predict(features_scaled)[0]
                        
                        if selected_pose:
                            # If a pose is selected, get its confidence
                            pose_idx = YOGA_POSES.index(selected_pose)
                            confidence = prediction[pose_idx]
                        else:
                            # Otherwise, predict the most likely pose
                            pose_idx = np.argmax(prediction)
                            pose_name = YOGA_POSES[pose_idx]
                            confidence = prediction[pose_idx]
                    
                    # Get feedback on pose correctness
                    feedback = provide_feedback(pose_name, landmarks)
            
            # Print results for the Node.js process to capture
            print(f"Pose: {pose_name}")
            print(f"Confidence: {confidence:.2f}")
            for fb in feedback:
                print(f"feedback: {fb}")
            
            # Add pose name and confidence to the frame
            cv2.putText(output_image, f"Pose: {pose_name}", (10, 30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(output_image, f"Confidence: {confidence:.2f}", (10, 60), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            # Add FPS to the frame
            cv2.putText(output_image, f"FPS: {fps:.1f}", (10, 90), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            # Add feedback to the frame
            y_pos = 120
            for fb in feedback:
                cv2.putText(output_image, fb, (10, y_pos), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                y_pos += 30
            
            # Add instructions
            cv2.putText(output_image, "Press 'q' to quit", (10, output_image.shape[0] - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            # Display the frame
            cv2.imshow('Yoga Pose Detection', output_image)
            
            # Check for key press
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
    
    # Release resources
    cap.release()
    cv2.destroyAllWindows()
    print("Yoga pose detection stopped")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Yoga Pose Detection System')
    parser.add_argument('--model', type=str, default='models/yoga_model.h5',
                        help='Path to the trained model file')
    parser.add_argument('--scaler', type=str, default='models/yoga_scaler.pkl',
                        help='Path to the scaler file')
    parser.add_argument('--camera', type=int, default=0,
                        help='Camera device ID (default: 0)')
    parser.add_argument('--demo', action='store_true',
                        help='Run in demo mode without a trained model')
    parser.add_argument('--pose', type=str, choices=YOGA_POSES,
                        help='Specific pose to validate')
    
    args = parser.parse_args()
    
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    run_yoga_detection(args.model, args.scaler, args.camera, args.demo, args.pose)