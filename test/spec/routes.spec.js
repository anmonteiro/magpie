describe('Routes', function() {
jasmine.getFixtures().fixturesPath = '../../../../';
  describe('Clicking tabs', function() {
    var cb;

  	beforeEach(function() {
  	  loadFixtures( 'index.html' );
  	  jasmine.clock().install();
  	});

  	afterEach(function() {
  	  jasmine.clock().install();
  	});

  	it('should handle accordingly', function( done ) {
	  var group = [{
	    "url" : "http://www.computerworld.com/s/article/print/9248070/SanDisk_announces_4TB_SSD_hopes_for_8TB_next_year",
	    "src" : " (computerworld.com) ",
	    "title" : "SanDisk announces 4TB SSD, hopes for 8TB next year."
	  }, {
	    "url" : "http://www.reuters.com/article/2014/05/03/us-microsoft-gates-idUSBREA410YS20140503",
	    "src" : " (reuters.com) ",
	    "title" : "Bill Gates on track to own no Microsoft stock in four years"
	  }, {
	    "url" : "http://www.slate.com/articles/technology/future_tense/2014/05/fcc_chairman_tom_wheeler_s_lame_excuses_for_his_net_neutrality_proposal.html",
	 	 "src" : " (slate.com) ",
	    "title" : "FCC Chairman Tom Wheeler’s lame excuses for his net neutrality proposal."
	  }];
  	  
  	  spyOn($, 'getJSON').and.callFake(function( req ) {
  	  	var d = $.Deferred();

  	  	d.resolve( group );  // use d.reject( data ) to fake reject calls
  	  	
  	  	return d.promise();
  	  });

  	  MNA.init();
  	  expect( $.getJSON ).toHaveBeenCalled();
  	  jasmine.clock().tick( 501 );

  	  expect( $('#hn div.list-group') ).toExist();
  	  done();
  	});
  });
});

