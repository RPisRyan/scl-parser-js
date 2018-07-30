import { Concept, Relation, ContainsStatement, Resource, ResourceType } from "./models";

const ConceptPattern = /^([^\s].+)/;
const RelationPattern = /\s+<(.+)> (.+)/;
const ContainsPattern = /\s+is in (.+)/;
const ResourcePattern = /\s+has image at (.+)/

export function parseConcepts(document: string): Concept[] {
  const concepts = [];
  const lines = document.split('\n');
  let concept;
  while(concept = parseConcept(lines)){
    concepts.push(concept);
  }
  return concepts;
}

function parseConcept(lines: string[]): Concept | void {
  let concept: Concept | void  = null;
  while(lines.length > 0) {
    const line = lines.shift();
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
      concept.relations = [];
      concept.resources = [];
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
        concept.relations.push(relation);
        continue;
      }

      const resource = tryParseResource(line);
      if(resource){
        concept.resources.push(resource);
      }

      console.warn(`Ignoring line ${line}`);
    }

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

function tryParseConcept(line: string): Concept | void {
  const match = line.match(ConceptPattern);
  if (!match) {
    return;
  }

  return {
    name: match[1]
  };
}

function tryParseContains(line: string): ContainsStatement | void {
  const match = line.match(ContainsPattern);
  if (!match) {
    return;
  }

  return {
    parent: match[1]
  };
}

function tryParseResource(line: string): Resource {
  const match = line.match(ResourcePattern);
  if(!match){
    return;
  }

  return {
    type: ResourceType.Image,
    location: match[1]
  };
}
