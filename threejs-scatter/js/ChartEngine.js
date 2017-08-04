/*--ChartEngine(scene, data, options, height, width, depth)
A class that builds and contains the elements of the 3D chart.
Parameters:
  scene.............(THREE.Scene) ThreeJS scene to add chart to.
  data..............(Array <Object>) Array containing the
                    points for each series to be plotted and
                    the options for that series.
  options...........(Object) Options for the chart.
  height............(Number) Height(y) of the chart
  width.............(Number) Width(x) of the chart
  depth.............(Number) Depth(z) of the chart
Properties:
  series............(Array <Series3D>) Series on the graph.
  options...........(Object) Options for the chart.
  scene.............(THREE.Scene) ThreeJS to draw to.
  height............(Number) Height of chart.
  width.............(Number) Width of chart.
  depth.............(Number) Depth of chart.
  maxX..............(Number) Maximum x value.
  minX..............(Number) Minimum x value.
  maxY..............(Number) Maximum y value.
  minY..............(Number) Minimum y value.
  maxZ..............(Number) Maximum z value.
  minZ..............(Number) Minimum z value.
Functions:
  addActors(), addAxes(), addScene(), selectPoint(),
  removePoint(), movePoint(), moveCoordinate()
---------------------------------------------------------*/
function ChartEngine(pointScene, tickScene, axisScene, data, options, height, width, depth){
  var defaults = {
    colours: ['radial-gradient(rgba(255, 255, 255, 1) 5%, rgba(70,150,255,.7) 20%, rgba(50,100,255,0) 60%)']
  };

  this.series     = [];
  this.actors     = {};
  this.axes       = undefined;
  this.options    = jQuery.extend(true, defaults, options);
  this.pointScene = pointScene;
  this.tickScene  = tickScene;
  this.axisScene  = axisScene;
  //console.log(this.scene);

  this.height = height || 800;
  this.width  = width || 800;
  this.depth  = depth || 800;

  this.maxX   = 0,
  this.minX   = 0,
  this.scaleX = 1,

  this.maxY   = 0,
  this.minY   = 0,
  this.scaleY = 1,

  this.maxZ   = 0,
  this.minZ   = 0,
  this.scaleZ = 1;

  // Creating the series and points.
  var i;
  for (i in data){
    //console.log(i)
    var colour = data[i].colour || this.options.colours[
      this.options.colours.length - (this.options.colours.length - i % this.options.colours.length)
    ];

    this.series.push(new Series3D(data[i].id, colour, data[i].options));

    this.series[i].buildPoints(data[i].data);
    //console.log(this.series, i);

    this.maxX = this.series[i].maxX > this.maxX ? this.series[i].maxX : this.maxX;
    this.minX = this.series[i].minX < this.minX ? this.series[i].minX : this.minX;
    this.maxY = this.series[i].maxY > this.maxY ? this.series[i].maxY : this.maxY;
    this.minY = this.series[i].minY < this.minY ? this.series[i].minY : this.minY;
    this.maxZ = this.series[i].maxZ > this.maxZ ? this.series[i].maxZ : this.maxZ;
    this.minZ = this.series[i].minZ < this.minZ ? this.series[i].minZ : this.minZ;
  };

  this.axes = new Axis3D(this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ,
    this.scaleX, this.scaleY, this.scaleZ, this.options.axes);

  this.maxX = this.maxX > this.axes.ticks.x[this.axes.ticks.x.length-1] ? this.maxX : this.axes.ticks.x[this.axes.ticks.x.length-1]
  this.minX = this.minX < this.axes.ticks.x[0] ? this.minX : this.axes.ticks.x[0]
  this.maxY = this.maxY > this.axes.ticks.y[this.axes.ticks.y.length-1] ? this.maxY : this.axes.ticks.y[this.axes.ticks.y.length-1]
  this.minY = this.minY < this.axes.ticks.y[0] ? this.minY : this.axes.ticks.y[0]
  this.maxZ = this.maxZ > this.axes.ticks.z[this.axes.ticks.z.length-1] ? this.maxZ : this.axes.ticks.z[this.axes.ticks.z.length-1]
  this.minZ = this.minZ < this.axes.ticks.z[0] ? this.minZ : this.axes.ticks.z[0]

  // Figuring out the scaling of the points.
  this.scaleX = this.width / ((this.maxX - this.minX) || 1);
  this.scaleY = this.height / ((this.maxY - this.minY) || 1);
  this.scaleZ = this.depth / ((this.maxZ - this.minZ) || 1);

  this.axes.scaleX = this.scaleX
  this.axes.scaleY = this.scaleY
  this.axes.scaleZ = this.scaleZ

  // Setting the real coordinates of the points.
  for (i in this.series){
    for (j in this.series[i].points){
      var point = this.series[i].points[j];
      point.setCoordinates(x = point.x*this.scaleX, y = point.y*this.scaleY, z = point.z*this.scaleZ);
      this.actors['series#'+this.series[i].id+"#point#"+this.series[i].points[j].id] = point.createActor();
    };
  };

  this.axes.genAxis();


};

/*--reScale(height, width, depth, animate)-----------------
Rescales the chart to a new dimension.
Parameters:
  height............(Number) new height.
  width.............(Number) new width.
  depth.............(Number) new depth.
  animate...........(Boolean) whether to animate.
---------------------------------------------------------*/
ChartEngine.prototype.reScale = function(height, width, depth, animate){
  this.height = height,
  this.width  = width,
  this.depth  = depth;

  this.scaleX = this.width / ((this.maxX - this.minX) || 1),
  this.scaleY = this.height / ((this.maxY - this.minY) || 1),
  this.scaleZ = this.depth / ((this.maxZ - this.minZ) || 1);

  console.log(this.scaleX, this.scaleY, this.scaleZ);

  for (i in this.series){
    for (j in this.series[i].points){
      var point = this.series[i].points[j];
      console.log(point.x);
      this.moveCoordinate(
        this.series[i].id,
        [j],
        x = point.x*this.scaleX,
        y = point.y*this.scaleY,
        z = point.z*this.scaleZ,
        animate
      );
    };
  };
};

/*--addActors()--------------------------------------------
Adds the actors (points) to the scene.
---------------------------------------------------------*/
ChartEngine.prototype.addActors = function(){
  var keys = Object.keys(this.actors);
  for (var i in keys){
    //console.log(keys[i]);
    this.actors[keys[i]].name = keys[i];
    this.pointScene.add(this.actors[keys[i]]);
  };
};

/*--addActors()--------------------------------------------
Adds the axes to the scene.
---------------------------------------------------------*/
ChartEngine.prototype.addAxes = function(){
  for (var i in this.axes.actors.ticks){
    this.tickScene.add(this.axes.actors.ticks[i]);
  };
  for (var i in this.axes.actors.axes){
    this.axisScene.add(this.axes.actors.axes[i]);
  };
};

/*--addScene()--------------------------------------------
Adds both actors (points) and axes to the scene.
---------------------------------------------------------*/
ChartEngine.prototype.addScene = function(){
  this.addActors();
  this.addAxes();
};

/*--addSeries(data)----------------------------------------
Adds a new series to the graph
Parameters:
  data..............(Series Object)
Returns:
  created Series3D
---------------------------------------------------------*/
ChartEngine.prototype.addSeries = function(data){
  var colour = data.colour || this.options.colours[
    this.options.colours.length - (this.options.colours.length - this.series.length % this.options.colours.length)
  ];

  var newSeries = new Series3D(data.id, colour, data.options)

  this.series.push(newSeries);

  newSeries.buildPoints(data.data);
  //console.log(this.series, i);

  this.maxX = newSeries.maxX > this.maxX ? newSeries.maxX : this.maxX;
  this.minX = newSeries.minX < this.minX ? newSeries.minX : this.minX;
  this.maxY = newSeries.maxY > this.maxY ? newSeries.maxY : this.maxY;
  this.minY = newSeries.minY < this.minY ? newSeries.minY : this.minY;
  this.maxZ = newSeries.maxZ > this.maxZ ? newSeries.maxZ : this.maxZ;
  this.minZ = newSeries.minZ < this.minZ ? newSeries.minZ : this.minZ;

  for (var j in newSeries.points){
    var point = newSeries.points[j];
    point.setCoordinates(x = point.x*this.scaleX, y = point.y*this.scaleY, z = point.z*this.scaleZ);
    this.actors['series#'+newSeries.id+"#point#"+newSeries.points[j].id] = point.createActor();
    this.actors['series#'+newSeries.id+"#point#"+newSeries.points[j].id].name = 'series#'+newSeries.id+"#point#"+point.id;
    this.pointScene.add(point.actor);
  };

  return newSeries;
};

/*--addPoint(series, id, x, y, z, colour, options)---------
Adds a new point to one of the series
Parameters:
  series............(String) id of series
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
ChartEngine.prototype.addPoint = function(series, id, x, y, z, colour, options){
  var point = undefined;

  for (var i in this.series){
    if (this.series[i].id == series){
      var point = this.series[i].addPoint(id, x, y, z, colour, options);
      point.setCoordinates(point.x*this.scaleX, point.y*this.scaleY, point.z*this.scaleZ);
      this.actors['series#'+series+'#point#'+id] = point.createActor();
      this.actors['series#'+series+'#point#'+id].name = 'series#'+series+"#point#"+point.id
      //console.log(point);
      this.pointScene.add(point.actor);
    };
  };

  return point;
};

/*--selectPoint(series, id)--------------------------------
Toggles a point's selected state in a given series.
Parameters:
  series............(String Name of series.
  id................(Array <String>) Array of ids to select.
---------------------------------------------------------*/
ChartEngine.prototype.selectPoint = function(series, id){
  //console.log('selecting');
  for (i in this.series){
    if (this.series[i].id == series){
      //console.log(this.series[i].id);
      this.series[i].selectPoint(id);
      return;
    }
  }
}

/*--removePoint(series, id)--------------------------------
Removes a point from the chart
Parameters:
  series............(String Name of series.
  id................(Array <String>) Array of ids to select.
---------------------------------------------------------*/
ChartEngine.prototype.removePoint = function(series, id){
  for (var i in this.series){
    if (this.series[i].id == series){
      //console.log(this.series[i].id);
      this.series[i].removePoints([id]);

      var actorId = 'series#' + series + '#point#' + id;
      //console.log(actorId);
      delete this.actors[actorId];
      this.pointScene.remove(this.pointScene.getObjectByName(actorId));
      return;
    }
  }
}

/*--movePoint(series, id, x, y, z, animate)----------------
Moves and optionally animates a point in the series to a
new location using the internal coordinates.
Parameters:
  series............(String Name of series.
  id................(String) id of point.
  x.................(Number) new x coordinate.
  y.................(Number) new y coordinate.
  z.................(Number) new z coordinate.
  animate...........(Boolean) whether to animate.
Return:
  -1 if deleted point, 0 if no point, 1 if moved
---------------------------------------------------------*/
ChartEngine.prototype.movePoint = function(series, id, x, y, z, animate){
  var key = "series#"+series+"#point#"+id;
  console.log(key);

  if (x == undefined || y == undefined || z == undefined){
    for (var i in this.series){
      if (this.series[i].id == series){
        this.series[i].removePoints([id]);
        delete this.actors[key];
        this.pointScene.remove(this.pointScene.getObjectByName(key));
        return -1;
      };
    };
  };

  for (i in this.series){
    if(this.series[i].id == series){
      console.log(this.series[i].points);
      if (this.series[i].points[id] == undefined){
        console.log('missing point on move');
        return 0;
      }
      this.series[i].updatePoints([{id: id, x: x, y: y, z: z}]);
      this.series[i].points[id].setCoordinates(x*this.scaleX, y*this.scaleY, z*this.scaleZ);
      break;
    };
  };

  if(animate){
    //console.log('tweening');
    //console.log(y*this.scaleY);
    new TWEEN.Tween(this.actors[key].position).to({
        x: x*this.scaleX,
        y: y*this.scaleY,
        z: z*this.scaleZ
      }, 500).easing(TWEEN.Easing.Exponential.InOut).start();
  } else {
    this.actors[key].position.x = x*this.scaleX
    this.actors[key].position.y = y*this.scaleY
    this.actors[key].position.z = z*this.scaleZ
  };
  return 1;
};

/*--moveCoordinate(series, id, x, y, z, animate)-----------
Moves and optionally animates a point in the series to a
new location using real coordinates.
Parameters:
  series............(String Name of series.
  id................(Array <String>) Array of ids to select.
  x.................(Number) new x coordinate.
  y.................(Number) new y coordinate.
  z.................(Number) new z coordinate.
  animate...........(Boolean) whether to animate.
---------------------------------------------------------*/
ChartEngine.prototype.moveCoordinate = function(series, id, x, y, z, animate){
  var key = "series#"+series+"#point#"+id;
  for (i in this.series){
    if(this.series[i].id == series){
      this.series[i].points[id].setCoordinates(x, y, z);
      break;
    };
  }

  if(animate){
    //console.log('tweening');
    //console.log(y*this.scaleY);
    new TWEEN.Tween(this.actors[key].position).to({
        x: x,
        y: y,
        z: z
      }, 500).easing(TWEEN.Easing.Exponential.InOut).start();
  } else {
    this.actors[key].position.x = x
    this.actors[key].position.y = y
    this.actors[key].position.z = z
  };
};
