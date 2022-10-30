$(document).ready(function(){
  
  // event listeners
  $("#remaining-time").hide();
  $("#jumpscare").hide();
  $("#jumpscare2").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,

  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',
  // questions options and answers data
  questions: {
    q1: 'Double, double toil and trouble; fire burn and caldron bubble. A broomstick I ride into the night, making children squeal in fright. What am I?',
    q2: 'Josh and Renai Lambert, their son a demon\'s home. This horror movie franchise, its name you surely know.',
    q3: 'Trick or treat, they yell so loud. A prince, a witch, a little mouse. \'No treats\' you say, and slam the door. So a trick they play, and ___ your house.',
    q4: 'Emily Rose, a famous girl - no doubt. But what practice tried to draw her demons out?',
    q5: "Horror movie marathons, bring your popcorn and your sweets. Close your eyes and sit real tight, we\'re watching _________ on Elm Street",
    q6: 'This letter is hard, I must confess, so this you may not not. A dinosaur I\'ll be tonight - That one from Mario.',
   
  },
  options: {
    q1: ['Vampire', 'Witch',  'Demon', 'Ghost'],
    q2: ['Incidious', 'The Blair Witch Project', 'Carrie', 'The Shining'],
    q3: ['Leave', 'Ignore', 'Clean', 'Egg'],
    q4: ['Extortion', 'Witches\' Sabbath', 'Exorcism', 'Shanking'],
    q5: ['Something\'s', 'Nightmare', 'Silence', 'Murderer'],
    q6: ['Peach', 'Yoshi', 'Waluigi', 'Toad'],
    
  },
  answers: {
    q1: 'Witch',
    q2: 'Incidious',
    q3: 'Egg',
    q4: 'Exorcism',
    q5: 'Nightmare',
    q6: 'Yoshi',
    
  },
  // trivia methods
  // method to initialize game
  startGame: function(){
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    audio.play('theme.mp3');
  
    // show game section
    $('#game').show();
    
    //  empty last results
    $('#results').html('');
    
    // show timer
    $('#timer').text(trivia.timer);
    
    // remove start button
    $('#start').hide();

    $('#remaining-time').show();
    
    // ask first question
    trivia.nextQuestion();
    
  },
  // method to loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 20 seconds each question
    trivia.timer = 15;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn">'+key+'</button>'));
    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>BOO! The key was: '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3 class= "neonblue">That was a hell of a Heist!</h3>'+
        '<p>You stole '+ trivia.correct +' correct answers</p>'+
        '<p>'+ trivia.incorrect +' Incorrect answers</p>'+
        '<p>And left '+ trivia.unanswered +' answers</p>'+
        '<p>Wanna give it another shot?</p>');
      
      // hide game sction
      $('#game').hide();
      
      // show start button to begin a new game
      $('#start').show();
    }
    
  },
  // method to evaluate the option clicked
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      $("#jumpscare2").show();
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>You got it! Here\'s your candy!</h3>');
      
    }
    // else the user picked the wrong option, increment incorrect
    else{
      
      
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      $("#jumpscare").show();
      audio.pause('theme.mp3');
      audio2.play('monster.wav');
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 3700)
      $('#results').html('<h3>BOO! The key was: '+ currentAnswer +' Try again later ;)</h3>');
      
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    $("#jumpscare2").hide();
    audio2.pause('monster.wav');
    audio.play('theme.mp3');
    $("#jumpscare").hide();
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}