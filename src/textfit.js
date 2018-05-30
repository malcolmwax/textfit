function TextFit(options) {
  this.selector = options.selector;
  this.textElements = this.selector ? document.querySelectorAll(this.selector) : [];
  this.fitMode = options.fitMode === 'horizontal' ? 'horizontal' : 'vertical';
  this.fontSize = options.fontSize || '1em';
}

TextFit.fit = function(options) {
  var fitInstance = new TextFit(options);
  fitInstance.initStyles();
  fitInstance.resizeElements();
  fitInstance.observeElements();
}

TextFit.prototype.initStyles = function() {
  var self = this;
  this.textElements.forEach(function(elem) {
    elem.style['white-space'] = self.fitMode === 'horizontal' ? 'nowrap' : 'normal';
    // Set Display style to inline block to ensure element is able to overlay parent width
    elem.style['display'] = self.fitMode === "horizontal" ? "inline-block" : "initial";
    elem.style['font-size'] = self.fontSize;
  });
}

TextFit.prototype.resizeElements = function() {
  var self = this;
  this.textElements.forEach(function(elem) {
    self.resize(elem);
  });
}

TextFit.prototype.observeElements = function() {
  var self = this;
  this.textElements.forEach(function(elem) {
    self.observe(elem);
  });
}

TextFit.prototype.getWidth = function(elem, isParent) {
  var style = window.getComputedStyle(elem);
  var width = elem.getBoundingClientRect().width;
  var pLeft = parseInt(style.paddingLeft);
  var pRight = parseInt(style.paddingRight);
  var mLeft = isParent ? 0 : parseInt(style.marginLeft);
  var mRight = isParent ? 0 : parseInt(style.marginRight);
  var bLeft = parseInt(style.borderLeftWidth);
  var bRight = parseInt(style.borderRightWidth);
  return width - pLeft - pRight + mLeft + mRight - bLeft - bRight;
}

TextFit.prototype.getHeight = function(elem, isParent) {
  var style = window.getComputedStyle(elem);
  var width = elem.getBoundingClientRect().height;
  var pTop = parseInt(style.paddingTop);
  var pBottom = parseInt(style.paddingBottom);
  var mTop = isParent ? 0 : parseInt(style.marginTop);
  var mBottom = isParent ? 0 : parseInt(style.marginBottom);
  var bTop = parseInt(style.borderTopWidth);
  var bBottom = parseInt(style.borderBottomWidth);
  return width - pTop - pBottom + mTop + mBottom - bTop - bBottom;
}

TextFit.prototype.isLargerThanParent = function (elem) {
  return this.getWidth(elem, false) > this.getWidth(elem.parentElement, true) ||
    this.getHeight(elem, false) > this.getHeight(elem.parentElement, true);
}

TextFit.prototype.getFontSize = function(elem) {
  return parseFloat(document.defaultView.getComputedStyle(elem, null).fontSize);
}

TextFit.prototype.resize = function(elem) {
  elem.style['font-size'] = this.fontSize;
  if (!this.isLargerThanParent(elem)) {
    return;
  }
  var left = 0;
  var right = this.getFontSize(elem);

  while(left <= right) {
    var mid = left + Math.floor((right - left) / 2);
    elem.style.fontSize = mid + 'px';
    if (this.isLargerThanParent(elem)) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  if (this.isLargerThanParent(elem)) {
    elem.style.fontSize = right + 'px';
  }
}

TextFit.prototype.observe = function(elem) {
  var self = this;
  var resizeObserver = new ResizeObserver(debounce(function () {
    self.resize(elem);
  }, 100));
  resizeObserver.observe(elem);
}
