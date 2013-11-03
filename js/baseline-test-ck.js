var BaselineTest=function(){"use strict";return{settings:{tags:["h1","h2","h3","p","small","ul li","ol li","tc","span","img","a","cite","code"],desiredBaseline:16,container:"body",proposals:[],proposalTags:[]},init:function(){var e=0,t=this.settings.tags;while(e<t.length){this.check(t[e]);e+=1}},check:function(e){var t=this.utilSelector(this.settings.container,e);if(t===undefined)return"That element doesn't exist on this page.";window.getComputedStyle(t).display==="inline"&&(t.style.display="inline-block");return this.displayOutput(e,t)},utilPx:function(e){return parseInt(e.replace("px",""),10)},utilCheck:function(e){return e%this.settings.desiredBaseline===0||e===0?!0:!1},utilSelector:function(e,t){return document.querySelectorAll(e+" "+t)[0]},utilPropose:function(e,t,n,r,i){var s,o;if(e===!0)return!0;s=Math.ceil(t/this.settings.desiredBaseline)*this.settings.desiredBaseline;if(i){s-=i;s<=0&&(s+=this.calcFontSize(n))}o=s/this.calcFontSize(n);return o*1e3===Math.ceil(o*1e3)?o+r:s+"px /* ideally change the font-size first */"},utilPrinter:function(e,t,n){var r,i,s=this.settings.proposalTags;if(n!==!0){r=e+"{ "+t+": "+n+";}";i=t+": "+n+";}";if(s.indexOf(e)!==-1){this.settings.proposals[s.indexOf(e)]=this.settings.proposals[s.indexOf(e)].replace("}"," ");this.settings.proposals[s.indexOf(e)]+=i;return r}this.settings.proposalTags.push(e);this.settings.proposals.push(r);return r}},calcPosition:function(e){return window.getComputedStyle(e).position!=="static"?"static":!0},calcHeight:function(e){var t;t=e.getBoundingClientRect().bottom-e.getBoundingClientRect().top-this.calcPaddingTop(e)-this.calcPaddingBottom(e)-this.calcBorderTop(e)-this.calcBorderBottom(e);return t},calcFontSize:function(e){return this.utilPx(window.getComputedStyle(e).fontSize)},calcLineHeight:function(e){var t=window.getComputedStyle(e).lineHeight;if(t!=="normal")return t;t=this.calcHeight(e)/this.calcFontSize(e);return t},calcBorderTop:function(e){return this.utilPx(window.getComputedStyle(e).borderTopWidth)},calcBorderBottom:function(e){return this.utilPx(window.getComputedStyle(e).borderBottomWidth)},calcPaddingTop:function(e){return this.utilPx(window.getComputedStyle(e).paddingTop)},calcPaddingBottom:function(e){return this.utilPx(window.getComputedStyle(e).paddingBottom)},calcMarginTop:function(e){return this.utilPx(window.getComputedStyle(e).marginTop)},calcMarginBottom:function(e){return this.utilPx(window.getComputedStyle(e).marginBottom)},checkBaseline:function(e){if(this.calcHeight(e)%this.settings.desiredBaseline===0)return!0;e.style.color="Salmon";return!1},paddingTop:function(e){return this.utilCheck(this.calcPaddingTop(e)+this.calcBorderTop(e))},paddingBottom:function(e){return this.utilCheck(this.calcPaddingBottom(e)+this.calcBorderBottom(e))},checkPadding:function(e){if(this.paddingTop(e)&&this.paddingBottom(e))return!0;this.paddingTop(e)||this.paddingBottom(e)?e.style.backgroundColor="DarkOrange":e.style.backgroundColor="Crimson";return!1},marginTop:function(e){return this.utilCheck(this.calcMarginTop(e))},marginBottom:function(e){return this.utilCheck(this.calcMarginBottom(e))},checkMargin:function(e){if(this.marginTop(e)&&this.marginBottom(e))return!0;this.marginTop(e)||this.marginBottom(e)?e.style.opacity="0.5":e.style.opacity="0.25";return!1},proposeHeight:function(e){return this.utilPropose(this.checkBaseline(e),this.calcHeight(e),e,"",0)},proposePaddingTop:function(e){return this.utilPropose(this.checkPadding(e),this.calcPaddingTop(e),e,"em",this.calcBorderTop(e))},proposePaddingBottom:function(e){return this.utilPropose(this.checkPadding(e),this.calcPaddingBottom(e),e,"em",this.calcBorderBottom(e))},proposeMarginTop:function(e){return this.utilPropose(this.checkMargin(e),this.calcMarginTop(e),e,"em",0)},proposeMarginBottom:function(e){return this.utilPropose(this.checkMargin(e),this.calcMarginBottom(e),e,"em",0)},consoleOutput:function(e,t){console.log(e+" is "+this.calcHeight(t)+"px high"+", I propose a line height of "+this.proposeHeight(t)+", and its font-size is "+this.calcFontSize(t)+"px "+", and the line-height is "+this.calcLineHeight(t)+", a match is "+this.checkBaseline(t)+", and a margin match is "+this.checkMargin(t)+", and a padding match is "+this.checkPadding(t)+", recommended top-padding is "+this.proposePaddingTop(t)+", and the top-border is "+this.calcBorderTop(t))},displayOutput:function(e,t){this.utilPrinter(e,"position",this.calcPosition(t));this.checkBaseline(t);this.checkMargin(t);this.utilPrinter(e,"margin-top",this.proposeMarginTop(t));this.utilPrinter(e,"padding-top",this.proposePaddingTop(t));this.utilPrinter(e,"line-height",this.proposeHeight(t));this.utilPrinter(e,"padding-bottom",this.proposePaddingBottom(t));this.utilPrinter(e,"margin-bottom",this.proposeMarginBottom(t))},displayAllOutput:function(){var e=this.settings.proposals;e.length===0?e="Everything you checked is fine.":e=e.join("<br/><br/>");e='<div id="baseline-display" style="margin: 2em 0; padding: 1em; background: whitesmoke; box-shadow: 0 0 1px gray; ">'+e+"</div>";document.body.insertAdjacentHTML("beforeend",e)}}}();BaselineTest.init();BaselineTest.displayAllOutput();