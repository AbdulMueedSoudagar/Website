(function() {
  var questions = [{
    question: "Enjoys socialization with friends",
    choices: ["1", "2", "3", "4", "5"]
  }, {
    question: "Enjoys physical activity",
    choices: ["1", "2", "3", "4", "5"]
  }, {
    question: "Marches to the beat of a different drummer in living and learning",
    choices: ["1", "2", "3", "4", "5"]
  }, {
    question: "Easily understands charts, maps, and other graphic organizers",
    choices: ["1", "2", "3", "4", "5"]
  }, {
    question: "Enjoys listening to rhymes, songs, music, Qirat, stories, and jokes",
    choices: ["1", "2", "3", "4", "5"]
  }, {
    question: "Writes and spells better than average for their age",
    choices: ["1", "2", "3", "4", "5"]
  }, {
    question: "Enjoys doing jigsaws, mazes, and visual puzzles",
    choices: ["1", "2", "3", "4", "5"]
  }, {
    question: "Enjoys playing with pet animals, birds and watching animal videos, movies, pictures, etc",
    choices: ["1", "2", "3", "4", "5"]
  },
  {
    question: "Always prefers group sports to solo sports",
    choices: ["1", "2", "3", "4", "5"]
  },
  {
    question: "Works well in computer games.",
    choices: ["1", "2", "3", "4", "5"]
  },
  {
  question: "Shows fine-motor coordination in activities like building models, finger painting, etc",
  choices: ["1", "2", "3", "4", "5"]
},
{
    question: "Enjoys reading books.",
choices: ["1", "2", "3", "4", "5"]
},
{
question: "Loves painting, drawing, photography, and craft projects",
choices: ["1", "2", "3", "4", "5"]
},{
question: "Easily remembers songs, melodies, and their tones",
choices: ["1", "2", "3", "4", "5"]
},
{
question: "Prefers learning, studying, and and playing alone rather than with others.",
choices: ["1", "2", "3", "4", "5"]
},
{
question: "Enjoys visiting zoos, aquariums, hill stations, waterfalls, etc.",
choices: ["1", "2", "3", "4", "5"]
}];

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
    if (isNaN(selections[questionCounter])) {
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
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }

  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }

  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $('#question').remove();

      if (questionCounter < questions.length) {
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
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

  // Computes the percentages and displays the result
  function displayResult() {
    var resultDiv = $('<div>', {
      id: 'result'
    });

    var ratings = {
      Interpersonal: 0,
      BodilyKinesthetic: 0,
      Intrapersonal: 0,
      VisualSpatial: 0,
      MusicalRhythmic: 0,
      VerbalLinguistic: 0,
      MathematicalLogical: 0,
      Naturalistic: 0
    };

    var total = selections.length;

    for (var i = 0; i < total; i++) {
      var choice = selections[i];
      var category = Object.keys(ratings)[i % 8];
      ratings[category] += choice;
    }

    var percentages = {};
    var highestPercentage = 0;
    var lowestPercentage = Infinity;

    for (var category in ratings) {
      var rating = ratings[category];
      var percentage = (rating / total) * 100;
      percentages[category] = percentage;

      if (percentage > highestPercentage) {
        highestPercentage = percentage;
      }

      if (percentage < lowestPercentage) {
        lowestPercentage = percentage;
      }
    }

    for (var category in percentages) {
      var rating = ratings[category];
      var percentage = (rating / total) * 100;
      var listItem = $('<li>').text(category + ": " + rating + "/" + total + " X 100 = " + percentage.toFixed(2) + "%");
      resultDiv.append(listItem);
    }

    var dominanceLevels = [];
    for (var category in percentages) {
      if (percentages[category] === highestPercentage) {
        dominanceLevels.push(category);
      }
    }

    var dominanceLevel = dominanceLevels.join(", ");
    var dominanceLevelElement = $('<p>').text("Highest Dominance: " + dominanceLevel);
    resultDiv.append(dominanceLevelElement);

    var moderateDominance = [];
    for (var category in percentages) {
      if (percentages[category] > 0 && percentages[category] < highestPercentage) {
        moderateDominance.push(category);
      }
    }

    if (moderateDominance.length > 0) {
      var moderateDominanceElement = $('<p>').text("Moderate Dominance: " + moderateDominance.join(", "));
      resultDiv.append(moderateDominanceElement);
    }

    var weakDominance = [];
    for (var category in percentages) {
      if (percentages[category] === lowestPercentage) {
        weakDominance.push(category);
      }
    }

    var weakDominanceElement = $('<p>').text("Weak Dominance: " + weakDominance.join(", "));
    resultDiv.append(weakDominanceElement);

    return resultDiv;
  }
})();
