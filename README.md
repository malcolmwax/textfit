# Textfit

This project was invented to help Outfit designers create fitted text in templates easier with two modes: Vertical fit and Horizontal fit.

## Installation and setup

In Outfit template, include following scripts

```html
<script src="https://outfit-assets-production.s3-accelerate.amazonaws.com/scripts/textfit.min.js" type="text/javascript"></script>
```

## Usage

Just call `TextFit.fit()` and define the params `selector`, `fitMode` (by default it is `vertical`) and `fontSize`.

You can create multiple instances of Textfit to apply textfit to any HTML element.

```javascript
TextFit.fit({
    selector: '.fitted-text1',
    fitMode: 'horizontal',
    fontSize: '100px'
  });

TextFit.fit({
  selector: '.fitted-text2',
  fitMode: 'vertical',
  fontSize: '100px'
});
```
