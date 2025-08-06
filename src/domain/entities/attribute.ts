/**
 * Attribute entity
 * Represents various attributes that can be associated with contacts
 */

import { BaseEntity } from './baseEntity';

export type AttributeDataType =
  | 'float'
  | 'list_of_strings'
  | 'string'
  | 'integer'
  | 'boolean'
  | 'date'
  | 'list_of_integers';

export interface AttributeProps {
  id: string;
  name: string;
  entity_type: string;
  data_type: AttributeDataType;
  label: string;
  description: string | null;
  attribute_type_id: string | null;
}

export class Attribute extends BaseEntity<string> {
  private readonly _name: string;
  private readonly _entity_type: string;
  private readonly _data_type: AttributeDataType;
  private readonly _label: string;
  private readonly _description: string | null;
  private readonly _attribute_type_id: string | null;

  constructor(props: AttributeProps) {
    super(props.id);
    this._name = props.name;
    this._entity_type = props.entity_type;
    this._data_type = props.data_type;
    this._label = props.label;
    this._description = props.description;
    this._attribute_type_id = props.attribute_type_id;
  }

  get name(): string {
    return this._name;
  }

  get entity_type(): string {
    return this._entity_type;
  }

  get data_type(): AttributeDataType {
    return this._data_type;
  }

  get label(): string {
    return this._label;
  }

  get description(): string | null {
    return this._description;
  }

  get attribute_type_id(): string | null {
    return this._attribute_type_id;
  }
}
