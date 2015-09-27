/**
 * Created by Yue Dayu on 2015/9/27.
 */

(function () {
  'use strict';

  var size = 10;
  var width = Math.floor(($(window).width() - 10) / size);
  var height = Math.floor(($(window).height() - 10) / size);
  var showMap;
  var calculationMap;
  var canvas, context;
  var lineColor = '#bbb',
    lineWidth = 2;
  var lifeColor = '#000',
    deadColor = '#fff';
  var burn = 3,
    stay = 2;
  var time = 100;
  var lifeRate = 0.15;
  var isStart = false;
  var gameLoop;

  /*
   * judge
   */
  var judge = function (x, y) {
    var sum = 0;
    for (var dx = -1; dx <= 1; dx++) {
      for (var dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        sum += showMap[(x + dx + height) % height][(y + dy + width) % width];
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
        showMap[i][j] = Boolean(Math.random() < lifeRate);
      }
    }
    render();
    start();
  };

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
  };

  /*
   * start!
   */
  var start = function () {
    isStart = true;
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
    showMap = new Array(height);
    calculationMap = new Array(height);
    for (var i = 0; i < height; i++) {
      showMap[i] = new Array(width);
      calculationMap[i] = new Array(width);
    }
    var container = document.getElementById(arguments[0]);
    canvas = document.createElement('canvas');
    canvas.width = width * size;
    canvas.height = height * size;
    container.appendChild(canvas);
    context = canvas.getContext('2d');
    drawGrid();
    randomMap();
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
          for (var x = 0; x < height; x++) {
            for (var y = 0; y < width; y++) {
              calculationMap[x][y] = false;
            }
          }
        }
      }
    });
    $(canvas).mousedown(function(event) {
      console.log(Math.floor((event.offsetX) / 10) + " " + Math.floor((event.offsetY) / 10));
      if (!isStart) {
        var y = Math.floor((event.offsetX) / 10);
        var x = Math.floor((event.offsetY) / 10);
        calculationMap[x][y] = showMap[x][y];
        showMap[x][y] = !showMap[x][y];
        render();
      }
    });
  };

  window.lifeGame = init;
})();
