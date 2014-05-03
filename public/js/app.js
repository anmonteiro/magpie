var MNA = {};


MNA.View = (function( window, document, undefined ) {
  
  function getNewsItem( item ) {
    return '<a href="' + item.url + '" class="list-group-item">' +
      '  <h4 class="list-group-item-heading">' + item.title + '</h4>' +
      '  <p class="list-group-item-text">' + item.src + '</p>' +
      '</a>';
  };

  function renderNews( items ) {
    var result = '';

    items.forEach(function( element ) {
      result += getNewsItem( element );
    });

    return result;
  }

  return {
    renderItem : getNewsItem,
    renderNewsList : renderNews
  };

})( window, document, undefined );

