/* global describe, it */

(function () {
  'use strict';

  describe('Form Check', function () {
    describe('#isPositiveInteger()', function () {
      it('Normal positive integers', function () {
      	window.__testOnly__.isPositiveInteger_("123").should.equal(true);
      	window.__testOnly__.isPositiveInteger_("123456789999999999999999990").should.equal(true);
      });
      it('Should return false when have leading zeros', function() {
      	window.__testOnly__.isPositiveInteger_("0123").should.equal(false);
      	window.__testOnly__.isPositiveInteger_("09999999999999999999999").should.equal(false);
      });
      it('Should return false when not positive', function() {
      	window.__testOnly__.isPositiveInteger_("0").should.equal(false);
      	window.__testOnly__.isPositiveInteger_("-999").should.equal(false);
      });
      it('Should return false when not decimal numbers', function() {
      	window.__testOnly__.isPositiveInteger_("0xaa").should.equal(false);
      	window.__testOnly__.isPositiveInteger_("123a").should.equal(false);
      	window.__testOnly__.isPositiveInteger_("a123").should.equal(false);
      	window.__testOnly__.isPositiveInteger_("a").should.equal(false);
      	window.__testOnly__.isPositiveInteger_("+0").should.equal(false);
      	window.__testOnly__.isPositiveInteger_("-0").should.equal(false);
      });
      it('Should return false when not integers', function() {
      	window.__testOnly__.isPositiveInteger_("123.0").should.equal(false);
      	window.__testOnly__.isPositiveInteger_(".123").should.equal(false);
      });
    });
	describe('#isNumber()', function() {
	  it('Normal numbers', function() {
	  	window.__testOnly__.isNumber_("123").should.equal(true);
	  	window.__testOnly__.isNumber_("123456789999999999990").should.equal(true);
	  	window.__testOnly__.isNumber_("0123").should.equal(true);
	  	window.__testOnly__.isNumber_("0").should.equal(true);
	  	window.__testOnly__.isNumber_("0.123").should.equal(true);
	  	window.__testOnly__.isNumber_("123.0").should.equal(true);
	  	window.__testOnly__.isNumber_("123.").should.equal(true);
	  	window.__testOnly__.isNumber_(".123").should.equal(true);
	  	window.__testOnly__.isNumber_("123456789999999999990.0123456789999999").should.equal(true);
	  });
	  it('Should return true when signed', function() {
	  	window.__testOnly__.isNumber_("+0").should.equal(true);
	  	window.__testOnly__.isNumber_("-0").should.equal(true);
	  	window.__testOnly__.isNumber_("-0.123").should.equal(true);
	  	window.__testOnly__.isNumber_("+0.123").should.equal(true);
	  	window.__testOnly__.isNumber_("-123").should.equal(true);
	  	window.__testOnly__.isNumber_("+123").should.equal(true);
	  });
	  it('Should return false when not numbers', function() {
	  	window.__testOnly__.isNumber_("123a").should.equal(false);
	  	window.__testOnly__.isNumber_("a123").should.equal(false);
	  	window.__testOnly__.isNumber_("+").should.equal(false);
	  	window.__testOnly__.isNumber_("-").should.equal(false);
	  });
	});
	describe('#formCheck()', function() {
	  it('Legal inputs', function() {
	  	window.__testOnly__.formCheck_("12", "123", "0.678", "0").should.equal(true);
	  	window.__testOnly__.formCheck_("4", "0.001", "0.001", "1").should.equal(true);
	  	window.__testOnly__.formCheck_("50", "200.000000000", "0.999", "0").should.equal(true);
	  });
	  it('Should return false when one of the values is not a number', function() {
	  	window.__testOnly__.formCheck_("12a", "123", "0.678", "0").should.equal(false);
	  	window.__testOnly__.formCheck_("12", "123a", "0.678", "0").should.equal(false);
	  	window.__testOnly__.formCheck_("12", "123", "0.678a", "0").should.equal(false);
	  	window.__testOnly__.formCheck_("12", "123", "0.678", "0a").should.equal(false);
	  	window.__testOnly__.formCheck_("12", "123", "0.678", "1a").should.equal(false);
	  });
	  it('Should return false when grid size isn\'t a positive integer', function() {
	  	window.__testOnly__.formCheck_("0", "123", "0.678", "0").should.equal(false);
	  	window.__testOnly__.formCheck_("-1", "123", "0.678", "1").should.equal(false);
	  	window.__testOnly__.formCheck_("+0", "123", "0.678", "0").should.equal(false);
	  	window.__testOnly__.formCheck_(".123", "123", "0.678", "1").should.equal(false);
	  });
	  it('Should return false when one of the values is out of range', function() {
	  	window.__testOnly__.formCheck_("51", "123", "0.678", "0").should.equal(false);
	  	window.__testOnly__.formCheck_("3", "123", "0.678", "0").should.equal(false);
	  	window.__testOnly__.formCheck_("12", "0.000001", "0.678", "0").should.equal(false);
	  	window.__testOnly__.formCheck_("12", "201", "0.678", "1").should.equal(false);
	  	window.__testOnly__.formCheck_("12", "123", "0", "1").should.equal(false);
	  	window.__testOnly__.formCheck_("12", "123", "1.0", "0").should.equal(false);
	  	window.__testOnly__.formCheck_("12", "123", "0.678", "2").should.equal(false);
	  });
	});
  });
  describe('Game rules', function() {
  	describe('#judge()', function() {
  	  window.__testOnly__.setHeight(5);
  	  window.__testOnly__.setWidth(5);
  	  it('Become alive when exactly 3 neighbor cells are alive', function() {
  	  	window.__testOnly__.setRuleSet(0);
  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(0, 2, true);
  	  	window.__testOnly__.setShowMapElem(1, 2, true);
  	  	window.__testOnly__.setShowMapElem(2, 0, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(true);

  	  	window.__testOnly__.setRuleSet(1);
  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(1, 1, true);
  	  	window.__testOnly__.setShowMapElem(1, 2, true);
  	  	window.__testOnly__.setShowMapElem(3, 3, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(true);
  	  });
   	  it('Stay when exactly 2 neighbor cells are alive', function() {
  	  	window.__testOnly__.setRuleSet(0);
  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(0, 2, true);
  	  	window.__testOnly__.setShowMapElem(2, 0, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(false);

  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(0, 2, true);
  	  	window.__testOnly__.setShowMapElem(2, 0, true);
  	  	window.__testOnly__.setShowMapElem(2, 2, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(true);

  	  	window.__testOnly__.setRuleSet(1);
  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(1, 1, true);
  	  	window.__testOnly__.setShowMapElem(3, 3, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(false);

  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(1, 1, true);
  	  	window.__testOnly__.setShowMapElem(3, 3, true);
  	  	window.__testOnly__.setShowMapElem(2, 2, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(true);
  	  });
  	  it('Otherwise dead', function() {
  	  	window.__testOnly__.setRuleSet(0);
  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(0, 2, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(false);

  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(0, 2, true);
  	  	window.__testOnly__.setShowMapElem(2, 2, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(false);

  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(2, 0, true);
  	  	window.__testOnly__.setShowMapElem(2, 1, true);
  	  	window.__testOnly__.setShowMapElem(2, 3, true);
  	  	window.__testOnly__.setShowMapElem(4, 2, true);
  	  	window.__testOnly__.setShowMapElem(2, 2, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(false);

		window.__testOnly__.setRuleSet(1);
  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(1, 1, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(false);

  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(3, 3, true);
  	  	window.__testOnly__.setShowMapElem(2, 2, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(false);

  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setShowMapElem(1, 1, true);
  	  	window.__testOnly__.setShowMapElem(2, 1, true);
  	  	window.__testOnly__.setShowMapElem(2, 3, true);
  	  	window.__testOnly__.setShowMapElem(3, 3, true);
  	  	window.__testOnly__.setShowMapElem(2, 2, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(false);
  	  });
	  it('Should not be alive on walls', function() {
  	  	window.__testOnly__.setRuleSet(0);
  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setBlockMapElem(2, 2, true);
  	  	window.__testOnly__.setShowMapElem(0, 2, true);
  	  	window.__testOnly__.setShowMapElem(1, 2, true);
  	  	window.__testOnly__.setShowMapElem(2, 0, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(false);

  	  	window.__testOnly__.setRuleSet(1);
  	  	window.__testOnly__.initArrays_();
  	  	window.__testOnly__.setBlockMapElem(2, 2, true);
  	  	window.__testOnly__.setShowMapElem(1, 1, true);
  	  	window.__testOnly__.setShowMapElem(1, 2, true);
  	  	window.__testOnly__.setShowMapElem(3, 3, true);
  	  	window.__testOnly__.judge_(2, 2).should.equal(false);
	  });
  	});
    describe('#nextStep()', function() {
  	  window.__testOnly__.setHeight(10);
  	  window.__testOnly__.setWidth(10);
      it('Conway\'s, Glitter', function() {
      	var data = [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
      	window.__testOnly__.setRuleSet(1);
      	window.__testOnly__.initArrays_();
      	for (var idx in data) {
      		window.__testOnly__.setShowMapElem(data[idx][0], data[idx][1], true);
      	}
      	for (var k = 0; k < 44; k++) {
      		window.__testOnly__.nextStep_();
      	}
      	for (idx in data) {
      		window.__testOnly__.getShowMapElem(data[idx][0] + 1, data[idx][1] + 1).should.equal(true);
      		window.__testOnly__.setShowMapElem(data[idx][0] + 1, data[idx][1] + 1, false);
      	}
      	for (var x = 0; x < 10; x++) {
      	  for (var y = 0; y < 10; y++) {
      	    window.__testOnly__.getShowMapElem(x, y).should.equal(false);
      	  }
      	}
      });
      it('Extended Von Neumann, periodic', function() {
      	var data = [[0, 0], [0, 1], [0, 2], [0, 3], [1, 1], [1, 2]];
      	window.__testOnly__.setRuleSet(0);
      	window.__testOnly__.initArrays_();
      	for (var idx in data) {
      		window.__testOnly__.setShowMapElem(data[idx][0], data[idx][1], true);
      	}
      	for (var k = 0; k < 62; k++) {
      		window.__testOnly__.nextStep_();
      	}
      	for (idx in data) {
      		window.__testOnly__.getShowMapElem(1 - data[idx][0], data[idx][1]).should.equal(true);
      		window.__testOnly__.setShowMapElem(1 - data[idx][0], data[idx][1], false);
      	}
      	for (var x = 0; x < 10; x++) {
      	  for (var y = 0; y < 10; y++) {
      	    window.__testOnly__.getShowMapElem(x, y).should.equal(false);
      	  }
      	}
      });
    });
  });
})();
