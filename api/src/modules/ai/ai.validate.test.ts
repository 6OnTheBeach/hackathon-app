import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { parseAnalysis } from './ai.validate.ts';

// Lancer : npm test -w api

function answerWith(elements: unknown): Record<string, unknown> {
  return {
    comprehension: {
      lieu: 'plage',
      moment: 'été',
      meteo: 'soleil',
      emotion: 'joie',
      ...(elements === undefined ? {} : { elements }),
    },
    signature: { nom: 'Été salé', description: 'Une plage en août' },
    roue: [{ famille: 'Aquatique', pourcentage: 100 }],
  };
}

function elementsOf(answer: unknown): string[] {
  const result = parseAnalysis(answer);
  assert.ok(result.ok, JSON.stringify(result));
  return result.analysis.comprehension.elements;
}

describe('comprehension.elements', () => {
  let warn: ReturnType<typeof mock.method>;
  beforeEach(() => {
    warn = mock.method(console, 'warn', () => {});
  });
  afterEach(() => {
    warn.mock.restore();
  });

  it('garde une liste de textes telle quelle', () => {
    assert.deepEqual(elementsOf(answerWith(['sable', 'sel'])), [
      'sable',
      'sel',
    ]);
    assert.equal(warn.mock.callCount(), 0);
  });

  it('découpe un texte sur les virgules', () => {
    assert.deepEqual(elementsOf(answerWith('sable chaud, sel ,, crème')), [
      'sable chaud',
      'sel',
      'crème',
    ]);
    assert.equal(warn.mock.callCount(), 0);
  });

  it("convertit une liste d'objets en textes", () => {
    const elements = [
      { nom: 'sable', detail: 'chaud' },
      { element: 'sel' },
      { vide: null },
    ];
    assert.deepEqual(elementsOf(answerWith(elements)), ['sable chaud', 'sel']);
    assert.equal(warn.mock.callCount(), 0);
  });

  it('convertit une liste de valeurs en textes', () => {
    assert.deepEqual(elementsOf(answerWith([42, true, ' pin ', null])), [
      '42',
      'true',
      'pin',
    ]);
    assert.equal(warn.mock.callCount(), 0);
  });

  it('donne une liste vide, avec un avertissement, si le champ est absent', () => {
    assert.deepEqual(elementsOf(answerWith(undefined)), []);
    assert.equal(warn.mock.callCount(), 1);
  });

  it('donne une liste vide, avec un avertissement, pour une autre forme', () => {
    assert.deepEqual(elementsOf(answerWith({ a: 'sable' })), []);
    assert.deepEqual(elementsOf(answerWith(12)), []);
    assert.equal(warn.mock.callCount(), 2);
  });
});

describe('signature et roue restent strictes', () => {
  it('rejette une signature sans nom', () => {
    const answer = {
      ...answerWith(['sable']),
      signature: { description: 'x' },
    };
    const result = parseAnalysis(answer);
    assert.equal(result.ok, false);
    assert.ok(
      !result.ok && result.problems.includes('signature.nom : texte attendu'),
    );
  });

  it('rejette une roue vide', () => {
    const answer = { ...answerWith(['sable']), roue: [] };
    const result = parseAnalysis(answer);
    assert.equal(result.ok, false);
    assert.ok(
      !result.ok && result.problems.includes('roue : liste non vide attendue'),
    );
  });

  it('rejette un pourcentage qui n’est pas un nombre', () => {
    const answer = {
      ...answerWith(['sable']),
      roue: [{ famille: 'Boisé', pourcentage: '40' }],
    };
    const result = parseAnalysis(answer);
    assert.equal(result.ok, false);
  });
});
