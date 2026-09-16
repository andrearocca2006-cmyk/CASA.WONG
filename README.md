# Casa Wong — sito vetrina

Bozza mobile first per Casa Wong, costruita con Vite, HTML, CSS e JavaScript. La seta del primo schermo è disegnata una sola volta in canvas e reagisce al cursore tramite una trasformazione leggera. Su mobile le animazioni più costose sono disattivate; resta rispettata l'impostazione di sistema “riduci movimento”.

Il menu mobile si apre con una transizione breve; la scelta dei piatti anima l'anteprima. Le foto si aprono in una galleria navigabile con frecce, tastiera o swipe. Pulsanti e finestre di dialogo rispondono al tocco con animazioni attivate solo dall'interazione.

## Avvio

```bash
npm install
npm run dev
```

Per creare la versione pronta da pubblicare: `npm run build`.

## Anteprima su GitHub Pages

Ogni modifica inviata al ramo `main` avvia il workflow in `.github/workflows/deploy.yml` e pubblica la cartella `dist` su [GitHub Pages](https://andrearocca2006-cmyk.github.io/CASA.WONG/). La prima volta, nelle impostazioni del repository, seleziona **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Il link è pubblico e accessibile senza account, ma la pagina chiede ai motori di ricerca di non indicizzarla. Non è un accesso privato protetto da password.

## Completare i contenuti

Modifica [`src/content.js`](src/content.js):

- Conferma indirizzo, orari e prezzi con il locale prima di pubblicare. I dati ora presenti provengono dall'[articolo di Puntarella Rossa del 14 settembre 2026](https://www.puntarellarossa.it/2026/09/14/casa-wong-bologna-ristorante-ecuadoriano/).
- Inserisci il contatto ufficiale.
- Aggiungi i link reali per prenotazioni, asporto e menu. Fino ad allora, i pulsanti aprono un messaggio chiaro.
- Aggiorna i piatti e le foto nei campi `menuCategories`, se la carta cambia.
- Puoi sostituire le immagini in `public/images/instagram/` e aggiornare i percorsi nei campi `photos` e `menuCategories[].image`.
- La mappa Google è incorporata nella sezione finale; aggiorna `mapEmbedUrl` e `mapUrl` se cambia l'indirizzo.

## Fotografie della bozza

Le immagini locali in `public/images/instagram/` sono state ricavate dai post pubblici visibili sul [profilo @casa.wong](https://www.instagram.com/casa.wong/), in particolare dal post in collaborazione con [Sophie the girl who eats](https://www.instagram.com/p/DdGoc1DimR4/) e dalla copertina di un [reel del locale](https://www.instagram.com/reel/Dc5paGtNUMs/). Sono salvate localmente per evitare richieste a Instagram durante la visita e link fotografici a scadenza.
