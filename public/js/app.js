var MNA = {};

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
    
    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed
    var renderTemplate = (function(){
      var cache = {};

      return function tmpl(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            tmpl(document.getElementById(str).innerHTML) :

          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
      };
    })();

    var spinner = $( renderTemplate( 'spinner' )( '' ) );

    function getNewsItem( item ) {
      return $( renderTemplate( 'newsItem', {
        item : item
      }));
    };

    function getNewsList( items ) {
      /*var result = $( templateStore.news.list );

      items.forEach(function( element ) {
        result.append( getNewsItem( element ) );
      });

      return result;*/
      $( renderTemplate( 'newsList', {
        items : items
      }));

      return $( renderTemplate( 'newsList', {
        items : items
      }));
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

