const GAME_KEY = 'sample-breakout';
const prompts = (L) => Array.from({length: 10}, (_, n) => ({prompt: L + ' ' + (n + 1) + '?', options: [{label:'Correct ' + (n + 1), ok:true, why:'This is the correct answer.'}, ...Array.from({length: 5}, (_, i) => ({label:'Wrong ' + (i + 1), ok:false, why:'Wrong ' + (i + 1) + ' is not correct.'}))]}));
const DATA = {
 en: { title:'Sample Breakout', subtitle:'Test fixture', keys:'← → paddle · SPACE launch', prompts: prompts('Question') },
 de: { title:'Beispiel-Breakout', subtitle:'Testdaten', keys:'← → Schläger · LEERTASTE Start', prompts: prompts('Frage') }
};
