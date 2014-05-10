// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
var micro = (function(){
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

describe('Microtemplating', function() {
  var templ,
    template;

  beforeEach(function() {
    
  });

  afterEach(function() {
    templ = null;
    template = null;
  });

  it('with static templates', function() {
    template = '<div><p>test paragraph</p></div>';

    templ = micro( template );

    expect(function() {
      templ();
    }).toThrow();

    expect(function() {
      // because microtemplating uses the 'with' keyword, we need to pass any
      // javascript type in order to render a static template
      templ('');
    }).not.toThrow();

    expect( templ('') ).toEqual( template );
  });

  it('with "<%= %>" syntax and 1 argument', function() {
    template = '<div><p><%= name %></p></div>'
    templ = micro( template );

    expect( templ({ name : 'test paragraph' }) ).toEqual( '<div><p>test paragraph</p></div>' );

  });

  it('with "<%= %>" syntax and 2 arguments', function() {
    template = '<div><p><%= name %></p></div>'
    templ = micro( template, { name : 'test paragraph' } );

    expect( templ ).toEqual( '<div><p>test paragraph</p></div>' );
  });
});

