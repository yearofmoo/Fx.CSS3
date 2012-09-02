#Fx.CSS3

Fx.CSS3 prodiveds Fx animations using CSS3 transitions as well as various CSS3 properties available to be animated.


## About Fx.Morph/Fx.Tween and Fx.CSS3

CSS3 transitions are a much much better way to handle animations for browsers. With a standard JavaScript library, animations are handled by figuring out the difference between all style values and applying the changes within a loop managed by a timeout. This is too heavy of a solution and, since JavaScript is single-threaded, they will not be able to do much else when your webpage is animating something. CSS3 transitions are handled within the browser and come complete with completion callbacks.

Fx.CSS3 hijacks the Fx.CSS animation library to provide full Fx animation support using CSS3 Transitions.


## How it works

Fx.CSS3 overrides the Element.morph and Element.tween methods to provide this functionality.

For the browsers that do not support CSS3 transitions, the standard Element.tween and Element.morph methods are delegated to standard Fx.Tween and Fx.Morph operations.


## Supported Browsers

The following browsers support CSS3 transitions (and thus Fx.CSS3):
- IE10+
- Firefox 4+
- Google Chrome 4+
- Safari 3+
- Opera 10.5+

All other browsers will just use the standard Fx.Tween and Fx.Morph libraries provided by MooTools


## Requirements

- MooTools-core 1.3+

## Installation

Include the following script into your webpage:

```html
<script type="text/javascript" src="/path/to/MooTools-core.js"></script>
<script type="text/javascript" src="/path/to/Fx.CSS3/Fx.CSS3.js"></script>
```

If you wish to pick and choose which files to use, then include them in this order:

- Source/src/Browser.name.js
- Source/src/Browser.vendorPrefix.js
- Source/src/Browser.vendorStyle.js
- Source/src/Event.transition.js
- Source/src/Fx.CSS3.js
- Source/src/Element.Extras.CSS3.js


## Usage

Very simple, just use it regularly just as you would with Element.morph.

```javascript
//Element.morph
var element = $('...');
element.morph({
   'transform':'rotate(30deg)'
});

//Element.morph with chaining
element.get('morph').start({
   'transform':'rotate(30deg)'
}).chain(function() {
  //...
});

//Element.tween
element.tween('transform','rotate(30deg)');

//Element.tween with chaining
element.get('tween').start('transform','rotate(30deg)').chain(function() {
  //...
});

//Using Fx.CSS3
var options = {};
new Fx.CSS3(element, options).start({
  'transform':'rotate(30deg)'
});

//or using it directly without having to figure who supports what
var fx = Fx.CSS3.createSupportedInstance(element,options); //Fx.CSS3 or Fx.Morph (depending on what the browser supports)
```

## CSS3 Properties

In addition to transitions, Fx.CSS3 also provides support for new CSS3 properties which may or may not require vendor prefixing. Keeping track of these prefix details results in messy code and a lot of branching.

Fx.CSS3 does this for you with the following attributes (which work also work in Fx.Morph as well):
- border-radius
- box-shadow
- text-shadow
- transform

**(the CSS transform property will NOT work with Fx.Morph, only Fx.CSS3)**

So feel free to do some radical animations such as:
```javascript
element.morph({
   'transform':'scale(1.1)',
   'border-radius':20,
   'box-shadow':'#DDCCDD 0 0 20px'
});
```

And the great part is that it's all done with CSS3 Transitions!!!


## CSS3 Properties & Colors

- Be sure to define all your styles beforehand with actual values. The MooTools Fx class doesn't like it when your values are defined as `none`.

- It's best to stick to using Hex and/or RGB colors in your style properties. MooTools doesn't yet support converting color labels to Hex/RGB. Despite Fx.CSS3 using CSS3 transitions (which is where the browser figures out the color difference), older browsers which do not support CSS3 transitions will break when trying to parse color labels.

So do it this way:

```javascript
element.morph({
  'box-shadow':'#dddddd 0 0 5px'
});
```

Or this way

```javascript
element.morph({
  'box-shadow':'rgb(200,200,200) 0 0 5px'
});
```

But NOT this way:

```javascript
element.morph({
  'box-shadow':'silver 0 0 5px'
});
```


## Using a CSS className as a property

Fx.CSS3 also supports classNames as properties for animation:

```javascript
element.morph('.active');
```

Be sure to define the CSS class beforehand as a simple selector (just the class name as the selector):

```css
.active {
  //properties
}
```

This works in both Fx.CSS3 and Fx.CSS. 

(Keep in mind that this will only work with Fx.Morph if the stylesheet is on the same domain).


## More Info + Demos

Be sure to visit this page to get more info:

http://yearofmoo.com/code/Fx.CSS3
