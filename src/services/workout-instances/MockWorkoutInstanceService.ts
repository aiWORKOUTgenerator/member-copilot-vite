import { WorkoutInstance } from "@/domain/entities/workoutInstance";
import {
  WorkoutInstanceService,
  CreateWorkoutInstanceRequest,
  UpdateWorkoutInstanceRequest,
} from "@/domain/interfaces/services/WorkoutInstanceService";

/**
 * Mock implementation of the WorkoutInstanceService interface for testing and development.
 * This implementation uses in-memory storage and returns mock data instead of making API requests.
 *
 * To enable this mock service, set the environment variable:
 * VITE_USE_MOCK_WORKOUT_INSTANCE_SERVICE=true
 *
 * Features:
 * - In-memory storage with Map-based data store
 * - Pre-populated with realistic workout instance data
 * - Simulates network delays for realistic testing
 * - Supports all CRUD operations (Create, Read, Update, Delete)
 * - Auto-generates IDs for new instances
 * - Includes helper methods for development/testing
 *
 * Mock Data Includes:
 * - Completed upper body strength workout with performance notes and JSON structure
 * - Completed HIIT cardio workout with timing details and interval structure
 * - In-progress full body workout for testing different states
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
  json_format?: string | null;
  performed_at: string;
  duration?: number;
  notes?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export class MockWorkoutInstanceService implements WorkoutInstanceService {
  readonly serviceName = "MockWorkoutInstanceService";
  private instanceStore: Map<string, MockWorkoutInstanceData> = new Map();
  private nextId = 1;

  constructor() {
    // Initialize with some mock data for development
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockInstances: MockWorkoutInstanceData[] = [
      {
        id: "instance-1",
        generated_workout_id: "workout-123",
        json_format: JSON.stringify({
          title: "Upper Body Strength Training",
          description:
            "A focused upper body workout targeting chest, back, and shoulders",
          sections: [
            {
              name: "Warm-up",
              type: "Standard",
              exercises: [
                {
                  name: "Arm circles",
                  reps: 10,
                  description: "10 forward, 10 backward",
                },
                { name: "Shoulder shrugs", reps: 15 },
              ],
            },
            {
              name: "Main Workout",
              type: "Standard",
              exercises: [
                { name: "Push-ups", sets: 3, reps: 12 },
                { name: "Dumbbell rows", sets: 3, reps: 10 },
                { name: "Overhead press", sets: 3, reps: 8 },
              ],
            },
          ],
        }),
        performed_at: "2024-01-15T09:00:00Z",
        duration: 35,
        notes: "Felt strong today! Increased weight on overhead press.",
        completed: true,
        created_at: "2024-01-15T09:00:00Z",
        updated_at: "2024-01-15T09:35:00Z",
      },
      {
        id: "instance-2",
        generated_workout_id: "workout-456",
        json_format: JSON.stringify({
          title: "HIIT Cardio Blast",
          description:
            "High-intensity interval training for maximum calorie burn - Flattened into linear rounds",
          sections: [
            {
              name: "HIIT Circuit - Round 1",
              type: "Interval",
              rounds: 1,
              exercises: [
                { name: "Burpees", duration: 45 },
                { name: "Mountain climbers", duration: 45 },
                { name: "Jump squats", duration: 45 },
                { name: "High knees", duration: 45 },
              ],
              rest_between_exercises: 15,
            },
            {
              name: "HIIT Circuit - Round 2",
              type: "Interval",
              rounds: 1,
              exercises: [
                { name: "Burpees", duration: 45 },
                { name: "Mountain climbers", duration: 45 },
                { name: "Jump squats", duration: 45 },
                { name: "High knees", duration: 45 },
              ],
              rest_between_exercises: 15,
            },
            {
              name: "HIIT Circuit - Round 3",
              type: "Interval",
              rounds: 1,
              exercises: [
                { name: "Burpees", duration: 45 },
                { name: "Mountain climbers", duration: 45 },
                { name: "Jump squats", duration: 45 },
                { name: "High knees", duration: 45 },
              ],
              rest_between_exercises: 15,
            },
            {
              name: "HIIT Circuit - Round 4",
              type: "Interval",
              rounds: 1,
              exercises: [
                { name: "Burpees", duration: 45 },
                { name: "Mountain climbers", duration: 45 },
                { name: "Jump squats", duration: 45 },
                { name: "High knees", duration: 45 },
              ],
              rest_between_exercises: 15,
            },
          ],
        }),
        performed_at: "2024-01-14T18:30:00Z",
        duration: 25,
        notes: "Tough workout! Had to take extra rest during round 3.",
        completed: true,
        created_at: "2024-01-14T18:30:00Z",
        updated_at: "2024-01-14T18:55:00Z",
      },
      {
        id: "instance-3",
        generated_workout_id: "workout-789",
        json_format: JSON.stringify({
          title: "Full Body Strength Circuit",
          description:
            "Complete full body strength training workout - Linear format for tracking",
          sections: [
            {
              name: "Full Body Circuit - Round 1",
              type: "Circuit",
              rounds: 1,
              exercises: [
                { name: "Squats", sets: 1, reps: 15 },
                { name: "Deadlifts", sets: 1, reps: 12 },
                { name: "Bench press", sets: 1, reps: 10 },
                { name: "Pull-ups", sets: 1, reps: 8 },
              ],
            },
            {
              name: "Full Body Circuit - Round 2",
              type: "Circuit",
              rounds: 1,
              exercises: [
                { name: "Squats", sets: 1, reps: 15 },
                { name: "Deadlifts", sets: 1, reps: 12 },
                { name: "Bench press", sets: 1, reps: 10 },
                { name: "Pull-ups", sets: 1, reps: 8 },
              ],
            },
            {
              name: "Full Body Circuit - Round 3",
              type: "Circuit",
              rounds: 1,
              exercises: [
                { name: "Squats", sets: 1, reps: 15 },
                { name: "Deadlifts", sets: 1, reps: 12 },
                { name: "Bench press", sets: 1, reps: 10 },
                { name: "Pull-ups", sets: 1, reps: 8 },
              ],
            },
          ],
        }),
        performed_at: "2024-01-16T07:00:00Z",
        duration: 40,
        notes: "Morning workout - felt energized!",
        completed: false, // This one is in progress
        created_at: "2024-01-16T07:00:00Z",
        updated_at: "2024-01-16T07:00:00Z",
      },
    ];

    mockInstances.forEach((instance) => {
      this.instanceStore.set(instance.id, instance);
    });

    this.nextId = mockInstances.length + 1;
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
    // before calling this service, so we just store the flattened JSON format
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

    return new WorkoutInstance(updatedData);
  }

  async deleteWorkoutInstance(instanceId: string): Promise<void> {
    await this.delay(200);

    const exists = this.instanceStore.has(instanceId);
    if (!exists) {
      throw new Error(`Workout instance with ID ${instanceId} not found`);
    }

    this.instanceStore.delete(instanceId);
  }

  // Helper method for development/testing
  getAllMockData(): MockWorkoutInstanceData[] {
    return Array.from(this.instanceStore.values());
  }

  // Helper method to reset mock data
  resetMockData(): void {
    this.instanceStore.clear();
    this.nextId = 1;
    this.initializeMockData();
  }
}
