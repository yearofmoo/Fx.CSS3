if(Fx.CSS3.supported) {
  (function() {

    var instanceKey = 'fx:css3:instance';

    Element.Properties.tween = {
      set: function(options){
        this.get('tween').cancel().setOptions(options);
        return this;
      },

      get: function(){
        var tween = this.retrieve(instanceKey);
        if (!tween){
          tween = new Fx.CSS3(this, {link: 'cancel'});
          this.store(instanceKey, tween);
        }
        return tween;
      }
    };

    Element.Properties.morph = {
      set: function(options){
        this.get('morph').cancel().setOptions(options);
        return this;
      },

      get: function(){
        var morph = this.retrieve(instanceKey);
        if (!morph){
          morph = new Fx.CSS3(this, {link: 'cancel'});
          this.store(instanceKey, morph);
        }
        return morph;
      }
    };

    Element.implement({

      tween : function(css, value) {
        $(this).get('tween').start(css, value);
        return this;
      },

      morph : function(values) {
        $(this).get('morph').start(values);
        return this;
      }

    });

  })();
}
