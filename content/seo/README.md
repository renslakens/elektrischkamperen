# SEO-data van ElektrischKamperen.nl

In deze map staat de SEO-data van de site. De logica zit in de aparte toolkit `../seo-toolkit` (CLI `seo`, geïnstalleerd als `file:../seo-toolkit`). Alles wat site-specifiek is (landen, thema's, affiliate-termen, URL-structuur, frontmatter) staat in `seo.config.json` in de root van de repo. De volledige uitleg (configuratie, heuristiek, score, Search Console) staat in de README van de toolkit.

## Eenmalig

```bash
cd ../seo-toolkit && npm install && cd ../elektrischkamperen
npm install            # linkt de toolkit; node_modules/.bin/seo
```

Zonder `../seo-toolkit` (bijv. op Vercel) blijft `npm ci` werken. Alleen de `seo:*`-scripts en de SEO-check in `import:gids` doen dan niets, met een melding.

## Workflow

1. **Zoekwoorden verzamelen**
   - Onderzoek via HarborRank (de plugin in Claude Code) opslaan als CSV/JSON en importeren: `npm run seo:import -- harborrank.csv --bron harborrank`
   - Exports uit Search Console of Keyword Planner: zie hieronder.
   - Zelf uitbreiden: `npm run seo:expand -- "laadpas buitenland"`, of zonder seed voor alle seeds uit `seeds.md`. `--geen-autocomplete` gebruikt alleen `seeds.md`.
2. **Clusteren en scoren:** `npm run seo:cluster`. Dit werkt `keywords.json` en `backlog.md` bij.
3. **Dekking controleren:** `npm run seo:dekking` toont dubbele focus keywords, kannibalisatie en backlog-onderwerpen die al (bijna) bestaan.
4. **Onderwerpen kiezen:** `npm run seo:next -- 4`. Dit zet de 4 hoogste todo-onderwerpen op `in-uitvoering` en stelt publicatiedata voor (de dinsdag van week 1–4 van de volgende maand). Met `--droog` wordt er niets gewijzigd.
5. **Briefing:** `npm run seo:brief -- <slug>` maakt `briefs/<slug>.md`.
6. **Schrijven:** maak `content/gidsen/<slug>.md`. Interne links vind je met `npm run seo:links -- <slug|bestand>`.
7. **Controleren:** `npm run seo:lint -- content/gidsen/<slug>.md`. Met `--geen-netwerk` worden externe links overgeslagen.
8. **Importeren:** `npm run import:gids -- --dry content/gidsen/<slug>.md`, daarna zonder `--dry`. Een gids met seo-fouten wordt geweigerd; met `--forceer` gaat hij er bewust toch door.
9. **Search Console** (als de sleutel is ingesteld): `npm run seo:gsc`, daarna weer `npm run seo:cluster`.

De slash-command **`/maandelijkse-gidsen`** (`.claude/commands/maandelijkse-gidsen.md`) voert stap 3 t/m 8 uit voor 4 artikelen: niets publiceren, niets committen, en een rapport per artikel. Na een wijziging in het sjabloon van de toolkit vernieuw je de command met `npm run seo:init -- --commands --forceer`.

## Welke bestanden bewerk je met de hand?

| bestand | handmatig? |
| --- | --- |
| `../../seo.config.json` | ja: thema's, affiliate-termen, merken, uitsluitlijst, drempels |
| `seeds.md` | ja: seeds (`## kop`) met varianten (lijst) |
| `backlog.md` | alleen `status` (todo / in-uitvoering / concept / gepubliceerd), `opmerkingen` en `slug`; die blijven staan bij `seo:cluster` |
| `briefs/*.md` | ja (worden alleen met `--forceer` overschreven) |
| `keywords.json` | nee, alleen via `seo:import`, `seo:expand` en `seo:cluster` |
| `performance.json` | nee, alleen via `seo:gsc` |
| `.cache/` | nee; staat in `.gitignore` |

Staat er ruis in de suggesties (bijv. Duitse resultaten bij "laden")? Zet het woord in `zoekwoorden.uitsluiten` in `seo.config.json` en draai `seo:cluster` opnieuw.

## Exports maken

- **HarborRank:** bewaar het resultaat als CSV of JSON met een kolom `Keyword`. `Volume`, `KD`, `CPC` en `Intent` worden herkend. Importeer met `npm run seo:import -- bestand.csv --bron harborrank`. Kolommen die het commando niet kent, worden gemeld.
- **Google Search Console:** Prestaties → Zoekresultaten → Exporteren → CSV. Gebruik `Zoekopdrachten.csv` uit de zip: `npm run seo:import -- Zoekopdrachten.csv --bron search-console`. Vertoningen en posities worden bewaard, maar tellen niet als zoekvolume.
- **Google Keyword Planner:** Zoekwoordideeën → Downloaden → CSV. Importeer met `npm run seo:import -- "Keyword Stats ….csv" --bron keyword-planner`. Een volumebereik ("1K – 10K") wordt geen getal.
- **Eenvoudig:** een CSV met `term,volume`.

Is de export ouder dan vandaag, voeg dan `--datum JJJJ-MM-DD` toe.

## Wat kost credits?

**Niets**, zolang er geen betaalde provider is toegevoegd. Wel externe aanroepen, allemaal 30 dagen gecachet in `.cache/` (`--refresh` om dat te negeren):

- `seo:expand` → Google-suggesties (onofficieel endpoint, gratis, 1 aanroep per seconde, 8 per seed)
- `seo:lint` → een HEAD-verzoek per externe link (niet met `--geen-netwerk`)
- `seo:links`, `seo:brief`, `seo:lint` → Sanity-query voor campings en routes, alleen als er een token in `.env.local` staat
- `seo:gsc` → Search Console API (gratis)

## Instellen in `.env.local`

```
# Sanity (staat er al voor de import): token nodig voor camping-/routelinks in seo:links en seo:lint
SANITY_API_WRITE_TOKEN=…      # of SANITY_API_READ_TOKEN=…

# Search Console (optioneel, zie README van seo-toolkit)
GSC_SERVICE_ACCOUNT_JSON=/pad/naar/serviceaccount.json
GSC_PROPERTY=sc-domain:elektrischkamperen.nl
```
