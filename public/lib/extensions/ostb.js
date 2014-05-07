
(function(){
  var ostb = function(converter) {
    // Convert answer text to appropriate ID
    var toId = function(str) {
      var id = str.toLowerCase();
      id = id.replace(/\ /g, '-');
      return id;
    };
    // Creates a seeded random number generator
    var makeRandGen = function(seed) {
      return function() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };
    };
    // Shuffles an array, optionally creates a range first to shuffle
    var shuffle = function(input, seed) {
      if (typeof input === 'number') {
        var arr = [];
        for (var i = 0; i < input; i++) {
          arr.push(i);
        }
        input = arr;
      }
      if (seed) {
        srnd = makeRandGen(seed);
      }
      for (var i = input.length - 1; i >= 0; i--) {
        var r;
        if (seed) { r = Math.floor(srnd() * i); }
        else { r = Math.floor(Math.random() * i); }
        var temp = input[r];
        input[r] = input[i];
        input[i] = temp;
      }
      return input;
    };
    // Process case where answers are on single line
    var horizontal = function(aline, qnum, qlen) {
      var answers = aline.split(' ');
      var rand = shuffle(answers.length, qlen);
      aline = '';
      for (var j = 0; j < rand.length; j++) {
        answers[rand[j]] = answers[rand[j]].slice(1, answers[rand[j]].length - 1);
        aline += '<input class="answer-wide" type="radio" id="' + toId(answers[rand[j]]) + '" name="question-' + qnum + '" />';
        aline += '<label for="' + toId(answers[rand[j]]) + '">' + answers[rand[j]] + '</label>';
      }
      return aline;
    };
    var filter = function(text) {
      var lines = text.split('\n');
      var output = [];
      var qnum = 1;
      // Parse lines of text one at a time
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        // Check if line has question mark for first character
        if (line.trim().match(/(^\?.*)/)) {
          if (lines[i + 1].trim().slice(0, 1) === '(') {
            line = '<p class="question">Q' + qnum + ': ' + line.slice(1) + '</p>';
            output.push(line);
            line = lines[++i];
            // If answers are on a single line
            if (line.trim().match(/(\(.*?\)[ ])+(\(.*?\))/)) {
              line = horizontal(line, qnum, lines[i - 1].length);
            // If answers are on multiple lines
            } else {
              while (line.match(/^\(/)) {
                var answer = line.slice(1, line.length - 1);
                line = '<input class="answer-tall" type="radio" id="' + toId(answer) + '" name="question-' + qnum + '" />';
                line +='<label for="' + toId(answer) + '">' + answer + '</label><br>';
                output.push(line);
                line = lines[++i];
              }
            }
            qnum++;
          }
        }
        output.push(line);
      }
      return output.join('\n');

    };
    return [
      {
        type: 'lang',
        filter: filter
      }
    ];
  };
  if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.ostb = ostb; }
  // Server-side export
  if (typeof module !== 'undefined') { module.exports = ostb; }
}());

// (function(){
//   var ostb = function(converter) {
//     return [
//       {
//         type: 'lang',
//         regex: '(\\?.*?\n)(\\(\\w+\\)\\s*)+',
//         replace: function(match, question, three) {
//           var answers = match.slice(question.length);
//           answers = answers.slice(0, answers.length - 2);
//           answers = answers.split(' ');
//           var str = '<h6>' + question.slice(1) + '</h6>' + '<form>';
//           for (var i = 0; i < answers.length; i++) {
//             answers[i] = answers[i].slice(1, answers[i].length - 1);
//             str += '<input type="radio" name="q1" label="' + answers[i] + '">' + answers[i] + '</input>';
//           }
//           console.log(answers);
//           str += '</form>';
//           return str;
//         }
//       }
//     ];
//   };
//   if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.ostb = ostb; }
//   // Server-side export
//   if (typeof module !== 'undefined') { module.exports = ostb; }
// }());


// '((^\\?.*?\\n)(\\(\\w+\\)\\s*)+)'

// /((^\?.*?\n)(\(\w+\)\s*)+)/gm


