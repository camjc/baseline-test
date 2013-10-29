/*global console, document, window */
(function () {
// Wrap in self executing function so it doesn't pollute global.
    'use strict';
    var BaselineTest = {
            settings: {
                // Define what tags to run it on, and what baseline we are trying to achieve.
                tags: ['h1', 'h2', 'h3', 'p', 'small', 'li', 'tc', 'span'],
                desiredBaseline: 16,
                container: 'body'
            },
            init: function () {
                var i = 0,
                    tags = this.settings.tags,
                    current;
                while (i < tags.length) {
                    current = this.utilSelector(this.settings.container, tags[i]);
                    if (current !== undefined) {
                        // Can only read inline element's height if they
                        // are inline blocks, this converts them.
                        if (window.getComputedStyle(current).display === 'inline') {
                            current.style.display = 'inline-block';
                        }
                        this.displayOutput(tags[i], current);
                    }
                    i += 1;
                }
            },
            utilPx: function (input) {
                //Remove the units and then convert to a number from a string.
                return parseInt(input.replace('px', ''), 10);
            },
            utilCheck: function (input) {
                if (input %
                        this.settings.desiredBaseline === 0 || input === 0) {
                    return true;
                }
                return false;
            },
            utilSelector: function (container, tag) {
                return document.querySelectorAll(container + " " + tag)[0];
                //Should change to .body.querySelector() for efficiency
            },
            utilPropose: function (check, propose, current, unit) {
                var proposeHeightPx,
                    proposeHeightMult;
                if (check === true) {
                    return 'already correct';
                }
                proposeHeightPx = ((Math.ceil(propose /
                    BaselineTest.settings.desiredBaseline)) *
                    BaselineTest.settings.desiredBaseline);
                proposeHeightMult = proposeHeightPx / BaselineTest.calcFontSize(current);
                if ((proposeHeightMult * 1000) === Math.ceil(proposeHeightMult * 1000)) {
                    // If Multiplier height isnt crazy use that.
                    // (max of three decimal places)
                    return proposeHeightMult + unit;
                }
                return proposeHeightPx + 'px (ideally change the font-size first)';
            },
            calcHeight: function (current) {
                var height;
                height = current.getBoundingClientRect().bottom -
                    current.getBoundingClientRect().top -
                    this.calcPaddingTop(current) -
                    this.calcPaddingBottom(current);
                return height;
            },
            calcFontSize: function (current) {
                return this.utilPx(window.getComputedStyle(current).fontSize);
            },
            calcLineHeight: function (current) {
                var lineheight;
                lineheight = window.getComputedStyle(current).lineHeight;
                if (lineheight !== 'normal') {
                    return lineheight;
                }
                lineheight = this.calcHeight(current) / this.calcFontSize(current);
                return lineheight;
            },
            calcPaddingTop: function (current) {
                return this.utilPx(window.getComputedStyle(current).paddingTop) +
                    this.utilPx(window.getComputedStyle(current).borderTopWidth);
            },
            calcPaddingBottom: function (current) {
                return this.utilPx(window.getComputedStyle(current).paddingBottom) +
                    this.utilPx(window.getComputedStyle(current).borderBottomWidth);
            },
            calcMarginTop: function (current) {
                return this.utilPx(window.getComputedStyle(current).marginTop);
            },
            calcMarginBottom: function (current) {
                return this.utilPx(window.getComputedStyle(current).marginBottom);
            },
            checkBaseline: function (current) {
                if (this.calcHeight(current) %
                        this.settings.desiredBaseline === 0) {
                    current.style.backgroundColor = 'blue';
                    return true;
                }
                current.style.backgroundColor = 'red';
                return false;
            },
            paddingTop: function (current) {
                return this.utilCheck(this.calcPaddingTop(current));
            },
            paddingBottom: function (current) {
                return this.utilCheck(this.calcPaddingBottom(current));
            },
            checkPadding: function (current) {
                if (this.paddingTop(current) && this.paddingBottom(current)) {
                    current.style.fontWeight = '500';
                    return true;
                }
                if (this.paddingTop(current) || this.paddingBottom(current)) {
                    current.style.fontWeight = '700';
                } else {
                    current.style.fontWeight = '900';
                }
                return false;
            },
            marginTop: function (current) {
                return this.utilCheck(this.calcMarginTop(current));
            },
            marginBottom: function (current) {
                return this.utilCheck(this.calcPaddingBottom(current));
            },
            checkMargin: function (current) {
                if (this.marginTop(current) && this.marginBottom(current)) {
                    current.style.opacity = '1';
                    return true;
                }
                if (this.marginTop(current) || this.marginBottom(current)) {
                    current.style.opacity = '0.75';
                } else {
                    current.style.opacity = '0.5';
                }
                return false;
            },
            proposeHeight: function (current) {
                return this.utilPropose(this.checkBaseline(current), this.calcHeight(current), current, '');
            },
            proposePaddingTop: function (current) {
                return this.utilPropose(this.checkPadding(current), this.calcPaddingTop(current), current, 'em');
            },
            proposePaddingBottom: function (current) {
                return this.utilPropose(this.checkPadding(current), this.calcPaddingBottom(current), current, 'em');
            },
            consoleOutput: function (tag, current) {
                console.log(tag + ' is ' + this.calcHeight(current) + 'px high' +
                    ', I propose a line height of ' + this.proposeHeight(current) +
                    ', and its font-size is ' + this.calcFontSize(current) + 'px ' +
                    ', and the line-height is ' + this.calcLineHeight(current) +
                    ', a match is ' + this.checkBaseline(current) +
                    ', and a margin match is ' + this.checkMargin(current) +
                    ', and a padding match is ' + this.checkPadding(current) +
                    ', recommended top-padding is ' + this.proposePaddingTop(current));
            },
            displayOutput: function (tag, current) {
                this.checkBaseline(current);
                this.checkMargin(current);
                console.log(tag + ' recommended top-padding is ' + this.proposePaddingTop(current));
                console.log(tag + ' recommended line-height is ' + this.proposeHeight(current));
                console.log(tag + ' recommended bottom-padding is ' + this.proposePaddingBottom(current));
            }
        };
    BaselineTest.init(); // Call itself
}());

// Handle padding and borders as one element.