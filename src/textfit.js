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

TextFit.prototype.getWidth = function(elem) {
  return elem.getBoundingClientRect().width;
}

TextFit.prototype.getHeight = function(elem) {
  return elem.getBoundingClientRect().height;
}

TextFit.prototype.isLargerThanParent = function (elem) {
  return this.getWidth(elem) > this.getWidth(elem.parentElement) ||
    this.getHeight(elem) > this.getHeight(elem.parentElement);
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
