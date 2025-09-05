import { Exercise } from '@/domain/entities/exercise';
import { ExerciseService } from '@/domain/interfaces/services/ExerciseService';

export class MockExerciseService implements ExerciseService {
  private mockExercises: Exercise[] = [
    new Exercise({
      id: '1',
      name: 'Push-ups',
      alternate_names: ['Press-ups', 'Floor Press'],
      detailed_instructions:
        'Start in a plank position with your arms fully extended and hands placed slightly wider than shoulder-width apart. Keep your body in a straight line from head to heels. Lower your body by bending your elbows until your chest nearly touches the floor. Push back up to the starting position by extending your arms. Maintain proper form throughout the movement.',
      simple_instructions: 'Lower body to floor and push back up',
      muscle_groups: ['Chest', 'Triceps', 'Shoulders'],
      body_part: 'Upper Body',
      equipment_required: [],
      exercise_type: 'strength',
      difficulty_level: 'beginner',
      is_compound: true,
      tags: ['compound', 'upper body'],
      audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image_url:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    }),
    new Exercise({
      id: '2',
      name: 'Squats',
      alternate_names: ['Air Squats', 'Bodyweight Squats'],
      detailed_instructions:
        'Stand with feet shoulder-width apart, toes pointing slightly outward. Keep your chest up and core engaged. Lower your body by bending at the hips and knees, as if sitting back into a chair. Go down until your thighs are parallel to the floor. Drive through your heels to return to the starting position.',
      simple_instructions: 'Sit back and down, then stand back up',
      muscle_groups: ['quadriceps', 'glutes', 'hamstrings'],
      body_part: 'lower body',
      equipment_required: [],
      exercise_type: 'strength',
      difficulty_level: 'beginner',
      is_compound: true,
      tags: ['compound', 'legs'],
      audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image_url:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    }),
    new Exercise({
      id: '3',
      name: 'Plank',
      alternate_names: ['Forearm Plank', 'Front Plank'],
      detailed_instructions:
        'Start in a push-up position, then lower onto your forearms. Keep your body in a straight line from head to heels. Engage your core, glutes, and leg muscles. Hold this position while breathing normally. Avoid letting your hips sag or rise.',
      simple_instructions: 'Hold a straight body position on forearms',
      muscle_groups: ['core', 'shoulders', 'glutes'],
      body_part: 'core',
      equipment_required: [],
      exercise_type: 'isometric',
      difficulty_level: 'intermediate',
      is_compound: false,
      tags: ['core', 'isometric'],
      audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image_url:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    }),
    new Exercise({
      id: '4',
      name: 'Jumping Jacks',
      alternate_names: ['Star Jumps'],
      detailed_instructions:
        'Start standing with feet together and arms at your sides. Jump up while simultaneously spreading your legs shoulder-width apart and raising your arms overhead. Jump again to return to the starting position with feet together and arms at your sides. Maintain a steady rhythm.',
      simple_instructions:
        'Jump with legs apart and arms up, then back together',
      muscle_groups: ['full body', 'cardiovascular'],
      body_part: 'full body',
      equipment_required: [],
      exercise_type: 'cardio',
      difficulty_level: 'beginner',
      is_compound: true,
      tags: ['cardio', 'full body'],
      audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image_url:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    }),
    new Exercise({
      id: '5',
      name: 'Lunges',
      alternate_names: ['Forward Lunges', 'Static Lunges'],
      detailed_instructions:
        'Stand with feet hip-width apart. Step forward with one leg, lowering your hips until both knees are bent at about 90 degrees. Make sure your front knee is directly above your ankle, not pushed out past your toes. Your back knee should be hovering just above the floor. Push back to the starting position and repeat with the other leg.',
      simple_instructions: 'Step forward and lower down, then step back',
      muscle_groups: ['quadriceps', 'glutes', 'hamstrings'],
      body_part: 'lower body',
      equipment_required: [],
      exercise_type: 'strength',
      difficulty_level: 'intermediate',
      is_compound: true,
      tags: ['compound', 'legs'],
      audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image_url:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    }),
  ];

  async getExercisesByGeneratedWorkoutId(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _generatedWorkoutId: string
  ): Promise<Exercise[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.mockExercises.slice(0, 3);
  }

  async getExercisesByWorkoutId(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _workoutId: string
  ): Promise<Exercise[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.mockExercises.slice(1, 4);
  }

  async getExerciseById(exerciseId: string): Promise<Exercise | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // For mock purposes, still allow finding by ID
    return this.mockExercises.find((e) => e.id === exerciseId) || null;
  }
}
