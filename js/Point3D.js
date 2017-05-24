/*--Point3D(x, y, z, id, color, options)-------------------
A class representing a 3D point on the chart.
Parameters:
  x.................(Number) x coordinate.
  y.................(Number) y coordinate.
  z.................(Number) z coordinate.
  id................(String) id/name of point, used for label.
  colour............(String) describes the point background,
                    any valid css accepted.
  options...........(Object) of options for the point.
Properties:
  x,y,z.............(Number) Each containing their respective
                    coordinate.
  xCoord,yCoord,
  zCoord............(Number) Real coordinates on the 3D scene.
  id................(String) ID of the point.
  colour............(String) colour of the point.
  selectEnabled.....(Boolean) Whether selection is allowed.
  selected..........(Boolean) Whether the point is currently selected.
  ele...............(String) HTML for the point element.
  options...........(Object) Full options object for the point.
  tooltipEnabled....(Boolean) Whether the tooltip is enabled.
  tooltip...........(String) HTML for the point's tooltip.
  actor.............(CSS3DSprite) ThreeJS sprite for the point.
Functions:
  showTooltip(), hideTooltip(), select(),
  getNext(), getData(), removeSelf(),
  setCoordinates()
---------------------------------------------------------*/
function Point3D(x, y, z, id, colour, options){
  var defaults = {
    axisNames: {
      x: 'x',
      y: 'y',
      z: 'z'
    },
    selection: {
      enabled: true,
      selectedClass: 'point-selected'
    },
    points: {
      enabled: true,
      style: undefined,
      cssClass: 'point-marker',
      content: undefined
    },
    labels: {
      enabled: true,
      style: undefined,
      cssClass: 'point-label'
    },
    tooltip: {
      enabled: true,
      style: undefined,
      cssClass: 'point-tooltip'
    }
  };
  //console.log(defaults);
  //console.log(x, y, z);

  this.x      = x,
  this.xCoord = x;

  this.y      = y,
  this.yCoord = y;

  this.z      = z,
  this.zCoord = z;

  this.id             = id,
  this.selected       = false,
  this.colour         = colour ? colour : 'radial-gradient(rgba(255, 255, 255, 1) 5%, rgba(70,150,255,.7) 20%, rgba(50,100,255,0) 60%)',
  this.options        = jQuery.extend(true, defaults, options),
  this.selectEnabled  = this.options.selection.enabled,
  this.tooltipEnabled = this.options.tooltip.enabled;
  this.actor          = undefined;
  this.ele            = $('<div></div>');

  this.ele.addClass('point');
  this.ele.attr('id', 'point#'+this.id);
  $(this.ele).data({point: this});
};

Point3D.prototype.updateElement = function(){
  this.ele.empty();

  if (this.options.points.enabled){
    point = $('<div></div>');

    if (this.options.points.style){
      point.css(this.options.points.style);
    };
    point.css({background: this.colour});
    point.addClass(this.options.points.cssClass);

    if (this.options.points.content){
      point.append(this.options.points.content);
    } else {
      this.ele.append(point);
    };
  };

  if (this.options.labels.enabled){
    label = $('<div>' + this.id + '</div>');

    if (this.options.labels.style){
      label.css(this.options.labels.style);
    };
    label.addClass(this.options.labels.cssClass);

    this.ele.append(label);
  };

  this.tooltip = $('<div><div>' +
    this.options.axisNames.x + ': ' + this.x + '</div><div>' +
    this.options.axisNames.y + ': ' + this.y + '</div><div>' +
    this.options.axisNames.z + ': ' + this.z + '</div></div>'
  );

  if (this.options.tooltip.style){
    this.tooltip.css(this.options.tooltip.style);
  };
  this.tooltip.addClass(this.options.tooltip.cssClass + ' chart-tooltip');

  if (this.selected){
    this.ele.removeClass(this.options.selection.selectedClass);
    this.selected = false;
    this.hideTooltip();
  };
};

/*--showTooltip()------------------------------------------
Adds the tooltip to the element, if enabled.
---------------------------------------------------------*/
Point3D.prototype.showTooltip = function(){
  if (this.tooltipEnabled){
    this.tooltip.appendTo(this.ele);
  };
};

/*--showTooltip()------------------------------------------
Removes the tooltip from the element, if enabled.
---------------------------------------------------------*/
Point3D.prototype.hideTooltip = function(){
  if (this.tooltipEnabled){
    this.tooltip.remove();
  };
};

/*--showTooltip()------------------------------------------
Toggles the selected property to true/false, if enabled, adds
the selected class to the point and shows/hides the tooltip.
---------------------------------------------------------*/
Point3D.prototype.selectPoint = function(){
  if (this.selectEnabled){
    if (this.selected){
      this.ele.removeClass(this.options.selection.selectedClass);
      this.selected = false;
      this.hideTooltip();
    } else {
      this.ele.addClass(this.options.selection.selectedClass);
      this.selected = true;
      this.showTooltip();
    };
  };
};

/*--removeSelf()-------------------------------------------
Removes the point's element from the DOM.
---------------------------------------------------------*/
Point3D.prototype.removeSelf = function(){
  this.ele.remove();
};

/*--setCoordinates(x, y, z)--------------------------------
Sets the real coordinates of the point for the 3D space.
Parameters:
  x.................(Number) x coordinate.
  y.................(Number) y coordinate.
  z.................(Number) z coordinate.
---------------------------------------------------------*/
Point3D.prototype.setCoordinates = function(x, y, z){
  this.xCoord = x;
  this.yCoord = y;
  this.zCoord = z;
};

/*--createActor()-----------------------------------------
Creates the CSS3DSprite to add to the ThreeJS scene and
stores it in the Point's actor property.
Returns:
  (CSS3DSprite) 3D object to add to scene.
---------------------------------------------------------*/
Point3D.prototype.createActor = function(){
  //console.log(this.ele);
  this.actor = new THREE.CSS3DSprite(document.createElement('div'));
  this.actor.element = this.ele[0];
  //console.log(this.actor);
  this.actor.position.x = this.xCoord;
  this.actor.position.y = this.yCoord;
  this.actor.position.z = this.zCoord;

  return(this.actor);
};
