var MNA = {};

var config = {
  endpoint : 'http://localhost:3000/sites/'
};

(function( window, document, $ ) {
  
  function getNewsItem( item ) {
    return '<a href="' + item.url + '" class="list-group-item">' +
      '  <h4 class="list-group-item-heading">' + item.title + '</h4>' +
      '  <p class="list-group-item-text">' + item.src + '</p>' +
      '</a>';
  };

  function getNewsList( items ) {
    var result = '';

    items.forEach(function( element ) {
      result += getNewsItem( element );
    });

    return result;
  };

  MNA.View = {
    renderItem : getNewsItem,
    renderNewsList : getNewsList
  };

  MNA.Controller = (function() {
    var render = function render( id ) {
      $.getJSON( config.endpoint + id )
        .done(function( data ) {
          $( '#' + id + '> .list-group' ).html( MNA.View.renderNewsList( data ) );
        });
    }
    return {render:render};
  })();

  function render() {
    // reset cenas aqui
    MNA.Controller.render('hn');
  };

  MNA.render = render;

  $( document ).ready(function() {
    MNA.render();
  });
})( window, document, jQuery );

