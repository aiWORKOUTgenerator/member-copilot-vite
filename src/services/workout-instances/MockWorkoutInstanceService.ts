import {
  WorkoutInstance,
  WorkoutInstanceStructure,
} from '@/domain/entities/workoutInstance';
import {
  CreateWorkoutInstanceRequest,
  UpdateWorkoutInstanceRequest,
  WorkoutInstanceService,
  RecommendedExercise,
} from '@/domain/interfaces/services/WorkoutInstanceService';

/**
 * Mock implementation of the WorkoutInstanceService interface for testing and development.
 * This implementation uses localStorage for persistent storage without any mock data.
 *
 * To enable this mock service, set the environment variable:
 * VITE_USE_MOCK_WORKOUT_INSTANCE_SERVICE=true
 *
 * Features:
 * - localStorage-based persistent storage
 * - No pre-populated mock data - starts with empty storage
 * - Simulates network delays for realistic testing
 * - Supports all CRUD operations (Create, Read, Update, Delete)
 * - Auto-generates IDs for new instances
 * - Includes helper methods for development/testing
 *
 * Note: Workout instances only store execution data (performance, notes, timing).
 * Workout content (text, simple formats) comes from the original GeneratedWorkout.
 *
 * Usage in tests:
 * ```typescript
 * const mockService = new MockWorkoutInstanceService();
 * const instances = await mockService.getWorkoutInstances();
 * ```
 */

interface MockWorkoutInstanceData {
  id: string;
  generated_workout_id: string;
  json_format?: WorkoutInstanceStructure | null;
  performed_at: string;
  duration?: number;
  notes?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export class MockWorkoutInstanceService implements WorkoutInstanceService {
  readonly serviceName = 'MockWorkoutInstanceService';
  private instanceStore: Map<string, MockWorkoutInstanceData> = new Map();
  private nextId = 1;
  private readonly STORAGE_KEY = 'mock_workout_instances';
  private readonly NEXT_ID_KEY = 'mock_workout_instances_next_id';

  constructor() {
    // Load data from localStorage
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      // Load existing data from localStorage
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      const storedNextId = localStorage.getItem(this.NEXT_ID_KEY);

      if (storedData && storedNextId) {
        const instances: MockWorkoutInstanceData[] = JSON.parse(storedData);
        this.nextId = parseInt(storedNextId, 10);

        instances.forEach((instance) => {
          this.instanceStore.set(instance.id, instance);
        });

        console.log(
          `MockWorkoutInstanceService: Loaded ${instances.length} instances from localStorage`
        );
      } else {
        // No stored data, start with empty storage
        console.log(
          'MockWorkoutInstanceService: No existing data found, starting with empty storage'
        );
      }
    } catch (error) {
      console.warn(
        'MockWorkoutInstanceService: Error loading from localStorage, starting with empty storage',
        error
      );
    }
  }

  private saveToStorage() {
    try {
      const instances = Array.from(this.instanceStore.values());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(instances));
      localStorage.setItem(this.NEXT_ID_KEY, this.nextId.toString());
    } catch (error) {
      console.warn(
        'MockWorkoutInstanceService: Error saving to localStorage',
        error
      );
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return `instance-${this.nextId++}`;
  }

  async getWorkoutInstances(): Promise<WorkoutInstance[]> {
    await this.delay(300); // Simulate network delay

    const instances = Array.from(this.instanceStore.values()).map(
      (data) => new WorkoutInstance(data)
    );

    // Sort by performed_at date (most recent first)
    return instances.sort(
      (a, b) =>
        new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
    );
  }

  async getWorkoutInstancesByGeneratedWorkoutId(
    generatedWorkoutId: string
  ): Promise<WorkoutInstance[]> {
    await this.delay(200);

    const instances = Array.from(this.instanceStore.values())
      .filter((data) => data.generated_workout_id === generatedWorkoutId)
      .map((data) => new WorkoutInstance(data));

    // Sort by performed_at date (most recent first)
    return instances.sort(
      (a, b) =>
        new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
    );
  }

  async getWorkoutInstance(
    instanceId: string
  ): Promise<WorkoutInstance | null> {
    await this.delay(150);

    const data = this.instanceStore.get(instanceId);
    return data ? new WorkoutInstance(data) : null;
  }

  async createWorkoutInstance(
    request: CreateWorkoutInstanceRequest
  ): Promise<WorkoutInstance> {
    await this.delay(400); // Simulate longer creation time

    const now = new Date().toISOString();
    const newId = this.generateId();

    // Note: The flattening should already be done on the client side
    // before calling this service, so we just store the flattened workout structure
    const newInstanceData: MockWorkoutInstanceData = {
      id: newId,
      generated_workout_id: request.generatedWorkoutId,
      json_format: request.jsonFormat || null,
      performed_at: request.performedAt,
      duration: request.duration,
      notes: request.notes,
      completed: request.completed,
      created_at: now,
      updated_at: now,
    };

    this.instanceStore.set(newId, newInstanceData);
    this.saveToStorage();

    return new WorkoutInstance(newInstanceData);
  }

  async updateWorkoutInstance(
    instanceId: string,
    request: UpdateWorkoutInstanceRequest
  ): Promise<WorkoutInstance> {
    await this.delay(250);

    const existingData = this.instanceStore.get(instanceId);
    if (!existingData) {
      throw new Error(`Workout instance with ID ${instanceId} not found`);
    }

    const updatedData: MockWorkoutInstanceData = {
      ...existingData,
      performed_at: request.performedAt ?? existingData.performed_at,
      duration: request.duration ?? existingData.duration,
      notes: request.notes ?? existingData.notes,
      completed: request.completed ?? existingData.completed,
      json_format: request.jsonFormat ?? existingData.json_format,
      updated_at: new Date().toISOString(),
    };

    this.instanceStore.set(instanceId, updatedData);
    this.saveToStorage();

    return new WorkoutInstance(updatedData);
  }

  async deleteWorkoutInstance(instanceId: string): Promise<void> {
    await this.delay(200);

    const exists = this.instanceStore.has(instanceId);
    if (!exists) {
      throw new Error(`Workout instance with ID ${instanceId} not found`);
    }

    this.instanceStore.delete(instanceId);
    this.saveToStorage();
  }

  async getExerciseRecommendations(
    instanceId: string,
    exerciseName: string
  ): Promise<RecommendedExercise[]> {
    await this.delay(300); // Simulate network delay

    // Return mock recommendations
    return [
      {
        id: `mock-alt-1-${instanceId}`,
        name: 'Push-ups',
        description:
          'Classic bodyweight chest exercise that targets the same muscles as ' +
          exerciseName,
        sets: 3,
        reps: 15,
        targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
        difficulty: 'Beginner',
        rest: 60,
      },
      {
        id: `mock-alt-2-${instanceId}`,
        name: 'Modified Version',
        description: `A modified version of ${exerciseName} with adjusted parameters`,
        sets: 2,
        reps: 8,
        weight: 5,
        targetMuscles: ['Full Body'],
        difficulty: 'Beginner',
        rest: 60,
      },
      {
        id: `mock-alt-3-${instanceId}`,
        name: 'Bodyweight Alternative',
        description: `A bodyweight alternative to ${exerciseName}`,
        sets: 3,
        reps: 12,
        targetMuscles: ['Core', 'Upper Body'],
        difficulty: 'Intermediate',
        rest: 45,
      },
    ];
  }

  // Helper method for development/testing
  getAllMockData(): MockWorkoutInstanceData[] {
    return Array.from(this.instanceStore.values());
  }

  // Helper method to reset storage
  resetStorage(): void {
    this.instanceStore.clear();
    this.nextId = 1;
    this.saveToStorage();
  }

  // Helper method to clear localStorage
  clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.NEXT_ID_KEY);
    this.instanceStore.clear();
    this.nextId = 1;
  }
}
