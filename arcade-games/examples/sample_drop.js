const GAME_KEY = 'sample-drop';
const item = (n, lane) => ['Item ' + n, lane, 'Rule for item ' + n + '.'];
const mkLevel = (name, lanes) => ({name, lanes, items: Array.from({length: 10}, (_, i) => item(i + 1, i % lanes.length))});
const DATA = {
 en: { title:'Sample Drop', subtitle:'Test fixture', keys:'← → lane · ↓ faster', levels: [mkLevel('LEVEL 1 · THREE LANES', ['A', 'B', 'C']), mkLevel('LEVEL 2 · TWO LANES', ['YES', 'NO'])] },
 de: { title:'Beispiel-Drop', subtitle:'Testdaten', keys:'← → Spur · ↓ schneller', levels: [mkLevel('LEVEL 1 · DREI SPUREN', ['A', 'B', 'C']), mkLevel('LEVEL 2 · ZWEI SPUREN', ['JA', 'NEIN'])] }
};
