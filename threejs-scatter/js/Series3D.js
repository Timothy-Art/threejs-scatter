/*--Series3D(id, colour, options)--------------------------
A class representing a series of 3D points on the chart.
Parameters:
  id................(String) id/name of point, used for label.
  colour.............(String) describes the point background
                    for the series, any valid css accepted.
  options...........(Object) of options for the series.
Properties:
  points............(Map <Point3D>) Points on the graph,
                    indexed by point id.
  id................(String) ID of the series.
  colour............(String) Colour for the series points.
  options...........(Object) Full options object for the series.
  maxX..............(Number) Maximum x value.
  minX..............(Number) Minimum x value.
  maxY..............(Number) Maximum y value.
  minY..............(Number) Minimum y value.
  maxZ..............(Number) Maximum z value.
  minZ..............(Number) Minimum z value.
Functions:
  buildPoints(data), removePoints(id), clearPoints(),
  selectPoint(id)
---------------------------------------------------------*/
function Series3D(id, colour, options){
  var defaults = {
    points: undefined
  };

  this.points   = {},
  this.id       = id,
  this.colour   = colour ? colour : 'radial-gradient(rgba(255, 255, 255, 1) 5%, rgba(70,150,255,.7) 20%, rgba(50,100,255,0) 60%)',
  this.options  = jQuery.extend(true, defaults, options),
  this.maxX     = 0,
  this.minX     = 0,
  this.maxY     = 0,
  this.minY     = 0,
  this.maxZ     = 0,
  this.minZ     = 0;
};

/*--buildPoints(data)--------------------------------------
Loads new point and updates existing points in the series.
Parameters:
  data..............(Array <Object>) Array of x, y, z, id,
                    and optional colour and options objects.
---------------------------------------------------------*/
Series3D.prototype.buildPoints = function(data){
  for (var i in data){
    if (data[i].x > this.maxX){
      this.maxX = data[i].x;
    } else if (data[i].x < this.minX){
      this.minX = data[i].x;
    }

    if (data[i].y > this.maxY){
      this.maxY = data[i].y;
    } else if (data[i].y < this.minY){
      this.minY = data[i].y;
    }

    if (data[i].z > this.maxZ){
      this.maxZ = data[i].z;
    } else if (data[i].z < this.minZ){
      this.minZ = data[i].z;
    }

    var pointOptions = data[i].options ? jQuery.extend(true, {}, this.options.points, data[i].options) : this.options.points;

    this.points[data[i].id] = new Point3D(
      data[i].x,
      data[i].y,
      data[i].z,
      data[i].id,
      data[i].colour ? data[i].colour : this.colour,
      pointOptions
    );
    this.points[data[i].id].updateElement();
    this.points[data[i].id].ele.attr('id', 'series#'+this.id+"#"+this.points[data[i].id].ele[0].id);
  };
};

/*--addPoint(id, x, y, z, colour, options)-----------------
Adds a new point to the series.
Parameters:
  id................(String) id/name of point, used for label.
  x.................(Number) x coordinate.
  y.................(Number) y coordinate.
  z.................(Number) z coordinate.
  colour............(String) describes the point background,
                    any valid css accepted.
  options...........(Object) of options for the point.
Returns:
  created Point3D
---------------------------------------------------------*/
Series3D.prototype.addPoint = function(id, x, y, z, colour, options){
  if (x > this.maxX){
    this.maxX = x;
  } else if (x < this.minX){
    this.minX = x;
  }

  if (y > this.maxY){
    this.maxY = y;
  } else if (y < this.minY){
    this.minY = y;
  }

  if (z > this.maxZ){
    this.maxZ = z;
  } else if (z < this.minZ){
    this.minZ = z;
  }

  var pointOptions = options ? jQuery.extend(true, {}, this.options.points, options) : this.options.points;

  this.points[id] = new Point3D(
    x,
    y,
    z,
    id,
    colour ? colour : this.colour,
    pointOptions
  );
  this.points[id].updateElement();
  this.points[id].ele.attr('id', 'series#'+this.id+"#"+this.points[id].ele[0].id);

  return this.points[id];
};

/*--updatePoints(data)-------------------------------------
Updates a current point in the series. Points will be added
if they are not in the array yet or removed if any coordinate
is set to undefined.
Parameters:
  data..............(Array <Object>) Array of x, y, z, id,
                    and optional colour and options objects.
---------------------------------------------------------*/
Series3D.prototype.updatePoints = function(data){
  for (var i in data){
    //console.log(data[i]);
    if (this.points[data[i].id] == undefined){
      continue;
    };

    if (data[i].x == undefined || data[i].y == undefined || data[i].z == undefined){
      this.removePoints('series#'+this.id+"#"+data[i].id);
      continue;
    }

    if (data[i].x > this.maxX){
      this.maxX = data[i].x;
    } else if (data[i].x < this.minX){
      this.minX = data[i].x;
    }

    if (data[i].y > this.maxY){
      this.maxY = data[i].y;
    } else if (data[i].y < this.minY){
      this.minY = data[i].y;
    }

    if (data[i].z > this.maxZ){
      this.maxZ = data[i].z;
    } else if (data[i].z < this.minZ){
      this.minZ = data[i].z;
    }

    for (var j in data[i]){
      //console.log(this.points[data[i].id][j]);
      //console.log(data[i][j]);
      this.points[data[i].id][j] = data[i][j];
    };
    this.points[data[i].id].updateElement();
    //console.log(this.points[data[i].id]);
  };
};

/*--removePoints(id)---------------------------------------
Removes points from the series.
Parameters:
  id................(Array <String>) Array of ids to remove.
---------------------------------------------------------*/
Series3D.prototype.removePoints = function(id){
  //console.log(id)
  for (var i in id){
    this.points[id[i]].removeSelf();
    delete this.points[id[i]];
  };
};

/*--clearPoints()------------------------------------------
Clears the point array.
---------------------------------------------------------*/
Series3D.prototype.clearPoints = function(){
  this.points = {};
  this.maxX,
  this.minX,
  this.maxY,
  this.minY,
  this.maxZ,
  this.minZ = 0;
};

/*--selectPoint(id)----------------------------------------
Toggles a point's selected state in the series.
Parameters:
  id................(Array <String>) Array of ids to select.
---------------------------------------------------------*/
Series3D.prototype.selectPoint = function(id){
  //console.log(id);
  for (i in id){
    //console.log(id[i])
    this.points[id[i]].selectPoint();
  };
};
