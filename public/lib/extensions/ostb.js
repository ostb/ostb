

(function(){
  var ostb = function(converter) {
    return [
      {
        type: 'lang',
        regex: '(\\^\\?.*?\n)(\\(\\w+\\)\\s*)+',
        replace: function(match, question, three) {
          console.log(match, question, three);
          return '<h6>' + question + '</h6>\n'
            + '<form>'
            + '<input type="radio" name="q1" label="' + three + '">' + three + '</input>'
            + '</form>';
        }
      }
    ];
  };
  if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.ostb = ostb; }
  // Server-side export
  if (typeof module !== 'undefined') {
    module.exports = ostb;
  }
}());


// '((^\\?.*?\\n)(\\(\\w+\\)\\s*)+)'

// /((^\?.*?\n)(\(\w+\)\s*)+)/gm