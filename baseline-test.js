/*global console, document, window */
(function () {
// Wrap in self executing function so it doesn't pollute global.
    'use strict';
    var BaselineTest = {
            settings: {
                // Define what tags to run it on, and what baseline we are trying to achieve.
                tags: ['h1', 'h2', 'h3', 'p', 'small', 'li', 'tc', 'span'],
                desiredBaseline: 11
            },
            init: function () {
                var i = 0,
                    tags = this.settings.tags,
                    current;
                while (i < tags.length) {
                    current = this.getCurrent(tags[i]);
                    if (current === undefined) {
                        return null;
                    }
                    this.displayOutput(tags[i], current);
                    i += 1;
                }
            },
            getCurrent: function (tag) {
                return document.getElementsByTagName(tag)[0];
            },
            calcHeight: function (current) {
                var height;
                // Best option if browser supports getBoundingClientRect
                if (current.getBoundingClientRect().top !== null) {
                    height = current.getBoundingClientRect().bottom -
                        current.getBoundingClientRect().top;
                    return height;
                }
                height = current.offsetHeight; // Fallback option
                return height;
            },
            calcFontSize: function (current) {
                return window.getComputedStyle(current).fontSize.replace('px', '');
            },
            calcLineHeight: function (current) {
                var lineheight,
                    height,
                    fontsize;
                lineheight = window.getComputedStyle(current).lineHeight;
                if (lineheight !== 'normal') {
                    return lineheight;
                }
                height = this.calcHeight(current);
                fontsize = this.calcFontSize(current).replace('px', '');
                lineheight = height / fontsize;
                return lineheight;
            },
            calcMarginTop: function (current) {
                return window.getComputedStyle(current).marginTop.replace('px', '');
            },
            calcMarginBottom: function (current) {
                return window.getComputedStyle(current).marginBottom.replace('px', '');
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
            marginTop: function (current) {
                if (this.calcMarginTop(current) %
                        this.settings.desiredBaseline === 0 || this.calcMarginTop(current) === 0) {
                    return true;
                }
                return false;
            },
            marginBottom: function (current) {
                if (this.calcMarginBottom(current) %
                        this.settings.desiredBaseline === 0 || this.calcMarginBottom(current) === 0) {
                    return true;
                }
                return false;
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
                var proposeHeightPx,
                    proposeHeightEm;
                if (this.checkBaseline(current) === true) {
                    return "already correct";
                }
                proposeHeightPx = ((Math.ceil(this.calcHeight(current) /
                    this.settings.desiredBaseline)) *
                    this.settings.desiredBaseline);
                proposeHeightEm = proposeHeightPx / this.calcFontSize(current);
                if ((proposeHeightEm * 1000) === Math.ceil(proposeHeightEm * 1000)) {
                    // If EM height isnt crazy use that.
                    // (max of three decimal places EM value)
                    return proposeHeightEm + 'em';
                }
                return proposeHeightPx + 'px';
            },
            consoleOutput: function (tag, current) {
                console.log(tag + ' is ' + this.calcHeight(current) + 'px high' +
                    ', I propose a line height of ' + this.proposeHeight(current) +
                    ', and its font-size is ' + this.calcFontSize(current) + 'px ' +
                    ', and the line-height is ' + this.calcLineHeight(current) +
                    ', a match is ' + this.checkBaseline(current) +
                    ', and its top margin is ' + this.calcMarginTop(current) +
                    ', and a margin match is ' + this.checkMargin(current));
            },
            displayOutput: function (tag, current) {
                this.checkBaseline(current);
                this.checkMargin(current);
                console.log(tag + ' recommended line-height is ' + this.proposeHeight(current));
            }
        };
    BaselineTest.init(); // Call itself
}());

// Report everything as EMs
