---
description: Maandelijkse run voor ElektrischKamperen.nl: 4 nieuwe artikelen kiezen, briefen, schrijven, linten en als draft importeren. Niets publiceren of committen.
---

# Maandelijkse artikelen voor ElektrischKamperen.nl

Je schrijft 4 nieuwe artikelen met de seo-toolkit. Werk de stappen hieronder in volgorde af.

## Harde regels

- **Niets publiceren, niets committen of pushen**, tenzij de gebruiker daar in dit gesprek om vraagt. De import maakt alleen drafts.
- **Verzin niets.** Geen cijfers, prijzen, tarieven, netwerken, stekkertypen, afstanden, citaten, bronnen of URL's die je niet zelf hebt gecontroleerd. Kun je een feit niet met een bron bevestigen, laat het dan weg of zet het op de lijst "nog te controleren" in het rapport.
- Interne links alleen uit de briefing of uit `npm run seo:links` (die stelt alleen bestaande URL's voor).
- Veelgestelde vragen alleen uit de briefing. Heeft de briefing er te weinig, vul dan niet aan.
- Wijzig geen bestaande artikelen. Bevindingen over bestaande artikelen zet je in het rapport.

## Stappen

1. **Dekking.** Draai `npm run seo:dekking`. Staan er fouten in (bijv. een dubbel focus keyword), stop dan en leg ze aan de gebruiker voor.
2. **Onderwerpen.** Draai `npm run seo:next -- 4`. Noteer per onderwerp de slug, het focus keyword en de voorgestelde `gepubliceerd_op`: de dinsdag van week 1 t/m 4 van de volgende maand. Gebruik de datums uit de uitvoer en reken ze niet zelf uit.
3. **Briefings.** Draai per onderwerp `npm run seo:brief -- <slug>` en lees `content/seo/briefs/<slug>.md` helemaal.
4. **Schrijven.** Schrijf per onderwerp `content/gidsen/<slug>.md`:
   - Gebruik de geïnstalleerde plugins: **SEO Writers** voor schrijven en review, **Marketing** voor de toon, **seo-geo-consultant** voor de controle. Is een plugin niet beschikbaar, zeg dat dan in het rapport en doe niet alsof je hem gebruikt hebt.
   - Neem de frontmatter-velden over van een bestaand artikel in `content/gidsen/`, met de waarden uit de briefing en `gepubliceerd_op` uit stap 2.
   - Volg de briefing: focus keyword in titel, SEO-titel, eerste alinea en minstens één H2; de voorgestelde H2/H3-structuur; doellengte; de interne links; de affiliate-notitie.
   - Werk de lijst "feiten die bevestigd moeten worden" af: zoek per feit een betrouwbare bron, lees die, en zet hem in de bronnensectie (minstens zoveel links als `seo lint` eist). Houd bij welke feiten je níét kon bevestigen.
5. **Lint.** Draai per bestand `npm run seo:lint -- content/gidsen/<slug>.md`. Los alle fouten in je nieuwe artikelen op en lint opnieuw tot er 0 fouten zijn. Waarschuwingen los je op als dat zonder verzinnen kan.
6. **Proefimport.** Draai `npm run import:gids -- --dry <bestanden>` voor de nieuwe bestanden en controleer de uitvoer. Een gids met seo-fouten wordt geweigerd: los de fouten op. Gebruik nooit zelf `--forceer`.
7. **Import.** Pas als de proefimport zonder fouten is: `npm run import:gids -- <bestanden>` voor alleen de nieuwe bestanden. Dit maakt drafts; publiceren doet de gebruiker zelf.
8. **Backlog.** Zet in `content/seo/backlog.md` de status van deze onderwerpen op `concept`.

## Rapport

Eindig met een rapport per artikel:

| bestand | focus keyword | woorden | lint (fouten / waarschuwingen) | gepubliceerd_op |
| --- | --- | --- | --- | --- |

Geef per artikel daaronder:

- **Feiten die de gebruiker nog moet controleren**, met de plek in de tekst (kop of regel).
- Welke plugins je hebt gebruikt, en welke niet beschikbaar waren.
- Bevindingen uit `seo:dekking` die aandacht nodig hebben.

Zeg ook dat er niets gecommit of gepubliceerd is.
