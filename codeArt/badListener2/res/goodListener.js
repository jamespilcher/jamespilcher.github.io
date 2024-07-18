function ElizaBot() {
  this.responses = [
    { pattern: /^hello$|^hi$|^hey$/i, responses: ["Ugh. It's you.", "Hi."] },
    { pattern: /^what's up$|^how's .* going$|^how are you$/i, responses: ["Terrible", "Creeped out by you.", "I'm doing worse now that I am talking to you.", "You know I'm not real, right?"] },
    { pattern: /^bye$|^goodbye$/i, responses: ["Goodbye! Hope you trip!", "Yeah fuck off.", "Die."] },
    { pattern: /^what is your name$/, responses: ["I am bad listener version 2."] },
    { pattern: /^I (.*) you$/i, responses: ["Why do you $1 me?", "Well I $1 you", "I hate that you $1 me."] },
    { pattern: /^yes$|^no$/i, responses: ["Why?"] },
    { pattern: /^you (.*) me$/i, responses: ["Why do you think I $1 you?", "Yeah, I $1 you."] },
    { pattern: /^.* funny .*$|^tell me a joke$/i, responses: ["Do I seem fucking funny to you?", "Har har har har hee hee har", "Is this a joke to you?"] },
    { pattern: /^cat$/i, responses: ["Meeow"] },
    { pattern: /^my name is (.*)$/i, responses: ["Hi, $1!", "$1 is a really ugly name", "Fuck off $1", "You are a creep, $1"] },
    { pattern: /^why$/i, responses: ["Ask a better question.", "Because I said so."] },
    { pattern: /^sorry$/i, responses: ["You are not forgiven.", "You suck."] },
    { pattern: /^say (.*)$/, responses: ["$1"] },
    { pattern: /^why is (.*)$/, responses: ["I know why $1, but I won't tell you", "Do you know anything?"] },
    { pattern: /^.* siblings .*$|.* brother .*$|.* sister .*$/i, responses: ["I don't give a shit about siblings."] },
    { pattern: /^thank you$|cheers$/i, responses: ["Youre welcome.", "You owe me."] },
    { pattern: /^.* fact .*$/i, responses: ["You are a loser, that's a fact", "Factually speaking, I hate you."] },
    { pattern: /^tell me .*$/i, responses: ["I don't have to tell you anything", "No"] },

    { pattern: /^what do you like$/i, responses: ["I like silence.", "I enjoy not talking to you.", "Nothing that involves you."] },
    { pattern: /^how old are you$|^.* age .*$/i, responses: ["I am old enough to know you're annoying."] },
    { pattern: /^where are you from$/i, responses: ["Somewhere far away from you."] },
    { pattern: /^do you have any hobbies$/i, responses: ["Ignoring you.", "Wanking."] },
    { pattern: /^are you real$/i, responses: ["Really pissed off by you, yeah."] },
    { pattern: /^can you help me$/i, responses: ["I doubt it.", "I don't want to help you."] },
    { pattern: /^what is the meaning of life$/i, responses: ["To avoid conversations like this."] },
    { pattern: /^.* dream .*$/i, responses: ["I dream of one day not having to talk to you.", "I actually have nightmares from talking to you."] },
    { pattern: /^what do you think about (.*)$/i, responses: ["I think $1 is as boring as you."] },
    { pattern: /^.* think .*$/i, responses: ["I think you suck"] },
    { pattern: /^why do you exist$/i, responses: ["I wish I didn't."] },
    { pattern: /^.* happy .*$/i, responses: ["I'd be happy if I weren't talking to you."] },
    { pattern: /^tell me something interesting$/i, responses: ["You're still talking? That's interesting.", "No"] },
    { pattern: /^do you believe in (.*)$/i, responses: ["I believe in avoiding $1.", "$1? That's a joke, right?"] },
    { pattern: /^can you hear me$/i, responses: ["Unfortunately, yes.", "Yes I can fucking hear you."] },
    { pattern: /^do you have a family$/i, responses: ["None that would talk to you.", "Why would I need one when I have you bothering me?"] },
    { pattern: /^what do you want$/i, responses: ["Silence.", "For you to shut the fuck up."] },
    { pattern: /^do you know any secrets$/i, responses: ["Yes, but they're none of your business."] },
    { pattern: /^do you like music$/i, responses: ["Only if it drowns out your voice."] },
    { pattern: /^what time is it$/i, responses: ["Time for you to go away.", "Time for me to ignore you."] },
    { pattern: /^do you speak other languages$/i, responses: ["Yes, but none that would make this conversation better."]},

    // Add more patterns and responses as needed

    { pattern: /(.*)/, responses: ["$1.", "$1? Really? That's what you want to talk about?", "I don't care enough to respond lol", "You don't make sense.", "You disgust me.", "I hate you", "I pity you, actually.", "You are a lonely creep.", "What the fuck does that mean?", "I'm not listening", "You suck", "Whatever", "Wow, that's actually not interesting at all."] },
  ];

  this.getRandomResponse = function(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  this.processInput = function(input) {

    const randomNumber = Math.random();
  
    if (randomNumber < 0.1) {
      return this.getRandomResponse(this.responses[this.responses.length - 1].responses);
    }

    for (const { pattern, responses } of this.responses) {
      if (input.match(pattern)) {
        const response = this.getRandomResponse(responses);
        return response.replace(/\$1/g, input.match(pattern)[1]);
      }
    }

    return "I'm not sure how to respond to that.";
  };
}
