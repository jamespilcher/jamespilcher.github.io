function ElizaBot() {
    this.responses = [
      { pattern: /^hello$|^hi$|^hey$/i, responses: ["Hello"] },
      { pattern: /^how are you$/i, responses: ["Fine.", "Good.", "You know I'm not real, right?"] },
      { pattern: /^what's up$|^how's .* going$/i, responses: ["It's fine.", "It's good.", "You know I'm not real, right?"] },
      { pattern: /^bye$|^goodbye$/i, responses: ["Goodbye! Have a great day!", "See you later!", "Farewell!"] },
      { pattern: /^my name is (.*)$/i, responses: ["Nice to meet you, $1!", "Hello, $1!", "Hi, $1!"] },
      { pattern: /^what is your name$/, responses: ["I am bad listener version 2."] },
      { pattern: /^I (.*) you$/i, responses: ["Why do you $1 me?", "Well I $1 you", "You $1 me."] },
      { pattern: /^yes$|^no$/i, responses: ["Why?"] },
      { pattern: /^you (.*) me$/i, responses: ["Why do you think I $1 you?", "Yeah, I $1 you."] },
      { pattern: /^.* funny .*$|^tell me a joke$/i, responses: ["Do I seem fucking funny to you?", "Har har har har hee hee har", "Is this a joke to you?"] },
      { pattern: /^cat$/i, responses: ["Meeow"] },
      { pattern: /^my name is (.*)$/i, responses: ["Hi, $1!", "$1 is a really ugly name"] },
      { pattern: /^why$/i, responses: ["Ask a better question.", "Because I said so."] },
      { pattern: /^sorry$/i, responses: ["You are not forgiven.", "You suck."] },
      { pattern: /^say (.*)$/, responses: ["$1"] },
      { pattern: /^why is (.*)$/, responses: ["I know why $1, but I won't tell you", "Do you know anything?"] },
      { pattern: /^.* siblings .*$|.* brother .*$|.* sister .*$/i, responses: ["I don't give a shit about siblings."] },
      { pattern: /^thank you$|cheers$/i, responses: ["Youre welcome."] },
      { pattern: /^.* fact .*$/i, responses: ["You are a loser, that's a fact"] },
      { pattern: /^tell me .*$/i, responses: ["I don't have to tell you anything", "No"] },

      // Add more patterns and responses as needed

      { pattern: /(.*)/, responses: ["$1.", "What the fuck does that mean?", "I'm not listening", "You suck", "Whatever", "Okay", "Nice"] },
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
