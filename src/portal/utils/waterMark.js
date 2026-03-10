// canvas 实现 watermark
function waterMarkDiv(config) {
  //   const args = arguments[0];
  const canvas = document.createElement("canvas");

  canvas.setAttribute("width", config.width);
  canvas.setAttribute("height", config.height);
  const ctx = canvas.getContext("2d");

  ctx.textAlign = config.textAlign;
  ctx.textBaseline = config.textBaseline;
  ctx.font = config.font;
  ctx.fillStyle = config.fillStyle;
  ctx.rotate((Math.PI / 180) * config.rotate);
  // const img = new Image();
  // img.src = 'images/qrcode.png';
  // img.onload = function () {
  //     console.log(img);
  //     ctx.drawImage(img, 0, 0, 100, 100);
  // }
  ctx.fillText(
    config.content,
    parseFloat(config.width) / 4,
    parseFloat(config.height) / 2
  );

  const base64Url = canvas.toDataURL();
  const watermarkDiv = document.createElement("div");
  watermarkDiv.setAttribute(
    "style",
    `
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:${config.zIndex};
        pointer-events:none;
        background-repeat:repeat;
        background-image:url('${base64Url}')`
  );
  return watermarkDiv;
}

export function createWaterMark(config) {
  const setting = {
    container: document.body,
    width: "180px",
    height: "70px",
    textAlign: "center",
    textBaseline: "middle",
    font: "13px Vedana",
    fillStyle: "rgba(184, 184, 184, 0.2)",
    content: "标题",
    rotate: "-20",
    zIndex: 1000,
  };
  config = Object.assign({}, setting, config);
  if(document.getElementById('WaterMarkDivId') !== null){
    config.container.removeChild(document.getElementById("WaterMarkDivId"));
  }
  const div = waterMarkDiv(config);
  div.id = "WaterMarkDivId";
  config.container.style.position = "relative";
  config.container.insertBefore(div, config.container.firstChild);
}

export function removeWaterMark(container) {
  if(document.getElementById('WaterMarkDivId') !== null){
    container.container.removeChild(document.getElementById("WaterMarkDivId"));
  }
}

export function waterMarkBase64Url(config,options) {
  if (options.bodyHtmlWidth == null || options.bodyHtmlWidth<2000){
     options.bodyHtmlWidth = 2000;
  }
  if (options.bodyHtmlHeight == null || options.bodyHtmlHeight<1000){
    options.bodyHtmlHeight = 1000;
  }
  if (options.headHtmlHeight == null || options.headHtmlHeight<1000){
    options.headHtmlHeight = 1000;
  }
  const setting = {
    container: document.body,
    width: options.bodyHtmlWidth*2,
    height: (options.bodyHtmlHeight+options.headHtmlHeight)*2,
    textAlign: "center",
    textBaseline: "middle",
    font: "13px Vedana",
    fillStyle: "rgba(184, 184, 184, 0.2)",
    content: "标题",
    rotate: "-20",
    zIndex: 1000,
  };
  config = Object.assign({}, setting, config);
  //   const args = arguments[0];
  const canvas = document.createElement("canvas");

  canvas.setAttribute("width", config.width);
  canvas.setAttribute("height", config.height);
  const ctx = canvas.getContext("2d");

  ctx.textAlign = config.textAlign;
  ctx.textBaseline = config.textBaseline;
  ctx.font = config.font;
  ctx.fillStyle = config.fillStyle;
  ctx.rotate((Math.PI / 180) * config.rotate);
  // const img = new Image();
  // img.src = 'images/qrcode.png';
  // img.onload = function () {
  //     console.log(img);
  //     ctx.drawImage(img, 0, 0, 100, 100);
  // }
  debugger
  // for(let i = 0;i<config.width;i++){
  //   for(let j = 0;j<config.height;j++){
  //     ctx.fillText(config.content, i*100, j*100)
  //   }
  // }

  var width= 180;
  var height= 70;
  for(let i = 0;i<config.width;i++){
    for(let j = 0;j<config.height;j++){
      ctx.fillText(config.content, i-j, j);
      j=j+height-1;
    }
    i=i+width-1;
  }

  // ctx.fillText(
  //   config.content,
  //   parseFloat(config.width) / 4,
  //   parseFloat(config.height) / 2
  // );

  const base64Url = canvas.toDataURL();


  return base64Url;
}
