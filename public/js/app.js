var MNA = {};

(function( window, document, $ ) {
  
  var config = {
    endpoint : 'http://localhost:3000/sites/'
  };

  var utils = {
    store: function ( namespace, data ) {
      if (arguments.length > 1) {
        return localStorage.setItem( namespace, JSON.stringify( data ) );
      }
      else {
        var store = localStorage.getItem( namespace );
        return ( store && JSON.parse( store ) ) || [];
      }
    }
  };

  MNA.View = (function() {
    var spinner = [
      '<div id="circularG" class="center-block spinner">',
      '  <div id="circularG_1" class="circularG">',
      '  </div>',
      '  <div id="circularG_2" class="circularG">',
      '  </div>',
      '  <div id="circularG_3" class="circularG">',
      '  </div>',
      '  <div id="circularG_4" class="circularG">',
      '  </div>',
      '  <div id="circularG_5" class="circularG">',
      '  </div>',
      '  <div id="circularG_6" class="circularG">',
      '  </div>',
      '  <div id="circularG_7" class="circularG">',
      '  </div>',
      '  <div id="circularG_8" class="circularG">',
      '  </div>',
      '</div>'
    ].join( '' );

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

    function getTabID( tabNo ) {
      var id = this.$tabs.eq( tabNo ).find( 'a' ).attr('href');

      return id.indexOf( '#' ) === -1 ?
        id :
        id.slice( id.indexOf( '#' ) + 1 );
    }

    function toggleBusy( $elem, data ) {
      toAppend = data || spinner;

      if( data ) {
        $elem.children().toggleClass('fade');
        setTimeout(function() {
          $elem.empty().append( toAppend );
        }, 500);
      }
      else {
        $elem.empty().append( toAppend );
        setTimeout(function() {
          $elem.children().toggleClass('fade');
        }, 500);
      }
    }

     return {
      getNewsList : getNewsList,
      getTabID  : getTabID.bind( MNA ),
      toggleBusy : toggleBusy
    };
  })();

  MNA.Controller = (function() {
    function bindEvents() {
      var self = this;
      this.$tabs.on( 'click', function( evt ) {
        var id = $( evt.target ).attr('href');
          $tabContent = $( id ),
          len = $tabContent.find( '.list-group-item' ).length;
        if ( len === 0 ) {
          self.Controller.renderNews( id.slice(1) );
        }
      });
    };

    var renderNews = function renderNews( id ) {
      if ( !id ) {
        id = this.View.getTabID( 0 );
      }

      $.getJSON( config.endpoint + id )
        .done(function( data ) {
          $( '#' + id + '> .list-group' ).html( MNA.View.getNewsList( data ) );

          // save fresh data locally
          //utils.store( 'mna.' + id , data );
        });
    };
    return {
      renderNews : renderNews.bind( MNA ),
      bindEvents : bindEvents.bind( MNA )
    };
  })();

  function init() {
    this.$tabs = $( '.nav.nav-tabs > li' );
    this.Controller.bindEvents();

    this.Controller.renderNews();
  };

  MNA.init = init;


  $( document ).ready(function() {
    MNA.init();
  });
})( window, document, jQuery );
