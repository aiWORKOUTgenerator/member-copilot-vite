import { BaseEntity } from './baseEntity';

export interface ExerciseProps {
  id: string;
  name: string;
  alternate_names: string[];
  detailed_instructions: string;
  simple_instructions: string;
  muscle_groups: string[];
  body_part: string;
  equipment_required: string[];
  exercise_type: string;
  difficulty_level?: string;
  is_compound?: boolean;
  tags?: string[];
  audio_url?: string | null;
  image_url?: string | null;
}

export class Exercise extends BaseEntity<string> {
  private readonly _name: string;
  private readonly _alternateNames: string[];
  private readonly _detailedInstructions: string;
  private readonly _simpleInstructions: string;
  private readonly _muscleGroups: string[];
  private readonly _bodyPart: string;
  private readonly _equipmentRequired: string[];
  private readonly _exerciseType: string;
  private readonly _difficultyLevel?: string;
  private readonly _isCompound?: boolean;
  private readonly _tags?: string[];
  private readonly _audioUrl?: string | null;
  private readonly _imageUrl?: string | null;

  constructor(props: ExerciseProps) {
    super(props.id);
    this._name = props.name;
    this._alternateNames = props.alternate_names;
    this._detailedInstructions = props.detailed_instructions;
    this._simpleInstructions = props.simple_instructions;
    this._muscleGroups = props.muscle_groups;
    this._bodyPart = props.body_part;
    this._equipmentRequired = props.equipment_required;
    this._exerciseType = props.exercise_type;
    this._difficultyLevel = props.difficulty_level;
    this._isCompound = props.is_compound;
    this._tags = props.tags;
    this._audioUrl = props.audio_url;
    this._imageUrl = props.image_url;
  }

  get name(): string {
    return this._name;
  }

  get alternateNames(): string[] {
    return this._alternateNames;
  }

  get detailedInstructions(): string {
    return this._detailedInstructions;
  }

  get simpleInstructions(): string {
    return this._simpleInstructions;
  }

  get muscleGroups(): string[] {
    return this._muscleGroups;
  }

  get bodyPart(): string {
    return this._bodyPart;
  }

  get equipmentRequired(): string[] {
    return this._equipmentRequired;
  }

  get exerciseType(): string {
    return this._exerciseType;
  }

  get audioUrl(): string | null | undefined {
    return this._audioUrl;
  }

  get imageUrl(): string | null | undefined {
    return this._imageUrl;
  }

  get difficultyLevel(): string | undefined {
    return this._difficultyLevel;
  }

  get isCompound(): boolean | undefined {
    return this._isCompound;
  }

  get tags(): string[] | undefined {
    return this._tags;
  }

  static fromApiResponse(data: ExerciseProps): Exercise {
    return new Exercise(data);
  }
}
