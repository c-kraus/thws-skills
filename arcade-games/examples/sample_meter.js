const GAME_KEY = 'sample-meter';
const opt = (n) => Array.from({length: 5}, (_, i) => ({label: 'Option ' + n + '.' + (i + 1), why: 'Reason for option ' + n + '.' + (i + 1) + '.'}));
const rounds = (L) => Array.from({length: 9}, (_, n) => ({situation: L + ' ' + (n + 1) + ': what is the mean?', mean: 1 + (n % 3), options: opt(n + 1)}));
const DATA = {
 en: { title: 'Sample Meter', subtitle: 'Test fixture', keys: 'SPACE = stop', axis: ['TOO LITTLE', 'TOO MUCH'], rounds: rounds('Situation') },
 de: { title: 'Beispiel-Meter', subtitle: 'Testdaten', keys: 'LEERTASTE = Stopp', axis: ['ZU WENIG', 'ZU VIEL'], rounds: rounds('Situation') }
};
