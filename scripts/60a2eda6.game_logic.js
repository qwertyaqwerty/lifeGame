!function(){"use strict";var a,b,c,d,e,f,g,h,i,j=5,k=Math.floor(($(window).width()-10)/j),l=Math.floor(($(window).height()-45)/j),m="#ddd",n=2,o="#000",p="#fff",q="#999",r=3,s=2,t=0,u=100,v=.15,w=!1,x=!1,y=function(b,d){if(c[b][d])return!1;var e=0;if(0===t)for(var f=1;2>=f;f++)e+=a[(b+f)%l][d]+a[(b-f+l)%l][d]+a[b][(d+f)%k]+a[b][(d-f+k)%k];else if(1===t)for(var g=-1;1>=g;g++)for(var h=-1;1>=h;h++)(0!==g||0!==h)&&(e+=a[(b+g+l)%l][(d+h+k)%k]);return e===r?!0:e!=s?!1:a[b][d]},z=function(){for(var c=0;l>c;c++)for(var d=0;k>d;d++)b[c][d]=y(c,d);var e=!1;for(c=0;l>c;c++)for(d=0;k>d;d++)e=a[c][d],a[c][d]=b[c][d],b[c][d]=e},A=function(){for(var d=0;l>d;d++)for(var e=0;k>e;e++)c[d][e]||(a[d][e]=Boolean(Math.random()<v),b[d][e]=!a[d][e]);C(),E()},B=function(a,b,c){e.fillStyle=c,e.beginPath(),e.rect(b*j+n/2,a*j+n/2,j-n,j-n),e.fill()},C=function(){e.save(),e.fillStyle=o;for(var c=0;l>c;c++)for(var d=0;k>d;d++)e.beginPath(),e.rect(d*j+n/2,c*j+n/2,j-n,j-n),a[c][d]!==b[c][d]&&a[c][d]&&e.fill();e.fillStyle=p;for(var c=0;l>c;c++)for(var d=0;k>d;d++)e.beginPath(),e.rect(d*j+n/2,c*j+n/2,j-n,j-n),a[c][d]!==b[c][d]&&(a[c][d]||e.fill());e.restore()},D=function(){e.save(),e.beginPath(),e.lineWidth=n,e.strokeStyle=m;for(var a=0;k>=a;a++)e.moveTo(a*j,0),e.lineTo(a*j,l*j);for(a=0;l>=a;a++)e.moveTo(0,a*j),e.lineTo(k*j,a*j);e.stroke(),e.restore()},E=function(){w=!0,f.css("background-position","53% -2%"),i=setInterval(function(){z(),C()},u)},F=function(){w&&clearInterval(i),w=!1,f.css("background-position","103% -2%")},G=function(a){x?console.log(a):alert(a)},H=function(a){return/^[1-9]\d*$/.test(a)},I=function(a){return!isNaN(Number(a))},J=function(a,b,c,d){return!H(a)||Number(a)<4||Number(a)>50?(G("Grid size must be an integer between 4 and 50"),!1):!I(b)||Number(b)<.001||Number(b)>200?(G("Frame rate must be an positive number less than 200"),!1):!I(c)||Number(c)<.001||Number(c)>=1?(G("Life rate must be between 0 and 1"),!1):"0"!==d&&"1"!==d?!1:!0},K=function(){a=new Array(l),b=new Array(l),c=new Array(l);for(var d=0;l>d;d++){a[d]=new Array(k),b[d]=new Array(k),c[d]=new Array(k);for(var e=0;k>e;e++)a[d][e]=!1,b[d][e]=!1,c[d][e]=!1}},L=function(){F(),k=Math.floor($(window).width()/j),l=Math.floor(($(window).height()-45)/j),d.width=k*j,d.height=l*j,K(),e.clearRect(0,0,d.width,d.height),D()},M=function(){2===arguments.length?k=l=arguments[1]:arguments.length>=3&&(k=arguments[1],l=arguments[2],j=arguments[3]);arguments[0],document.getElementById(arguments[0]);d=document.getElementById("show-canvas"),e=d.getContext("2d"),f=$("#play-control"),g=$("#apply-changes"),h=$("#random-map"),L(),f.click(function(a){w?F():E()}),g.click(function(a){var b=$("#grid-size").val(),c=$("#frame-rate").val(),d=$("#init-pos").val(),e=$("input[name='rule-set']:checked").val();J(b,c,d,e)&&(j=Number(b),u=Math.floor(1e3/Number(c)),v=Number(d),t=Number(e),L())}),h.click(function(a){F(),A()}),$(window).keypress(function(c){if(13==c.which)w?F():E();else if(32==c.which&&!w){for(var d=0;l>d;d++)for(var e=0;k>e;e++)a[d][e]=!1,b[d][e]=!0;for(C(),d=0;l>d;d++)for(e=0;k>e;e++)b[d][e]=!1}}),document.oncontextmenu=function(){return!1},$(d).mousedown(function(d){if(!w){var e=Math.floor(d.offsetX/j),f=Math.floor(d.offsetY/j);0===d.button?(b[f][e]=a[f][e],a[f][e]=!a[f][e],C()):2===d.button&&(c[f][e]=!c[f][e],a[f][e]=!1,b[f][e]=!1,c[f][e]?B(f,e,q):B(f,e,p))}return!1}),$(window).resize(function(a){L()})};window.lifeGame=M}();