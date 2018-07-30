
export interface Concept {
  name: string;
  parent?: string;
  relations?: Relation[];
  resources?: Resource[];
}

export interface Resource {
  type: ResourceType;
  location: string;
}

export type ResourceType = "image";

export interface Relation {
  target: string;
  label: string;
}

export interface ContainsStatement {
  parent: string;
}
