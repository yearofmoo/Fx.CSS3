if(Fx.CSS3.supported) {
  Element.Properties.tween = {
    set: function(options){
      this.get('tween').cancel().setOptions(options);
      return this;
    },

    get: function(){
      var tween = this.retrieve('tween');
      if (!tween){
        tween = new Fx.CSS3(this, {link: 'cancel'});
        this.store('tween', tween);
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
      var morph = this.retrieve('morph');
      if (!morph){
        morph = new Fx.CSS3(this, {link: 'cancel'});
        this.store('morph', morph);
      }
      return morph;
    }
  };

  Element.implement({

    tween : function(css, value) {
      $(this).get('tween').start(css, value);
    },

    morph : function(values) {
      $(this).get('morph').start(values);
    }

  });
}
