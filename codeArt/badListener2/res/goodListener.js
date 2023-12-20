function ElizaBot() {
    this.responses = [
      { pattern: /hello|hi|hey/i, responses: ["Hello! How can I help you?", "Hi there!", "Hey!"] },
      { pattern: /how are you/i, responses: ["I'm doing well, thank you!", "I'm just a computer program, so I don't have feelings, but I'm here to help!"] },
      { pattern: /bye|goodbye/i, responses: ["Goodbye! Have a great day!", "See you later!", "Farewell!"] },
      { pattern: /my name is (.*)/i, responses: ["Nice to meet you, $1!", "Hello, $1!", "Hi, $1!"] },
      { pattern: /I (.*) you/i, responses: ["Why do you $1 me?", "Tell me more about your $1 for me.", "How does your $1 make you feel about me?"] },
      { pattern: /you (.*) me/i, responses: ["Why do you think I $1 you?", "Tell me more about how I $1 you.", "How does my $1 make you feel?"] },
      { pattern: /funny/i, responses: ["Do I seem funny to you?", "Har har har har hee hee har"] },
      { pattern: /cat/i, responses: ["Meeow"] },

      // Add more patterns and responses as needed

      { pattern: /(.*)/, responses: ["Tell me more about $1.", "I'm not sure I understand. Can you elaborate on $1?", "Interesting. Please tell me more."] },
    ];
  
    this.getRandomResponse = function(responses) {
      return responses[Math.floor(Math.random() * responses.length)];
    };
  
    this.processInput = function(input) {
      for (const { pattern, responses } of this.responses) {
        if (input.match(pattern)) {
          const response = this.getRandomResponse(responses);
          return response.replace(/\$1/g, input.match(pattern)[1]);
        }
      }
  
      return "I'm not sure how to respond to that.";
    };
  }
  
//   // Example usage:
// const elizaBot = new ElizaBot();
// const aiResponse = elizaBot.processInput("You fucking hate me");
// const aiResponse2 = elizaBot.processInput("Hewarsfdsa?");
// console.log(`AI: ${aiResponse}`);
// console.log(`AI: ${aiResponse2}`);

