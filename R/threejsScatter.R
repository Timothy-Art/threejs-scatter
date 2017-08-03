#' threejsScatter
#' 
#' Creates a 3D scatter plot html widget using threejs.
#'
#' @param data a list of options and data points to pass to the scatter plot
#' @param dimX,dimY,dimZ how long you want the x, y, and z dimensions of the graph
#'
#' @return html widget
#' 
#' @import htmlwidgets
#' @import rjson
#'
#' @export
threejsScatter <- function(data, dimX, dimY, dimZ, width = NULL, height = NULL, elementId = NULL) {
  require(rjson)
  
  data <- rjson::toJSON(data)

  x <- list(
    data = data,
    height = dimY,
    width = dimX,
    depth = dimZ
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'threejsScatter',
    x,
    width = width,
    height = height,
    package = 'threejsScatter',
    elementId = elementId
  )
}

#' Shiny output bindings for a threejsScatter
#'
#' @param outputId output id of the widget
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#'
#' @export
threejsScatterOutput <- function(outputId, width = '100%', height = '500px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'threejsScatter', width, height, package = 'threejsScatter')
}

#' Shiny render for threejsScatterOutput
#' 
#' @param expr An expression that generates a threejsScatter
#' @param env The environment in which to evaluate \code{expr}.
#'   
#' @export
renderThreejsScatter <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, threejsScatterOutput, env, quoted = TRUE)
}
