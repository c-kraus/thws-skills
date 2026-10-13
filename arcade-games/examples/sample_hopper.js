const GAME_KEY = 'sample-hopper';
const row = (n, L) => ({prompt: L + ' ' + n + '?', options: [{label:'Right ' + n, ok:true, why:'Because it is right ' + n + '.'}, {label:'Wrong A' + n, ok:false, why:'Wrong A' + n + ' does not fit.'}, {label:'Wrong B' + n, ok:false, why:'Wrong B' + n + ' does not fit.'}, {label:'Wrong C' + n, ok:false, why:'Wrong C does not fit.'}]});
const round = (name, L) => ({name, rows: Array.from({length: 6}, (_, i) => row(i + 1, L))});
const DATA = {
 en: { title:'Sample Hopper', subtitle:'Test fixture', keys:'← → move · ↑ hop', rounds: [round('ROUND 1 · SAMPLE', 'Question'), round('ROUND 2 · SAMPLE', 'Another')] },
 de: { title:'Beispiel-Hopper', subtitle:'Testdaten', keys:'← → bewegen · ↑ springen', rounds: [round('RUNDE 1 · BEISPIEL', 'Frage'), round('RUNDE 2 · BEISPIEL', 'Noch eine')] }
};
