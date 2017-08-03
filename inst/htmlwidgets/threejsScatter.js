HTMLWidgets.widget({

  name: 'threejsScatter',

  type: 'output',

  factory: function(ele, width, height){

    var elementId = ele.id;
    var sp;
    var initialized = false;

    return {
      renderValue: function(x){

        if (!initialized){
          $('#'+ele.id).css({background : x.bg})
        }

        var options = JSON.parse(x.data)
        var sp = new ScatterPlot(elementId, options, x.height, x.width, x.depth)

        if (!initialized){
          initialized = true;

          $('#'+ele.id).data('sp', sp);
        };
      },

      resize: function(x){
        return;
      },

      sp: sp
    };
  }
});
