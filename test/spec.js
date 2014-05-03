
'<a href="' + url + '" class="list-group-item active">'
'  <h4 class="list-group-item-heading">' + title + '</h4>'
'  <p class="list-group-item-text">' + src + '</p>'
'</a>'




describe('Render', function() {
  
  describe('One news item', function() {
  	beforeEach(function() {
  	  var item = [ '<a href="http://www.reuters.com/article/2014/05/03/us-microsoft-gates-idUSBREA410YS20140503" class="list-group-item">',
  	    '  <h4 class="list-group-item-heading">Bill Gates on track to own no Microsoft stock in four years</h4>',
  	    '  <p class="list-group-item-text"> (reuters.com) </p>',
  	    '</a>'
  	  ].join( '' );
  	});

    afterEach(function() {
      var item = null;
    });
  });
});