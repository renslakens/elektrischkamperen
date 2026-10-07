import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bepaalIntentie, bevatZoekwoord, herkenLand, isVraag, kernwoorden, stam } from '../tekst'
import { voegMetingToe, type KeywordsBestand } from '../model'

test('intentieregels', () => {
    const gevallen: [string, string][] = [
        ['laadpas kopen', 'transactioneel'],
        ['camping boeken frankrijk', 'transactioneel'],
        ['type 2 naar cee adapter bestellen', 'transactioneel'],
        ['ionity', 'navigatie'],
        ['anwb laadpas inloggen', 'navigatie'],
        ['beste laadpas buitenland', 'commercieel'],
        ['cee adapter elektrische auto', 'commercieel'],
        ['welke laadpas voor frankrijk', 'commercieel'],
        ['laden op de camping kosten', 'commercieel'],
        ['hoe laad ik mijn auto op de camping', 'informatief'],
        ['mag je je elektrische auto laden op de camping', 'informatief'],
        ['laden op de camping', 'informatief'],
    ]
    for (const [term, verwacht] of gevallen) assert.equal(bepaalIntentie(term), verwacht, term)
})

test('land uit de landenlijst van het camping-schema', () => {
    assert.equal(herkenLand('laden elektrische auto Frankrijk'), 'Frankrijk')
    assert.equal(herkenLand('franse snelweg laden'), 'Frankrijk')
    assert.equal(herkenLand('camping laadpaal belgië'), 'België')
    assert.equal(herkenLand('laden op de camping'), null)
    assert.equal(herkenLand('laden in noorwegen'), null) // niet in de lijst
})

test('vragen herkennen', () => {
    assert.ok(isVraag('hoe snel laad je op een cee aansluiting'))
    assert.ok(isVraag('Kan ik mijn caravan laden?'))
    assert.ok(!isVraag('laden op de camping'))
})

test('stammen en kernwoorden', () => {
    assert.equal(stam('campings'), stam('camping'))
    assert.equal(stam('laden'), stam('laad'))
    assert.equal(stam('laadpalen'), stam('laadpaal'))
    assert.equal(stam('adapters'), stam('adapter'))
    assert.deepEqual(kernwoorden('Laden op de camping'), kernwoorden('campings laden'))
    assert.deepEqual(kernwoorden('beste laadpas 2026'), [stam('laadpas')])
    assert.deepEqual(kernwoorden('laden elektrische auto frankrijk'), kernwoorden('laden in frankrijk'))
})

test('zoekwoord in tekst, ook in andere volgorde', () => {
    assert.ok(bevatZoekwoord('Laden met de elektrische auto in Frankrijk: netwerken', 'laden elektrische auto Frankrijk'))
    assert.ok(bevatZoekwoord('Laden op de camping: zo werkt het', 'laden op de camping'))
    assert.ok(!bevatZoekwoord('Laden in Duitsland', 'laden elektrische auto Frankrijk'))
})

test('samenvoegen: nieuwste meting met metric wint, bronnen blijven bewaard', () => {
    const b: KeywordsBestand = { bijgewerkt_op: null, zoekwoorden: [], clusters: [] }
    voegMetingToe(b, 'laadpas frankrijk', { bron: 'keyword-planner', datum: '2026-08-01', volume: 320, moeilijkheid: null, cpc: 0.4 })
    voegMetingToe(b, 'Laadpas Frankrijk', { bron: 'harborrank', datum: '2026-09-01', volume: 390, moeilijkheid: 22, cpc: null })
    voegMetingToe(b, 'laadpas frankrijk', { bron: 'autocomplete', datum: '2026-10-01', volume: null, moeilijkheid: null, cpc: null })
    assert.equal(b.zoekwoorden.length, 1)
    const zw = b.zoekwoorden[0]
    assert.equal(zw.bron, 'harborrank')
    assert.equal(zw.volume, 390)
    assert.equal(zw.cpc, null) // niet aangevuld uit een andere bron
    assert.equal(zw.metingen.length, 3)
    // oudere meting van dezelfde bron overschrijft niet
    voegMetingToe(b, 'laadpas frankrijk', { bron: 'harborrank', datum: '2026-07-01', volume: 10, moeilijkheid: 1, cpc: null })
    assert.equal(zw.volume, 390)
})
