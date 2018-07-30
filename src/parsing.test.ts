import { Concept, ResourceType } from './models';
import { parseConcepts } from './parsing';

describe('parseConcept', () => {

  function expectParsedConcept(text: string, expected: Concept){
    const concepts = parseConcepts(text);
    expect(concepts.length).toBe(1);
    const concept = concepts[0];
    if(concept.relations && !concept.relations.length){
      delete concept.relations;
    }
    if(concept.resources && !concept.resources.length) {
      delete concept.resources;
    }
    expect(concepts[0]).toEqual(expected);
  }

  test('parses concept', () => {
    expectParsedConcept('Brown Bear', {
      name: 'Brown Bear'
    });
  });

  test('Skips blank lines before concept', () => {
    expectParsedConcept('  \n\nBrown Bear', {
      name: 'Brown Bear'
    });
  });

  test('parses relation', () => {
    expectParsedConcept(`Brown Bear\n  <Will eat> Raw salmon`, {
      name: 'Brown Bear',
      relations: [
        { label: 'Will eat', target: 'Raw salmon'}
      ]
    });
  });

  test('parses contains', () => {
    expectParsedConcept(`Brown Bear\n  is in Family Ursidae`, {
      name: 'Brown Bear',
      parent: 'Family Ursidae'
    });
  });

  test('parses image resource', () => {
    expectParsedConcept(`Brown Bear\n  has image at https://i.imgur.com/XH8NDjz.jpg`, {
      name: 'Brown Bear',
      resources: [
        {
          type: ResourceType.Image,
          location: 'https://i.imgur.com/XH8NDjz.jpg'
        }
      ]
    });
  });

});

describe('parseConcepts', () => {

  test('parses multiple concepts', () => {
    const document = `
Flux Capacitor
  is in A DeLorean
  <Enables> Time Travel

Time Travel
  <Can Prevent> Terrorist Attacks

`;

    const concepts = parseConcepts(document);
    expect(concepts.length).toBe(2);
    expect(concepts[0].name).toBe('Flux Capacitor');
    expect(concepts[0].parent).toBe('A DeLorean');

    expect(concepts[1].name).toBe('Time Travel');
  });

});
