

const preps = ['in', 'from', 'by']
const locations = [
  'library',
  'observatory',
  'laboratory',
  'institute',
  'academy',
  'research center',
  'study hall',
  'seminar room',
  'conference hall',
  'lecture theater',
  'classroom',
  'archive',
  'gallery',
  'studio',
  'exhibition hall',
  'theater',
  'conservatory',
  'philharmonic',
  'opera house',
  'planetarium',
  'gallery',
  'studio',
  'museum',
  'hall of fame',
  'hall of records',
  'hall of knowledge',
  'hall of wisdom',
  'hall of exploration',
  'hall of innovation',
  'hall of discovery',
  'hall of achievement',
  'chamber of intellect',
  'forum',
  'symposium',
  'colloquium',
  'salon',
  'sanctum',
  'cabinet',
  'sanctorium',
  'center for excellence',
];
const dets = ['the', 'a'];
const adjs = [
  'cogitative',
  'perspicacious',
  'sagacious',
  'discerning',
  'profound',
  'cerebral',
  'ruminative',
  'ponderous',
  'judicious',
  'prudent',
  'thought-provoking',
  'contemplative',
  'reflective',
  'deliberative',
  'philosophical',
  'perceptive',
  'meticulous',
  'methodical'
];
const nouns = [
  'intellect',
  'cognition',
  'wisdom',
  'mind',
  'logic',
  'insight',
  'genius',
  'scholar',
  'thinker',
  'philosopher',
  'sage',
  'scientist',
  'invention',
  'discovery',
  'theory',
  'equation',
  'knowledge',
  'inquiry',
  'curiosity',
  'conundrum',
  'puzzle',
  'riddle',
  'enigma',
  'paradox',
  'notion',
  'concept',
  'creativity',
  'perception',
  'illumination',
  'wonder',
  'speculation',
  'hypothesis',
  'intelligence',
  'reflection',
  'contemplation',
  'deliberation',
  'cogitation',
  'meditation',
  'cerebration',
  'intellection',
  'discernment',
  'reasoning',
  'rationality',
  'inspiration',
  'epiphany',
  'thought'
];

const verbs = [
  'analyzes',
  'calculates',
  'synthesizes',
  'conceptualizes',
  'innovates',
  'discovers',
  'explores',
  'experiments',
  'investigates',
  'proposes',
  'devises',
  'engineers',
  'designs',
  'constructs',
  'develops',
  'formulates',
  'derives',
  'speculates',
  'ponders',
  'contemplates',
  'reflects',
  'evaluates',
  'critiques',
  'scrutinizes',
  'investigates',
  'questions',
  'challenges',
  'reasons',
  'synthesizes',
  'understands',
  'interprets',
  'deduces',
  'analyzes',
  'solves',
  'deciphers',
  'discerns',
  'conceives',
  'imagines',
  'creates',
];

const advs = [
  'analytically',
  'calculatingly',
  'synthetically',
  'conceptually',
  'innovatively',
  'discoveredly',
  'exploratively',
  'experimentally',
  'investigatively',
  'profoundly',
  'devisingly',
  'ingeniously',
  'designingly',
  'constructively',
  'developingly',
  'formulatively',
  'speculatively',
  'ponderously',
  'contemplatively',
  'reflectively',
  'evaluatively',
  'critically',
  'scrutinizingly',
  'investigatively',
  'questioningly',
  'challengingly',
  'reasoningly',
  'synthetically',
  'understandingly',
  'interpretively',
  'deductively',
  'analytically',
  'solutionly',
  'decipheringly',
  'discerningly',
  'conceivably',
  'imaginatively',
  'creatively',
];

// Define CFG rules for generating sentences
const rules = {
  S: [
    ['NP', 'VP'],
    ['NP', 'VP', 'PP'],
    ['PP', 'NP', 'VP',]
  ],
  NP: [
    ['Det', 'Adj', 'Noun'],
    ['Det', 'Noun'],
  ],
  VP: [
    ['Verb'],
    ['Verb', 'Adv'],
  ],
  PP: [
    ['Prep', 'Det', 'Location'],
  ],
  Prep: preps,
  Location: locations,
  Det: dets,
  Adj: adjs,
  Noun: nouns,
  Verb: verbs,
  Adv: advs
};

sentence = [];
function generateProduction(symbol) {
  const production = rules[symbol];
  const selectedProduction = production[Math.floor(Math.random() * production.length)];
  // if its a word, add it to the sentence directly
  if (!Array.isArray(selectedProduction)) {
    sentence.push(selectedProduction);
  }
  else{
    // for each symbol in the current rule, generate its production!
    for (newSymbol of selectedProduction) {
        generateProduction(newSymbol);
    }
  }
  return;
}

function generateSentence() {
  sentence = [];
  generateProduction('S');
  output = sentence.join(' ');
  return output;
}

function userInputBox() {
  conversation.innerHTML += "<div class='message left' id='inputBox'>" + "<b>[YOU]</b><br>" + 
                            "<input type='text' id='messageInput' placeholder='_____________________'></div>";
                  
  userInput = document.getElementById('messageInput');
  userInput.focus();
  userInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      appendUserReply(userInput.value.trim());
      inputBox.remove();
      appendBotReply()
    }
  });
}

function appendUserReply(userInput) {
  conversation.innerHTML += "<div class='message left'>" + userInput + "</div>";
}

function appendBotReply() {
  conversation.innerHTML += "<div class='message right' id='botReplyMessage'>.</div>";
  botReply = generateSentence()
  i = 0
  output = ""
  var timer = setInterval(function () {
    if (i == botReply.length){
      clearInterval(timer);
      userInputBox();
      botReplyMessage.removeAttribute('id');
      return
    }
    output += botReply.charAt(i);
    console.log(output);
    botReplyMessage.innerHTML = "<i>..." + output + "...</i>";
    i++;
  }, 35);
}
userInputBox();