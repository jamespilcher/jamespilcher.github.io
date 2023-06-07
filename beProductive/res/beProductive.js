const busyworkTasks = [
  "Sort through your wardrobe and donate clothes you no longer wear.",
  "Clean one room in your home, focusing on dusting, wiping surfaces, and vacuuming.",
  "Create a budget or review your financial goals and track your expenses.",
  "Declutter your digital devices by deleting unnecessary files, apps, or photos.",
  "Engage in a workout or exercise routine that suits your fitness level.",
  "Research and try out a new hobby or craft that interests you.",
  "Deep clean your car, both inside and out.",
  "Plan a day trip or outing to explore a new place in your city or nearby.",
  "Reorganize something in your life - could be a bookshelf or your music collection.",
  "Take on a small home improvement project, such as painting a room or organizing a storage area.",
  "Research and sign up for a course or workshop to expand your knowledge and skills.",
  "Spend time engaging in a creative activity, such as painting, drawing, or playing a musical instrument.",
  "Clean and organize your refrigerator, discarding expired items and wiping down shelves.",
  "Go for a nature walk or hike to connect with the outdoors and get some exercise.",
  "Review your monthly bills and see if there are any opportunities to save money or negotiate better rates.",
  "Research and try out a new recipe for a healthy snack or smoothie.",
  "Review your social media accounts and unfollow accounts that no longer bring you joy or inspiration.",
  "Reconnect with a friend or family member by calling or video chatting with them.",
  "Organize and update your personal or professional documents, such as resumes, certificates, or licenses.",
  "Research and plan a future vacation or getaway, even if it's just a weekend trip.",
  "Spend time in nature, whether it's visiting a park, going for a bike ride, or having a picnic.",
  "Review your goals and make adjustments or set new ones.",
  "Clean and organize your workspace or desk to improve productivity and focus.",
  "Try a new form of exercise or physical activity, such as dancing, rock climbing, or martial arts.",
  "Research and try out a new recipe for a healthy and delicious meal.",
  "Plan a social event with friends or family.",
  "Spend time organizing and backing up important digital files and documents.",
  "Check you spending to see where you could easily save money",
  "Engage in a random act of kindness, such as writing a thank-you note or helping a neighbour.",
  "Put a wash on.",
  "Do the dishes.",
  "Make your bed.",
  "Spend time decluttering and organizing your social calendar, prioritizing activities and commitments that align with your values.",
  "Spend time decluttering and organizing your social media accounts, unfollowing accounts that no longer resonate with you.",
  "Spend time decluttering and organizing your computer desktop, deleting unnecessary files and shortcuts.",
  "Wipe down a surface. Any surface.",
  "Unistall apps you no longer use.",
  "Close your unused tabs.",
  "Write down the next 5 productive things that need completing.",
];

randomTask = busyworkTasks[Math.floor(Math.random() * busyworkTasks.length)];

document.getElementById("task").innerHTML = randomTask;


var utterance = new SpeechSynthesisUtterance();
utterance.text = randomTask;
voices = window.speechSynthesis.getVoices();

utterance.volume = .8; // Range from 0 to 1
utterance.rate = 1.05; // Range from 0.1 to 10
utterance.pitch = 1; // Range from 0 to 2

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  console.log(voices);
  utterance.voice = voices[Math.floor(Math.random() * voices.length)]; // random voice
  window.speechSynthesis.speak(utterance);
  // (67) [SpeechSynthesisVoice, SpeechSynthesisVoice, ...]
};