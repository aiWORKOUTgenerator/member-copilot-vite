import { Choice, Prompt, PromptType } from '@/domain/entities';
import { PromptService } from '@/domain/interfaces/services/PromptService';

/**
 * Fake implementation of PromptService for development and testing
 */
export class FakePromptService implements PromptService {
  private prompts: Prompt[] = [
    new Prompt({
      id: '1',
      text: 'What is your name?',
      hint_text: 'Please enter your full name',
      prompt_type: PromptType.TEXT,
      is_identifier: true,
      allow_multiple: false,
      choices: [],
      validation_rules: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      variable_name: 'name',
      popup_text: 'Your name will be used to personalize your experience',
      popup_link_text: 'Why do we need this?',
      other_choice_enabled: false,
      other_choice_text: '',
      other_choice_validation: {},
      attribute_type: null,
    }),
    new Prompt({
      id: '2',
      text: 'How old are you?',
      hint_text: 'Please enter your age in years',
      prompt_type: PromptType.NUMBER,
      is_identifier: false,
      allow_multiple: false,
      choices: [],
      validation_rules: {
        required: true,
        min: 18,
        max: 120,
      },
      variable_name: 'age',
      popup_text: 'Your age helps us recommend appropriate content',
      popup_link_text: 'More info',
      other_choice_enabled: false,
      other_choice_text: '',
      other_choice_validation: {},
      attribute_type: null,
    }),
    new Prompt({
      id: '3',
      text: 'What interests you?',
      hint_text: 'Select all that apply',
      prompt_type: PromptType.LIST,
      is_identifier: false,
      allow_multiple: true,
      choices: [
        new Choice({ id: 'tech', text: 'Technology' }),
        new Choice({ id: 'art', text: 'Art & Design' }),
        new Choice({ id: 'sports', text: 'Sports & Fitness' }),
        new Choice({ id: 'music', text: 'Music' }),
        new Choice({ id: 'travel', text: 'Travel' }),
      ],
      validation_rules: {
        required: true,
        minSelections: 1,
      },
      variable_name: 'interests',
      popup_text: 'This helps us personalize your content feed',
      popup_link_text: 'Learn more',
      other_choice_enabled: true,
      other_choice_text: 'Other (please specify)',
      other_choice_validation: {
        required: true,
        minLength: 2,
      },
      attribute_type: null,
    }),
    new Prompt({
      id: '4',
      text: 'When were you born?',
      hint_text: 'Please select your date of birth',
      prompt_type: PromptType.TEXT,
      is_identifier: false,
      allow_multiple: false,
      choices: [],
      validation_rules: {
        required: true,
        pastDateOnly: true,
      },
      variable_name: 'birthdate',
      popup_text: 'Your birth date helps us verify your age',
      popup_link_text: 'Privacy info',
      other_choice_enabled: false,
      other_choice_text: '',
      other_choice_validation: {},
      attribute_type: null,
    }),
    new Prompt({
      id: '5',
      text: 'What is your preferred contact method?',
      hint_text: 'Select one option',
      prompt_type: PromptType.LIST,
      is_identifier: false,
      allow_multiple: false,
      choices: [
        new Choice({ id: 'email', text: 'Email' }),
        new Choice({ id: 'phone', text: 'Phone' }),
        new Choice({ id: 'mail', text: 'Physical Mail' }),
      ],
      validation_rules: {
        required: true,
      },
      variable_name: 'contact_preference',
      popup_text: "We'll use this method to send you important updates",
      popup_link_text: 'Communication policy',
      other_choice_enabled: false,
      other_choice_text: '',
      other_choice_validation: {},
      attribute_type: null,
    }),
    new Prompt({
      id: '6',
      text: "What's your email address?",
      hint_text: 'Enter a valid email address',
      prompt_type: PromptType.TEXT,
      is_identifier: true,
      allow_multiple: false,
      choices: [],
      validation_rules: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      variable_name: 'email',
      popup_text: "We'll send confirmation to this address",
      popup_link_text: 'Privacy details',
      other_choice_enabled: false,
      other_choice_text: '',
      other_choice_validation: {},
      attribute_type: null,
    }),
    new Prompt({
      id: '7',
      text: "What's your phone number?",
      hint_text: 'Enter your phone number with country code',
      prompt_type: PromptType.TEXT,
      is_identifier: true,
      allow_multiple: false,
      choices: [],
      validation_rules: {
        required: true,
      },
      variable_name: 'phone',
      popup_text: 'For verification purposes only',
      popup_link_text: 'Why we ask',
      other_choice_enabled: false,
      other_choice_text: '',
      other_choice_validation: {},
      attribute_type: null,
    }),
  ];

  async getAllPrompts(): Promise<Prompt[]> {
    return Promise.resolve(this.prompts);
  }

  async getPromptById(id: string): Promise<Prompt | null> {
    const prompt = this.prompts.find((p) => p.id === id);
    return Promise.resolve(prompt || null);
  }

  async submitPromptValues(
    promptValues: Array<{
      prompt_id: string;
      value: string | number;
    }>
  ): Promise<void> {
    console.log(`Submitting prompt values:`, promptValues);
    return Promise.resolve();
  }
}
