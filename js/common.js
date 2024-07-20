const html = document.querySelector("html");
const main = document.querySelector("main");
const body = document.querySelector('body');
const scrim = document.getElementById("scrim");

const home_button = document.getElementById("home_button");
const tuning_button = document.getElementById("tuning_button");
const rawdata_button = document.getElementById("rawdata_button");

const home_content = document.getElementById("home_content");
const tuning_content = document.getElementById("tuning_content");
const rawdata_content = document.getElementById("rawdata_content");
const menu_btn = document.getElementById("menu_btn");
const sidebar_menu_btn = document.getElementById("sidebar_menu_btn");
const sidebar_buttons = document.getElementById("sidebar_lists").getElementsByClassName("button");

const bluetooth = new Bluetooth();

var meta = document.createElement('meta');
meta.name = 'theme-color';

function getCssProperty(name) {
  const root = document.documentElement;
  const rootStyle = getComputedStyle(root);
  return rootStyle.getPropertyValue(name);
}

function sidebar_toggle() {
  main.classList.toggle("collapse");
  scrim.classList.toggle("collapse");
}

function main_collapse_check() {
  if (main.className == 'collapse') {
    menu_btn.innerHTML = "<span class='material-symbols-rounded'>menu</span>";
    sidebar_menu_btn.innerHTML = "<span class='material-symbols-rounded'>menu_open</span>";
  }
  else {
    menu_btn.innerHTML = "<span class='material-symbols-rounded'>menu_open</span>";
    sidebar_menu_btn.innerHTML = "";
  }
}

// 창 크기에 따라 사이드바 접기 결정
var width = window.innerWidth;
main.classList.toggle("collapse", width <= 960);
scrim.classList.toggle("collapse", width <= 960);

main_collapse_check();

window.onresize = function () {
  width = window.innerWidth;
  main.classList.toggle("collapse", width <= 960);
  scrim.classList.toggle("collapse", width <= 960);

  main_collapse_check();
}

var isMobile = /Mobi/i.test(window.navigator.userAgent);
if (isMobile) {
  /*
  // 아래 소스코드 원본 https://stackoverflow.com/questions/11371550/change-hover-css-properties-with-javascript
  var css = 'button:hover{background-color: transparent}';
  var style = document.createElement('style');
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  }
  else {
    style.appendChild(document.createTextNode(css));
  }
  document.getElementsByTagName('head')[0].appendChild(style);
  */
}

function updateForDarkModeChange() {
  var str = getCssProperty("--md-sys-color-primary").slice(-6);

  var arr = new Array(3);
  for (var i = 0; i < 3; i++) {
    arr[i] = String(parseInt(str.substring(i * 2, i * 2 + 2), 16) + ' ');
  }
  var css = ':root {--md-sys-color-primary-rgb: ' + arr[0] + arr[1] + arr[2] + ';}';
  console.log(css);

  var style = document.createElement('style');
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  }
  else {
    style.appendChild(document.createTextNode(css));
  }
  document.getElementsByTagName('head')[0].appendChild(style);
}
updateForDarkModeChange();
const darkModeMeidaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMeidaQuery.addListener(updateForDarkModeChange);

// ↓ https://velog.io/@dkahsem27/기능-모바일에서-hover를-터치-효과로-바꾸기
document.addEventListener("touchstart", function () { }, true);

// 그림자를 클릭했을 때
scrim.onclick = () => {
  if (scrim.className != "collapse") {
    sidebar_toggle();
  }
}

// 메뉴 버튼을 클릭했을 때
menu_btn.onclick = () => {
  sidebar_toggle();

  if (window.innerWidth > 960) {
    main_collapse_check();
  }
}
sidebar_menu_btn.onclick = () => {
  sidebar_toggle();
  menu_btn.innerHTML = "<span class='material-symbols-rounded'>menu</span>";
}

// 사이드바 버튼을 클릭했을 때
home_button.onclick = () => {
  home_button.className = 'selected';
  tuning_button.className = '';
  rawdata_button.className = '';
  
  home_content.style.visibility = 'visible';
  home_content.style.height = 'auto';
  tuning_content.style.visibility = 'hidden';
  tuning_content.style.height = 0;
  rawdata_content.style.visibility = 'hidden';
  rawdata_content.style.height = 0;
  
  if (scrim.className != "collapse" && matchMedia("screen and (max-width:960px)").matches) {
    sidebar_toggle();
  }
}
tuning_button.onclick = () => {
  home_button.className = '';
  tuning_button.className = 'selected';
  rawdata_button.className = '';

  home_content.style.visibility = 'hidden';
  home_content.style.height = 0;
  tuning_content.style.visibility = 'visible';
  tuning_content.style.height = 'auto';
  rawdata_content.style.visibility = 'hidden';
  rawdata_content.style.height = 0;
  
  if (scrim.className != "collapse" && matchMedia("screen and (max-width:960px)").matches) {
    sidebar_toggle();
  }
}
rawdata_button.onclick = () => {
  home_button.className = '';
  tuning_button.className = '';
  rawdata_button.className = 'selected';

  home_content.style.visibility = 'hidden';
  home_content.style.height = 0;
  tuning_content.style.visibility = 'hidden';
  tuning_content.style.height = 0;
  rawdata_content.style.visibility = 'visible';
  rawdata_content.style.height = 'auto';
  
  if (scrim.className != "collapse" && matchMedia("screen and (max-width:960px)").matches) {
    sidebar_toggle();
  }
}

// 블루투스 버튼을 클릭했을 때
blue_search_btn.onclick = () => {
  bluetooth.connect();
};
blue_dis_btn.onclick = () => {
  bluetooth.disconnect();
};

setInterval(() => {
  if(isConnected == true){
    bluetooth.send([0x02, 0x01, 0x00, 0xff, 0x03]);
  }
}, 500);