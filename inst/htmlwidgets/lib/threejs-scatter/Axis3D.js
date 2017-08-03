/*--Axis3D(min, max, height, width type, options)----------
A class representing a 3D point on the chart.
Parameters:
  min...............(Number) Minimum value of axis.
  max...............(Number) Maximum value of axis.
  scaleX............(Number) Scaling on the x axis.
  scaleY............(Number) Scaling on the y axis.
  options...........(Object) Options for the axis.
Properties:
  max...............(Number) Maximum value of axis.
  min...............(Number) Minimum value of axis.
  type..............(String) 'x', 'y', or 'z' axis type.
  scaleX............(Number) Scaling on the x axis.
  scaleY............(Number) Scaling on the y axis.
  ticks.............(Array<Number>) Ticks along the axis.
  options...........(Object) Options for the axis.
  actor.............(CSS3D Object) ThreeJS object.
Functions:
---------------------------------------------------------*/
function Axis3D(minX, maxX, minY, maxY, minZ, maxZ,
  scaleX, scaleY, scaleZ, options){
  defaults = {
    colour: 0xbbbbbb,
    opacity: 1,
    linewidth: 2,
    align: 'center',
    labels: {
      enabled: true,
      colour: 'white'
    },
    axis: {
      x: {
        name: 'x',
        reversed: false
      },
      y: {
        name: 'y',
        reversed: false
      },
      z: {
        name: 'z',
        reversed: false
      }
    }
  };

  this.minX    = minX,
  this.maxX    = maxX,
  this.minY    = minY,
  this.maxY    = maxY,
  this.minZ    = minZ,
  this.maxZ    = maxZ,
  this.scaleX  = scaleX,
  this.scaleY  = scaleY,
  this.scaleZ  = scaleZ,
  this.ticks   = {x: [], y: [], z: []};

  this.options = jQuery.extend(true, defaults, options);

  this.actors = {axes: [], ticks: []}
};

/*--findZeros(x)-------------------------------------------
Finds how many zeros there are in a number.
Parameters:
  x.................(Number)
Returns:
  (Number)
---------------------------------------------------------*/
Axis3D.prototype.findZeros = function(x){
  var n   = -1,
      quo = x;

  if (x == 0){
    return(0);
  }

  while (quo != 0){
    n++;
    quo = ~~(quo/10);
    //console.log(rem);
  };

  return(n);
};

/*--genTicks()---------------------------------------------
Generates the tick marks for the axis using the mininum and
maximum values and some heuristics.
Returns:
  (Array<Number>) The ticks for the axis
---------------------------------------------------------*/
Axis3D.prototype.genTicks = function(min, max){
  var mapping = [0, 3, 5, 4, 5, 6, 7, 8, 5, 4];

  var roundedUp   = Number(max.toPrecision(2)),
      roundedDown = Number(min.toPrecision(2)),
      zeros       = Math.max(this.findZeros(roundedUp), this.findZeros(roundedDown));

  //console.log(roundedUp, roundedDown, zeros);

  if (zeros != 0){
    roundedUp = Math.round(roundedUp/(Math.pow(10, zeros)));
    roundedDown = Math.round(roundedDown/(Math.pow(10, zeros)));
  } else {
    roundedUp = Math.ceil(roundedUp);
    roundedDown = Math.floor(roundedDown);
  };
  //console.log('roundedUp', roundedUp);
  //console.log('roundedDown', roundedDown);

  var diff = Math.abs(roundedUp - roundedDown);
  //console.log('diff:' + diff + ' mapping: ' + mapping[diff]);

  //adjusting if the difference is nothing
  if (diff == 0){
    if (max/Math.pow(10, zeros) > roundedUp){
      roundedUp++;
    };
    if (min/Math.pow(10, zeros) < roundedDown){
      roundedDown--;
    };
    diff = Math.abs(roundedUp - roundedDown);
    //console.log('new diff:', diff);
  }

  var a = [];
  for (var i = 0; i < mapping[diff]; i++){
    //console.log(roundedDown, diff, mapping[diff], i);
    //console.log(diff/(mapping[diff]-1));
    //console.log((diff/(mapping[diff]-1)*i));
    a.push(roundedDown + ((diff/(mapping[diff]-1))*i));
    a[i] *= Number(Math.pow(10, zeros));
  }
  console.log(a);

  return(a);
};

/*--genAxis()----------------------------------------------
Generates the full 3D axis object
---------------------------------------------------------*/
Axis3D.prototype.genAxis = function(){
  // Creating the tick marks
  this.ticks.x = this.genTicks(this.minX, this.maxX);
  this.ticks.y = this.genTicks(this.minY, this.maxY);
  this.ticks.z = this.genTicks(this.minZ, this.maxZ);

  //--Creating the plane geometry for X-Z axis-------------
  var tick,
      ele,
      line,
      plane;
  var material = new THREE.LineBasicMaterial({color: this.options.colour, opacity: 0.2, linewidth: .5});
  var geometry = new THREE.Geometry();
  var alignY   = this.options.align == 'center' ? 0 : this.ticks.x[0]*this.scaleX;
  var alignZ   = this.options.align == 'center' ? 0 : this.ticks.z[this.ticks.z.length-1]*this.scaleZ;

  //--Lines in one direction
  for (var i = 0; i < this.ticks.x.length; i++){
    geometry.vertices.push(new THREE.Vector3(this.ticks.x[i]*this.scaleX, alignY, this.ticks.z[this.ticks.z.length-1]*this.scaleZ));
    geometry.vertices.push(new THREE.Vector3(this.ticks.x[i]*this.scaleX, alignY, this.ticks.z[0]*this.scaleZ));
  };
  //--Lines the other direction
  for (var i = 0; i < this.ticks.z.length; i++){
    geometry.vertices.push(new THREE.Vector3(this.ticks.x[this.ticks.x.length-1]*this.scaleX, alignY, this.ticks.z[i]*this.scaleZ));
    geometry.vertices.push(new THREE.Vector3(this.ticks.x[0]*this.scaleX, alignY, this.ticks.z[i]*this.scaleZ));
  };

  for (var i = 0; i < this.ticks.x.length; i++){
    // Creating the tick label sprites
    if (this.options.labels.enabled){
      var tick = new THREE.CSS3DSprite(document.createElement('div'));
      var ele = $('<div>'+this.ticks.x[i]+'</div>');
      ele.css({
        "color": this.options.labels.colour,
        "font-family": "Open-sans, sans-serif",
        "position": 'absolute',
        "display": 'inline',
        "text-align": 'center'
      });
      tick.element = ele[0]
      //console.log(this.actor);
      tick.position.x = this.ticks.x[i]*this.scaleX;
      tick.position.y = alignY-15;
      tick.position.z = alignZ;

      this.actors.ticks.push(tick);
    };
  };

  plane = new THREE.LineSegments(geometry, material);
  this.actors.axes.push(plane);

  geometry = new THREE.Geometry();
  console.log(this.ticks.x[7])
  geometry.vertices.push(new THREE.Vector3(this.ticks.x[0]*this.scaleX, alignY, alignZ));
  geometry.vertices.push(new THREE.Vector3(this.ticks.x[this.ticks.x.length-1]*this.scaleX, alignY, alignZ));
  material = new THREE.LineBasicMaterial({color: this.options.colour, opacity: this.options.opacity, linewidth: this.options.linewidth});
  line = new THREE.LineSegments(geometry, material);
  this.actors.axes.push(line);


  //--Creating the plane geometry for Y-X axis-------------
  var material = new THREE.LineBasicMaterial({color: this.options.colour, opacity: 0.2, linewidth: .5});
  var geometry = new THREE.Geometry();
  var alignZ   = this.options.align == 'center' ? 0 : this.ticks.z[0]*this.scaleZ;
  var alignX   = this.options.align == 'center' ? 0 : this.ticks.x[0]*this.scaleX;

  for (var i = 0; i < this.ticks.y.length; i++){
    geometry.vertices.push(new THREE.Vector3(this.ticks.x[this.ticks.x.length-1]*this.scaleX, this.ticks.y[i]*this.scaleY, alignZ));
    geometry.vertices.push(new THREE.Vector3(this.ticks.x[0]*this.scaleX, this.ticks.y[i]*this.scaleY, alignZ));
  };
  for (var i = 0; i < this.ticks.x.length; i++){
    geometry.vertices.push(new THREE.Vector3(this.ticks.x[i]*this.scaleX, this.ticks.y[this.ticks.y.length-1]*this.scaleY, alignZ));
    geometry.vertices.push(new THREE.Vector3(this.ticks.x[i]*this.scaleX, this.ticks.y[0]*this.scaleY, alignZ));
  };

  for (var i = 0; i < this.ticks.y.length; i++){
    // Creating the tick label sprites
    if (this.options.labels.enabled){
      var tick = new THREE.CSS3DSprite(document.createElement('div'));
      var ele = $('<div>'+this.ticks.y[i]+'</div>');
      ele.css({
        "color": this.options.labels.colour,
        "font-family": "Open-sans, sans-serif",
        "position": 'absolute',
        "display": 'inline',
        "text-align": 'center'
      });
      tick.element = ele[0]
      //console.log(this.actor);
      tick.position.x = alignX+15;
      tick.position.y = this.ticks.y[i]*this.scaleY;
      tick.position.z = alignZ;

      this.actors.ticks.push(tick);
    };
  };

  plane = new THREE.LineSegments(geometry, material);
  this.actors.axes.push(plane);

  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(alignX, this.ticks.y[0]*this.scaleY, alignZ));
  geometry.vertices.push(new THREE.Vector3(alignX, this.ticks.y[this.ticks.y.length-1]*this.scaleY, alignZ));
  material = new THREE.LineBasicMaterial({color: this.options.colour, opacity: this.options.opacity, linewidth: this.options.linewidth});
  line = new THREE.LineSegments(geometry, material);
  this.actors.axes.push(line);

  //--Creating the plane geometry for Z-Y axis-------------
  var material = new THREE.LineBasicMaterial({color: this.options.colour, opacity: 0.2, linewidth: .5});
  var geometry = new THREE.Geometry();
  var alignX   = this.options.align == 'center' ? 0 : this.ticks.z[this.ticks.z.length-1]*this.scaleZ;
  var alignY   = this.options.align == 'center' ? 0 : this.ticks.y[0]*this.scaleY;

  for (var i = 0; i < this.ticks.z.length; i++){
    geometry.vertices.push(new THREE.Vector3(alignX, this.ticks.y[this.ticks.y.length-1]*this.scaleY, this.ticks.z[i]*this.scaleY));
    geometry.vertices.push(new THREE.Vector3(alignX, this.ticks.y[0]*this.scaleY, this.ticks.z[i]*this.scaleY));
  };
  for (var i = 0; i < this.ticks.y.length; i++){
    geometry.vertices.push(new THREE.Vector3(alignX, this.ticks.y[i]*this.scaleY, this.ticks.z[this.ticks.z.length-1]*this.scaleY));
    geometry.vertices.push(new THREE.Vector3(alignX, this.ticks.y[i]*this.scaleY, this.ticks.z[0]*this.scaleY));
  };

  for (var i = 0; i < this.ticks.z.length; i++){
    // Creating the tick label sprites
    if (this.options.labels.enabled){
      var tick = new THREE.CSS3DSprite(document.createElement('div'));
      var ele = $('<span>'+this.ticks.z[i]+'</span>');
      ele.css({
        "color": this.options.labels.colour,
        "font-family": "Open-sans, sans-serif",
        "position": 'absolute',
        "display": 'inline',
        "text-align": 'center'
      });
      tick.element = ele[0]
      //console.log(this.actor);
      tick.position.x = alignX;
      tick.position.y = alignY-15;
      tick.position.z = this.ticks.z[i]*this.scaleZ;

      this.actors.ticks.push(tick);
    };
  };

  plane = new THREE.LineSegments(geometry, material);
  this.actors.axes.push(plane);

  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(alignX, alignY, this.ticks.z[0]*this.scaleZ));
  geometry.vertices.push(new THREE.Vector3(alignX, alignY, this.ticks.z[this.ticks.z.length-1]*this.scaleZ));
  material = new THREE.LineBasicMaterial({color: this.options.colour, opacity: this.options.opacity, linewidth: this.options.linewidth});
  line = new THREE.LineSegments(geometry, material);
  this.actors.axes.push(line);
};

/*--reScale(height, width, depth)-----------------
Rescales the chart to a new dimension. Particularly useful
if the containing element has changed size.
Parameters:
  scaleX............(Number) new x scale.
  scaleY............(Number) new y scale.
  scaleZ............(Number) new z scale.
---------------------------------------------------------*/
Axis3D.prototype.reScale = function(scaleX, scaleY, scaleZ) {
  dx = scaleX / this.scaleX;
  dy = scaleY / this.scaleY;
  dz = scaleZ / this.scaleZ;

  for (i in this.actors.axes){
    this.actors.axes[i].scale.x *= dx;
    this.actors.axes[i].scale.y *= dy;
    this.actors.axes[i].scale.z *= dz;
  }
  for (i in this.actors.ticks){
    this.actors.ticks[i].position.x *= dx;
    this.actors.ticks[i].position.y *= dy;
    this.actors.ticks[i].position.z *= dz;
  }
  this.scaleX = scaleX;
  this.scaleY = scaleY;
  this.scaleZ = scaleZ;
};
