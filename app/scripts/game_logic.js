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
   * Restart
   */
  var restart = function() {
    stop();

    width = Math.floor(($("#show").width() + 10) / size);
    height = Math.floor(($(window).height() - 45) / size);

    canvas.width = width * size;
    canvas.height = height * size;

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
      size = Number($("#grid-size").val());
      time = Math.floor(1000 / Number($("#frame-rate").val()));
      lifeRate = Number($("#init-pos").val());
      ruleSet = Number($("input[name='rule-set']:checked").val());
      restart();
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
      console.log(Math.floor((event.offsetX) / size) + " " + Math.floor((event.offsetY) / size));
      console.log(isStart);
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
})();
