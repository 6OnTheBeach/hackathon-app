import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { choisirScenario } from './ai.mock.ts';
import { parseAnalysis } from './ai.validate.ts';
import { MENTION_SIMULEE, SCENARIOS } from './mock-scenarios.ts';

// Lancer : npm test -w api

const FAMILLES = new Set([
  'Floral',
  'Fruity',
  'Citrus',
  'Herbal - Agrestic',
  'Woody',
  'Green',
  'Ambery',
  'Spicy',
  'Musky',
  'Leather - Moss',
  'Gourmand',
  'Aldehydic',
  'Marine',
]);

// Les seuls ingrédients autorisés : nom → référence du catalogue Givaudan
const CATALOGUE = new Map([
  ['Anther', '5846393'],
  ['Ultrazur™', '21218823'],
  ['Jasmone Cis', '6340001'],
  ['Isojasmone B 11', '6249003'],
  ['Javanol™', '8754013'],
  ['Ebanol™', '4697403'],
  ['Decatone', '4356101'],
  ['Adoxal', '1028001'],
  ['Ambermax™ 10%/TEC', '1472033'],
  ['Safranal', '8797001'],
  ['Methyl Diantilis™', '6906203'],
  ['Oranger Crystals', '7758003'],
  ['Isobutavan', '1465543'],
  ['Azarbre', '7043003'],
]);

describe('choisirScenario', () => {
  for (const scenario of SCENARIOS) {
    it(`l'exemple « ${scenario.id} » donne le scénario ${scenario.id}`, () => {
      assert.equal(choisirScenario(scenario.exemple).id, scenario.id);
    });
  }

  it('ignore les accents et les majuscules', () => {
    assert.equal(choisirScenario('UNE JUNGLE EN THAÏLANDE').id, 'tropical');
  });

  it('ne reconnaît un mot-clé court que comme mot entier', () => {
    // « mer » est dans « grand-mère », « sel » dans « selon »
    assert.equal(choisirScenario('Chez ma grand-mère, selon moi').id, 'vague');
    assert.equal(choisirScenario('Face à la mer').id, 'plage');
  });

  it('prend le scénario qui a le plus de mots-clés', () => {
    assert.equal(
      choisirScenario('Un gâteau sur la plage, au bord de la mer').id,
      'plage',
    );
  });

  it('renvoie « vague » sans mot-clé', () => {
    assert.equal(choisirScenario('').id, 'vague');
  });
});

describe('réponses simulées', () => {
  for (const scenario of SCENARIOS) {
    describe(scenario.id, () => {
      const result = parseAnalysis(structuredClone(scenario.answer));

      it('passe parseAnalysis', () => {
        assert.ok(result.ok, JSON.stringify(result));
      });
      if (!result.ok) return;
      const { analysis } = result;

      it('a une roue de 100 %, avec des familles valides', () => {
        const total = analysis.roue.reduce((s, f) => s + f.pourcentage, 0);
        assert.equal(total, 100);
        for (const { famille } of analysis.roue) {
          assert.ok(FAMILLES.has(famille), `famille inconnue : ${famille}`);
        }
      });

      it('ne cite que des ingrédients du catalogue, avec leur référence', () => {
        assert.ok(analysis.profil, 'profil absent');
        const { tete, coeur, fond } = analysis.profil;
        for (const n of [...tete, ...coeur, ...fond]) {
          assert.equal(
            CATALOGUE.get(n.ingredient),
            n.reference,
            `ingrédient ou référence hors catalogue : ${n.ingredient} (${n.reference})`,
          );
          assert.notEqual(n.raison, '');
        }
      });

      it('se déclare simulée', () => {
        assert.ok(analysis.limites_catalogue.includes(MENTION_SIMULEE));
      });
    });
  }
});
