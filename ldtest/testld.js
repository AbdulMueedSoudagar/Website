(function() {
    var questions = [
      {
        question: "Difficulties with reading, such as struggling to decode words, slow reading speed, or poor reading comprehension",
        choices: ["Yes", "No"]
      },
      {
        question: "Challenges in writing, including problems with spelling, grammar, punctuation, or organizing thoughts coherently",
        choices: ["Yes", "No"]
      },
      {
        question: "Trouble with mathematics, such as difficulties understanding concepts, performing calculations, or remembering math facts",
        choices: ["Yes", "No"]
      },
      {
        question: "Persistent struggles with understanding and recalling information, both orally and in written form",
        choices: ["Yes", "No"]
      },
      {
        question: "Difficulty following instructions or understanding spoken directions",
        choices: ["Yes", "No"]
      },
      {
        question: "Problems with organizational skills, time management, and completing tasks within designated timeframes",
        choices: ["Yes", "No"]
      },
      {
        question: "Challenges with memory, both short-term and long-term",
        choices: ["Yes", "No"]
      },
      {
        question: "Poor coordination and motor skills, which may impact tasks such as handwriting, tying shoelaces, or participating in sports",
        choices: ["Yes", "No"]
      },
      {
        question: "Social difficulties, including trouble understanding social cues, making friends, or engaging in age-appropriate social interactions",
        choices: ["Yes", "No"]
      },
      {
        question: "Emotional or behavioral issues related to academic tasks, such as frustration, low self-esteem, or avoidance of learning-related activities",
        choices: ["Yes", "No"]
      }
    ];
  
    var questionCounter = 0; // Tracks question number
    var selections = []; // Array containing user choices
    var quiz = $('#quiz'); // Quiz div object
  
    // Display initial question
    displayNext();
  
    // Click handler for the 'next' button
    $('#next').on('click', function(e) {
      e.preventDefault();
  
      // Suspend click listener during fade animation
      if (quiz.is(':animated')) {
        return false;
      }
      choose();
  
      // If no user selection, progress is stopped
      if (selections[questionCounter] === undefined) {
        alert('Please make a selection!');
      } else {
        questionCounter++;
        displayNext();
      }
    });
  
    // Click handler for the 'prev' button
    $('#prev').on('click', function(e) {
      e.preventDefault();
  
      if (quiz.is(':animated')) {
        return false;
      }
      choose();
      questionCounter--;
      displayNext();
    });
  
    // Click handler for the 'Start Over' button
    $('#start').on('click', function(e) {
      e.preventDefault();
  
      if (quiz.is(':animated')) {
        return false;
      }
      questionCounter = 0;
      selections = [];
      displayNext();
      $('#start').hide();
    });
  
    // Animates buttons on hover
    $('.button').on('mouseenter', function() {
      $(this).addClass('active');
    });
    $('.button').on('mouseleave', function() {
      $(this).removeClass('active');
    });
  
    // Creates and returns the div that contains the questions and 
    // the answer selections
    function createQuestionElement(index) {
      var qElement = $('<div>', {
        id: 'question'
      });
  
      var header = $('<h2>Question ' + (index + 1) + ':</h2>');
      qElement.append(header);
  
      var question = $('<p>').append(questions[index].question);
      qElement.append(question);
  
      var radioButtons = createRadios(index);
      qElement.append(radioButtons);
  
      return qElement;
    }
  
    // Creates a list of the answer choices as radio inputs
    function createRadios(index) {
      var radioList = $('<ul>');
      var item;
      var input = '';
      for (var i = 0; i < questions[index].choices.length; i++) {
        item = $('<li>');
        input = '<input type="radio" name="answer" value=' + questions[index].choices[i] + ' />';
        input += questions[index].choices[i];
        item.append(input);
        radioList.append(item);
      }
      return radioList;
    }
  
    // Reads the user selection and pushes the value to an array
    function choose() {
      var choice = $('input[name="answer"]:checked').val();
      if (choice !== undefined) {
        if (choice === "Yes") {
          selections[questionCounter] = questions[questionCounter].question;
        } else if (choice === "No") {
          selections[questionCounter] = null;
        }
      }
    }
  
    // Displays next requested element
    function displayNext() {
      quiz.fadeOut(function() {
        $('#question').remove();
  
        if (questionCounter < questions.length) {
          var nextQuestion = createQuestionElement(questionCounter);
          quiz.append(nextQuestion).fadeIn();
          if (selections[questionCounter] !== undefined) {
            $('input[value="' + selections[questionCounter] + '"]').prop('checked', true);
          }
  
          // Controls display of 'prev' button
          if (questionCounter === 1) {
            $('#prev').show();
          } else if (questionCounter === 0) {
            $('#prev').hide();
            $('#next').show();
          }
        } else {
          var resultDiv = displayResult();
          quiz.append(resultDiv).fadeIn();
          $('#next').hide();
          $('#prev').hide();
          $('#start').show();
        }
      });
    }
  
    // Displays the selected disabilities
    function displayResult() {
      var resultDiv = $('<div>', {
        id: 'result'
      });
  
      var disabilities = [];
      for (var i = 0; i < selections.length; i++) {
        if (selections[i] !== null) {
          disabilities.push(selections[i]);
        }
      }
  
      if (disabilities.length > 0) {
        var title = $('<h2>').text('Suspected Learning Disabilities:');
        resultDiv.append(title);
  
        var disabilitiesList = $('<ul>');
        for (var i = 0; i < disabilities.length; i++) {
          var listItem = $('<li>').text(disabilities[i]);
          disabilitiesList.append(listItem);
        }
        resultDiv.append(disabilitiesList);
      } else {
        var message = $('<p>').text('No specific learning disabilities identified.');
        resultDiv.append(message);
      }
  
      return resultDiv;
    }
  })();
  