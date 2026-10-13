const GAME_KEY = 'sample-invaders';
const mk = (L) => L;
const stm = (en) => en;
const DATA = {
 en: { title:'Sample Invaders', subtitle:'Test fixture', keys:'← → move · SPACE fire', statements: [] },
 de: { title:'Beispiel-Invaders', subtitle:'Testdaten', keys:'← → bewegen · LEERTASTE schießen', statements: [] }
};
for (let i = 0; i < 12; i++){
  DATA.en.statements.push(['True statement number ' + (i + 1) + ' about arcade testing.', true, 'It is true because it is a test.']);
  DATA.en.statements.push(['False statement number ' + (i + 1) + ' about arcade testing.', false, 'It is false because it is a test.']);
  DATA.de.statements.push(['Richtige Aussage Nummer ' + (i + 1) + ' zum Testen.', true, 'Sie ist richtig, weil es ein Test ist.']);
  DATA.de.statements.push(['Falsche Aussage Nummer ' + (i + 1) + ' zum Testen.', false, 'Sie ist falsch, weil es ein Test ist.']);
}
