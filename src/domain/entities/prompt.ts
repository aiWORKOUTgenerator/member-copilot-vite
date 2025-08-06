import { AttributeType } from './attributeType';

/**
 * Represents a choice option for a prompt
 */
export class Choice {
  readonly id: string;
  readonly text: string;

  constructor(props: { id: string; text: string }) {
    this.id = props.id;
    this.text = props.text;
  }
}

/**
 * Enum for different prompt types
 */
export enum PromptType {
  LIST = 'list',
  NUMBER = 'number',
  TEXT = 'text',
}

/**
 * Type for validation rules
 */
export type ValidationRule = string | number | boolean | RegExp;

export interface PromptProps {
  id: string;
  text: string;
  hint_text: string;
  prompt_type: PromptType;
  is_identifier: boolean;
  allow_multiple: boolean;
  choices: Choice[];
  validation_rules: Record<string, ValidationRule>;
  variable_name: string;
  popup_text: string;
  popup_link_text: string;
  other_choice_enabled: boolean;
  other_choice_text: string;
  other_choice_validation: Record<string, ValidationRule>;
  attribute_type: AttributeType | null;
}

/**
 * Represents a prompt entity in the domain
 */
export class Prompt {
  readonly id: string;
  readonly text: string;
  readonly hintText: string;
  readonly type: PromptType;
  readonly isIdentifier: boolean;
  readonly allowMultiple: boolean;
  readonly choices: Choice[];
  readonly validationRules: Record<string, ValidationRule>;
  readonly variableName: string;
  readonly popupText: string;
  readonly popupLinkText: string;
  readonly otherChoiceEnabled: boolean;
  readonly otherChoiceText: string;
  readonly otherChoiceValidation: Record<string, ValidationRule>;
  readonly attributeType: AttributeType | null;

  constructor(props: PromptProps) {
    this.id = props.id;
    this.text = props.text;
    this.hintText = props.hint_text;
    this.type = props.prompt_type;
    this.isIdentifier = props.is_identifier;
    this.allowMultiple = props.allow_multiple;
    this.choices = props.choices;
    this.validationRules = props.validation_rules;
    this.variableName = props.variable_name;
    this.popupText = props.popup_text;
    this.popupLinkText = props.popup_link_text;
    this.otherChoiceEnabled = props.other_choice_enabled;
    this.otherChoiceText = props.other_choice_text;
    this.otherChoiceValidation = props.other_choice_validation;
    this.attributeType = props.attribute_type;
  }
}
