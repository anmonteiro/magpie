var MNA = {};

var templateStore = {
  global : {
    spinner : [
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
    ].join( '' ),
  },
  news : {
    list : [
      '<div class="list-group">',
      '</div>'
    ].join( '' ),
    item : [
      '<a class="list-group-item">',
      '  <h4 class="list-group-item-heading"></h4>',
      '  <p class="list-group-item-text"></p>',
      '</a>'
    ].join( '' ),

  }
};

(function( window, document, $ ) {
  
  var config = {
    endpoint : 'http://mna.herokuapp.com/sites/'
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

    var spinner = $( templateStore.global.spinner );
    
    function getNewsItem( item ) {
      var $newsElem = $( templateStore.news.item );

      $newsElem.prop( 'href', item.url );
      $newsElem.find( '.list-group-item-heading' ).text( item.title );
      $newsElem.find( '.list-group-item-text' ).text( item.src );

      return $newsElem;
    };

    function getNewsList( items ) {
      var result = $( templateStore.news.list );

      items.forEach(function( element ) {
        result.append( getNewsItem( element ) );
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
      var toAppend = data || spinner;

      if ( typeof $elem === 'string' ) {
        $elem = $( $elem );
      }

      if( data ) {
        $elem.children().toggleClass('fade');
        setTimeout(function() {
          $elem.find( '.spinner' ).remove();
          $elem.prepend( toAppend );
        }, 500);
      }
      else {
        $elem.prepend( toAppend );
        setTimeout(function() {
          $elem.children().toggleClass('fade');
        }, 500);
      }
    }

     return {
      getNewsItem : getNewsItem,
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

    function renderNews( id ) {
      var self = this;

      if ( !id ) {
        id = this.View.getTabID( 0 );
      }

      this.View.toggleBusy( '#' + id );

      $.getJSON( config.endpoint + id )
        .done(function( data ) {
          self.View.toggleBusy( '#' + id, MNA.View.getNewsList( data ) );
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

