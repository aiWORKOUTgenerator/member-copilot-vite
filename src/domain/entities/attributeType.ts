/**
 * AttributeType entity
 * Represents types that can be assigned to attributes
 */

import { BaseEntity } from "./baseEntity";

export interface AttributeTypeProps {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
}

export class AttributeType extends BaseEntity<string> {
  private readonly _name: string;
  private readonly _description: string | null;
  private readonly _display_order: number;

  constructor(props: AttributeTypeProps) {
    super(props.id);
    this._name = props.name;
    this._description = props.description;
    this._display_order = props.display_order;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get display_order(): number {
    return this._display_order;
  }
}
