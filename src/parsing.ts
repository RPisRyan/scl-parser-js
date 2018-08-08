import { Concept, Relation, ContainsStatement, Resource, SCLDocument } from "./models";

const ConceptPattern = /^([^\s].+)/;
const RelationPattern = /\s+<(.+)> (.+)/;
const ContainsPattern = /\s+is in (.+)/;
const ImagePattern = /\s+has image at (.+)/;
const AttributePattern = /\s+(\w+)\: ?(.+)/;

export function parseDocument(document: string): SCLDocument {
  const concepts = [];
  const lines = document.split('\n');
  let concept;
  while(concept = parseConcept(lines)){
    concepts.push(concept);
  }
  return {
    concepts
  };
}

function parseConcept(lines: string[]): Concept | null {
  let concept: Concept | null = null;
  const relations = [];

  while(lines.length > 0) {
    const line: string = lines.shift() || '';
    if(!concept){

      // scan
      if(line.trim() === ''){
        continue;
      }

      // first line should be concept
      concept = tryParseConcept(line);
      if(!concept){
        throw new Error(`Could not parse concept from ${line}`);
      }
      continue;

    } else {

      if(line.trim() === ''){
        break;
      }

      const containsStatement = tryParseContains(line);
      if(containsStatement){
        concept.parent = containsStatement.parent;
        continue;
      }

      const relation = tryParseRelation(line);
      if(relation){
        relations.push(relation);
        continue;
      }

      const attribute = tryParseAttribute(line);
      if(attribute){
        concept[attribute[0]] = attribute[1];
        continue;
      }

      console.warn(`Ignoring line ${line}`);
    }

  }

  if(!concept){
    return null;
  }

  if(relations.length > 0){
    concept.relations = relations;
  }

  return concept;
}

function tryParseRelation(line: string): Relation | void {
  const match = line.match(RelationPattern);
  if (!match) {
    return;
  }

  return {
    label: match[1],
    target: match[2]
  };
}

function tryParseConcept(line: string): Concept | null {
  const match = line.match(ConceptPattern);
  if (!match) {
    return null;
  }

  return {
    name: match[1]
  };
}

function tryParseContains(line: string): ContainsStatement | null {
  const match = line.match(ContainsPattern);
  if (!match) {
    return null;
  }

  return {
    parent: match[1]
  };
}

function tryParseImage(line: string): string | null {
  const match = line.match(ImagePattern);
  if(!match){
    return null;
  }

  return match[1];
}

function tryParseAttribute(line: string): [string, string] | null {
  const match = line.match(AttributePattern);
  if(!match){
    return null;
  }

  return [match[1].trim(), match[2].trim()];
}
