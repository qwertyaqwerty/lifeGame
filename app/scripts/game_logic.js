/**
 * Created by Yue Dayu on 2015/9/27.
 */

(function () {
  'use strict';

  var size = 5;
  var width = Math.floor(($(window).width() - 10) / size);
  var height = Math.floor(($(window).height() - 45) / size);
  var showMap;
  var calculationMap;
  var blockMap;
  var canvas, context;
  var playControl, btnApply, btnRandom;
  var lineColor = '#ddd',
    lineWidth = 2;
  var lifeColor = '#000',
    deadColor = '#fff',
    blockColor = "#999";
  var burn = 3,
    stay = 2;
  var ruleSet = 0;
  var time = 100;
  var lifeRate = 0.15;
  var isStart = false;
  var gameLoop;

  var isTest = false;
  /* test-code */
  isTest = true;
  /* end-test-code */

  /*
   * judge
   */
  var judge = function (x, y) {
    if (blockMap[x][y]) {
      return false;
    }
    var sum = 0;
    if (ruleSet === 0) { //Extended von Neumann Neighborhood
      for (var d = 1; d <= 2; d++) {
        sum +=   showMap[(x + d) % height][y] + showMap[(x - d + height) % height][y]
               + showMap[x][(y + d) % width] + showMap[x][(y - d + width) % width]; 
      }
    } else if (ruleSet === 1) {  //Moore neighborhood
      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          sum += showMap[(x + dx + height) % height][(y + dy + width) % width];
        }
      }
    }  

    if (sum === burn) {
      return true;
    } else if (sum != stay) {
      return false;
    } else {
      return showMap[x][y];
    }
  };

  /*
   * next step
   */
  var nextStep = function () {
    for (var x = 0; x < height; x++) {
      for (var y = 0; y < width; y++) {
        calculationMap[x][y] = judge(x, y);
      }
    }
    var temp = false;
    for (x = 0; x < height; x++) {
      for (y = 0; y < width; y++) {
        temp = showMap[x][y];
        showMap[x][y] = calculationMap[x][y];
        calculationMap[x][y] = temp;
      }
    }
  };

  /*
   * random map
   */
  var randomMap = function () {
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        if (blockMap[i][j]) {
          continue;
        }
        showMap[i][j] = Boolean(Math.random() < lifeRate);
        calculationMap[i][j] = !showMap[i][j];
      }
    }
    render();
    start();
  };

  /*
   * draw a single cell
   */
  var drawSingleCell = function (x, y, color) {
    context.fillStyle = color;
    context.beginPath();
    context.rect(y * size + lineWidth / 2, x * size + lineWidth / 2, size - lineWidth, size - lineWidth);
    context.fill();
  }

  /*
   * draw cells
   */
  var render = function () {
    context.save();
    context.fillStyle = lifeColor;
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        context.beginPath();
        context.rect(j * size + lineWidth / 2, i * size + lineWidth / 2, size - lineWidth, size - lineWidth);
        if (showMap[i][j] === calculationMap[i][j]) continue;
        if (showMap[i][j]) {
          context.fill();
        }
      }
    }
    context.fillStyle = deadColor;
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        context.beginPath();
        context.rect(j * size + lineWidth / 2, i * size + lineWidth / 2, size - lineWidth, size - lineWidth);
        if (showMap[i][j] === calculationMap[i][j]) continue;
        if (!showMap[i][j]) {
          context.fill();
        }
      }
    }
    context.restore();
  };

  /*
   * draw the lines.
   */
  var drawGrid = function () {
    context.save();
    context.beginPath();
    context.lineWidth = lineWidth;
    context.strokeStyle = lineColor;
    for (var i = 0; i <= width; i++) {
      context.moveTo(i * size, 0);
      context.lineTo(i * size, height * size);
    }
    for (i = 0; i <= height; i++) {
      context.moveTo(0, i * size);
      context.lineTo(width * size, i * size);
    }
    context.stroke();
    context.restore();
  };

  /*
   * start!
   */
  var start = function () {
    isStart = true;
    playControl.css("background-position", "53% -2%");
    gameLoop = setInterval(function () {
      nextStep();
      render();
    }, time);
  };

  /*
   * Stop!
   */
  var stop = function () {
    if (isStart) {
      clearInterval(gameLoop);
    }
    isStart = false;
    playControl.css("background-position", "103% -2%");
  };

  /*
   * alert when not unit test
   */
  var alertWhenNotTest = function(msg) {
    if (!isTest) {
      alert(msg);
    } else {
      console.log(msg);      
    }
  };
  /*
   * form check functions
   */
  var isPositiveInteger = function(str) {
    return /^[1-9]\d*$/.test(str);
  };

  var isNumber = function(str) {
    return !isNaN(Number(str));
  };

  var formCheck = function(gridSize, frameRate, lifeRate, ruleSet) {
    if (!isPositiveInteger(gridSize) || Number(gridSize) < 4 || Number(gridSize) > 50) {
      alertWhenNotTest("Grid size must be an integer between 4 and 50");
      return false;
    };
    if (!isNumber(frameRate) || Number(frameRate) < 1e-3 || Number(frameRate) > 200) {
      alertWhenNotTest("Frame rate must be an positive number less than 200");
      return false;
    };
    if (!isNumber(lifeRate) || Number(lifeRate) < 1e-3 || Number(lifeRate) >= 1) {
      alertWhenNotTest("Life rate must be between 0 and 1");
      return false;
    };
    if (ruleSet !== "0" && ruleSet !== "1") {
      return false;
    };
    return true;
  };

  /*
   * init arrays
   */
  var initArrays = function() {
    showMap = new Array(height);
    calculationMap = new Array(height);
    blockMap = new Array(height);
    for (var i = 0; i < height; i++) {
      showMap[i] = new Array(width);
      calculationMap[i] = new Array(width);
      blockMap[i] = new Array(width);
      for (var j = 0; j < width; j++) {
        showMap[i][j] = false;
        calculationMap[i][j] = false;
        blockMap[i][j] = false;
      }
    }
  }
  /*
   * Restart
   */
  var restart = function() {
    stop();

    width = Math.floor(($(window).width()) / size);
    height = Math.floor(($(window).height() - 45) / size);

    canvas.width = width * size;
    canvas.height = height * size;

    initArrays();

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
  };

  /*
   * param: (id, width, height, size), (id, width) or (id)
   */
  var init = function () {
    if (arguments.length === 2) {
      width = height = arguments[1];
    } else if (arguments.length >= 3) {
      width = arguments[1];
      height = arguments[2];
      size = arguments[3];
    }

    var id = arguments[0];
    var container = document.getElementById(arguments[0]);
    canvas = document.getElementById("show-canvas");
    context = canvas.getContext('2d');

    playControl = $("#play-control");
    btnApply = $("#apply-changes");
    btnRandom = $("#random-map");

    restart();

    playControl.click(function(event) {
      if (isStart)
      {
        stop();
      } else {
        start();
      }
    });

    btnApply.click(function(event) {
      var gridSize = $("#grid-size").val();
      var frameRate = $("#frame-rate").val();
      var initPos = $("#init-pos").val();
      var rule = $("input[name='rule-set']:checked").val();
      if (formCheck(gridSize, frameRate, initPos, rule)) {
        size = Number(gridSize);
        time = Math.floor(1000 / Number(frameRate));
        lifeRate = Number(initPos);
        ruleSet = Number(rule);
        restart();
      };
    });

    btnRandom.click(function(event) {
      stop();
      randomMap();
    });

    $(window).keypress(function(event) {
      if (event.which == 13) {
        if (isStart) {
          stop();
        } else {
          start();
        }
      } else if (event.which == 32) {
        if (!isStart) {
          for (var x = 0; x < height; x++) {
            for (var y = 0; y < width; y++) {
              showMap[x][y] = false;
              calculationMap[x][y] = true;
            }
          }
          render();
          for (x = 0; x < height; x++) {
            for (y = 0; y < width; y++) {
              calculationMap[x][y] = false;
            }
          }
        }
      }
    });
    document.oncontextmenu = function() {return false;};
    $(canvas).mousedown(function(event) {
      if (!isStart) {
        var y = Math.floor((event.offsetX) / size);
        var x = Math.floor((event.offsetY) / size);
        if (event.button === 0)
        {
          calculationMap[x][y] = showMap[x][y];
          showMap[x][y] = !showMap[x][y];
          render();
        } else if (event.button === 2) {
          blockMap[x][y] = !blockMap[x][y];
          showMap[x][y] = false;
          calculationMap[x][y] = false;
          if (blockMap[x][y]) {
            drawSingleCell(x, y, blockColor);
          } else {
            drawSingleCell(x, y, deadColor);
          }
        }
      }
      return false;
    });
    $(window).resize(function(event) {
      restart();
    });
  };

  window.lifeGame = init;

  /* test-code */
  window.__testOnly__ = {
    judge_: judge,
    nextStep_: nextStep,
    isPositiveInteger_: isPositiveInteger,
    isNumber_: isNumber,
    formCheck_: formCheck,
    initArrays_: initArrays,
    getHeight: function() {
      return height;
    },
    setHeight: function(val) {
      height = val;
    },
    getWidth: function() {
      return width;
    },
    setWidth: function(val) {
      width = val;
    },
    getSize: function() {
      return size;
    },
    setSize: function(val) {
      size = val;
    },
    getLifeRate: function() {
      return lifeRate;
    },
    setLifeRate: function(val) {
      lifeRate = val;
    },
    getRuleSet: function() {
      return ruleSet;
    },
    setRuleSet: function(val) {
      ruleSet = val;
    },
    getShowMapElem: function(x, y) {
      return showMap[x][y];
    },
    setShowMapElem: function(x, y, val) {
      showMap[x][y] = val;
    },
    getCalculationMapElem: function(x, y) {
      return calculationMap[x][y];
    },
    setCalculationMapElem: function(x, y) {
      calculationMap[x][y] = val;
    },
    getBlockMapElem: function(x, y) {
      return blockMap[x][y];
    },
    setBlockMapElem: function(x, y, val) {
      blockMap[x][y] = val;
    }
  };
  /* end-test-code */

})();
