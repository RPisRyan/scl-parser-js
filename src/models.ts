
export interface SCLDocument {
  title?: string,
  // description?: string, // todo
  concepts: Concept[];
}

export interface Concept {
  name: string;
  parent?: string;
  relations?: Relation[];
  image?: string;
  width?: string;
  height?: string;
}

export interface Image {
  path: string;
  width?: string,
  height?: string 
}

export interface Resource {
  type: ResourceType;
  location: string;
}

export type ResourceType = "image";

export interface Relation {
  target: string;
  label?: string;
}

export interface ContainsStatement {
  parent: string;
}
