const GAME_KEY = 'sample-maze';
const rnd = (target, okTag, badTag) => ({target, items: [...Array.from({length: 4}, (_, i) => ({label: okTag + ' ' + (i + 1), ok: true, why: okTag + ' fits.'})), ...Array.from({length: 5}, (_, i) => ({label: badTag + ' ' + (i + 1), ok: false, why: badTag + ' does not fit.'}))]});
const DATA = {
 en: { title:'Sample Maze', subtitle:'Test fixture', keys:'← → ↑ ↓ move', rounds: [rnd('SAMPLE ONE', 'Fits', 'Misfit'), rnd('SAMPLE TWO', 'Match', 'Other'), rnd('SAMPLE THREE', 'Good', 'Bad')] },
 de: { title:'Beispiel-Labyrinth', subtitle:'Testdaten', keys:'← → ↑ ↓ bewegen', rounds: [rnd('BEISPIEL EINS', 'Passt', 'Falsch'), rnd('BEISPIEL ZWEI', 'Treffer', 'Anderes'), rnd('BEISPIEL DREI', 'Gut', 'Schlecht')] }
};
