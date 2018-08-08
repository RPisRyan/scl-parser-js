import { Concept, ResourceType } from './models';
import { parseDocument } from './parsing';

describe('parseConcept', () => {

  function expectParsedConcept(text: string, expected: Concept){
    const concepts = parseDocument(text).concepts;
    expect(concepts.length).toBe(1);
    const concept = concepts[0];
    if(concept.relations && !concept.relations.length){
      delete concept.relations;
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

  test('parses image concept', () => {
    expectParsedConcept(`Brown Bear\n  image: https://i.imgur.com/XH8NDjz.jpg \n  width: 400\n  height: 300`, {
      name: 'Brown Bear',
      image: 'https://i.imgur.com/XH8NDjz.jpg',
      width: '400',
      height: '300'
    });
  });

  test('parse image concept 2', () => {

    const scl = `Lead Time view
  image: https://confluence.nike.com/download/attachments/238410415/Lead_time_msg__As-is_PDP.jpg
  <Get message> Lead Time Legacy`;
    expectParsedConcept(scl, {
      name: 'Lead Time view',
      image: 'https://confluence.nike.com/download/attachments/238410415/Lead_time_msg__As-is_PDP.jpg',
      relations: [
        { label: 'Get message', target: 'Lead Time Legacy'}
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

    const concepts = parseDocument(document).concepts;
    expect(concepts.length).toBe(2);
    expect(concepts[0].name).toBe('Flux Capacitor');
    expect(concepts[0].parent).toBe('A DeLorean');
    expect(concepts[1].name).toBe('Time Travel');
  });

});
