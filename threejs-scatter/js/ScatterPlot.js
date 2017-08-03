/*--ScatterPlot(container, options, height, width, depth)--
A class that builds and contains the elements of the 3D chart.
Parameters:
  container.........(String) id of HTML container.
  options...........(Object) Options containing series and
                    chart settings.
Properties:
  options...........(Object) Stored options.
  container.........(JQuery) containing element.
  camera............(THREE.PerspectiveCamera) ThreeJS camera.
  scene.............(THREE.Scene) ThreeJS scene.
  renderer..........(THREE.CSS3DREnderer) ThreeJS CSS renderer.
  controls..........(THREE.TrackballControls) ThreeJS camera controller
  chart.............(ChartEngine) The chart to be rendered
Functions:
  animate()
---------------------------------------------------------*/
function ScatterPlot(container, options, height, width, depth){
  var that = this;

  this.camera,
  this.pointScene, this.tickScene, this.axisScene,
  this.cssRenderer, this.threeRenderer;
  this.controls;
  this.chart;

  this.height = height,
  this.width  = width,
  this.depth  = depth;

  this.container  = $('#'+container);
  this.options    = options;
  this.pointScene = new THREE.Scene();
  this.tickScene  = new THREE.Scene();
  this.axisScene  = new THREE.Scene();
  //console.log(this.pointScene);
  console.log(this.container[0]);

  this.camera = new THREE.PerspectiveCamera(75, this.container.innerWidth() / this.container.innerHeight(), 1, 10000);
  this.camera.position.set(0, 0, depth*1.25);
  this.camera.lookAt(new THREE.Vector3(0,0,0));

  this.chart = new ChartEngine(this.pointScene, this.tickScene, this.axisScene,
    this.options.data, this.options.chart, this.height, this.width, this.depth);
  this.chart.addScene();

  this.threeRenderer = new THREE.WebGLRenderer();
  this.threeRenderer.setClearColor(this.container.css("background-color"))
	this.threeRenderer.setPixelRatio(window.devicePixelRatio);
	this.threeRenderer.setSize(this.container.innerWidth(), this.container.innerHeight());
  document.getElementById(container).appendChild(this.threeRenderer.domElement);

  this.cssRenderer = new THREE.CSS3DRenderer();
  this.cssRenderer.setSize(this.container.innerWidth(), this.container.innerHeight());
  this.cssRenderer.domElement.style.position = 'absolute';
  this.cssRenderer.domElement.style.top = 0;
  document.getElementById(container).appendChild(this.cssRenderer.domElement);

  this.controls = new THREE.OrbitControls(this.camera, this.cssRenderer.domElement);
  this.controls.rotateSpeed = 0.5;

  this.container.data({ScatterPlot: this});

  window.addEventListener('resize', function(e){
    that.camera.aspect = that.container.innerWidth() / that.container.innerHeight();
    that.camera.updateProjectionMatrix();

    that.threeRenderer.setSize(that.container.innerWidth(), that.container.innerHeight());
    that.cssRenderer.setSize(that.container.innerWidth(), that.container.innerHeight());

  }, false);

  this.animate()
};

/*--animate()----------------------------------------------
Draws and animates the scene.
---------------------------------------------------------*/
ScatterPlot.prototype.animate = function(){
  requestAnimationFrame(this.animate.bind(this));

  TWEEN.update();
  this.controls.update();
  this.cssRenderer.render(this.pointScene, this.camera);
  this.cssRenderer.render(this.tickScene, this.camera);
  this.threeRenderer.render(this.axisScene, this.camera)
};

/*--updatePoints(data)-------------------------------------
Updates any number of data points on the graph. Points with
undefined coordinates will be removed instead.
Parameters:
  data..............(Array) Array of series to update/add.
                            Each series can contain any number of
                            points.
---------------------------------------------------------*/
ScatterPlot.prototype.updatePoints = function(data, animate){
  for (var i in data){
    var found = false;

    for (var j in this.chart.series){
      if (data[i].id == this.chart.series[j].id){
        found = true;
        for (var k in data[i].data){
          var key = "series#"+this.chart.series[j].id+"#"+data[i].data[k].id;
          //console.log(data[i].data[k].id);
          var status =
            this.chart.movePoint(
              this.chart.series[j].id,
              data[i].data[k].id,
              data[i].data[k].x,
              data[i].data[k].y,
              data[i].data[k].z,
              animate
            );

          if (status == 0){
            //console.log('new point in series '+this.chart.series[j].id);
            var newPoint = this.chart.addPoint(
              this.chart.series[j].id,
              data[i].data[k].id,
              data[i].data[k].x,
              data[i].data[k].y,
              data[i].data[k].z,
              data[i].data[k].colour,
              data[i].data[k].options
            );
          };
        };
      };
    };

    if (!found){
      //console.log('adding new series');
      this.chart.addSeries(data[i]);
    }
  };
};

/*--Event Handlers for the Control Panel-----------------*/
$(document).ready(function(){

  /*--point mouseenter/mouseleave----------------------------
  Handles the tooltip when the cursor hovers over a point
  ---------------------------------------------------------*/
  $('body').on('mouseenter', '.point', function(e){
    var selection = e.currentTarget.id.split("#")
    var chart = e.currentTarget.parentNode.parentNode.parentNode;
    chart = $(chart).data("ScatterPlot");
    //console.log(chart);
    chart.chart.selectPoint(selection[1], [selection[3]]);
  }).on('mouseleave', '.point', function(e){
    var selection = e.currentTarget.id.split("#")
    var chart = e.currentTarget.parentNode.parentNode.parentNode;
    chart = $(chart).data("ScatterPlot");
    //console.log(chart);
    chart.chart.selectPoint(selection[1], [selection[3]]);
  })
})
