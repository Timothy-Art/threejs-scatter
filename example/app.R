library(shiny)
library(threejsScatter)

# Define UI for application that draws a histogram
ui <- fluidPage(
  tags$head(
    tags$script(src="https://use.fontawesome.com/a222ab71e2.js")
  ),
  tags$div(style = 'height: 5vh', tags$h4('A threejs Scatter Plot')),
  tags$div(
    threejsScatterOutput('test', height = '80vh')
  )
)

# Define server logic required to draw a histogram
server <- function(input, output, session) {
  opts <- list(
    data = list(
      #-- Series object
      list(
        id = 'series_1',
        colour = 'white',
        data = list(
          list(id = 'hello', x = 0, y = 0, z = 0, colour = 'orange', options = list(labels = list(style = list(color = "orange")))),
          list(id = 'world', x = 1, y = 3, z = 3),
          list(id = 'domo', x = 3, y = -3, z = 2),
          list(id = 'test', x = -3, y = -2, z = -3),
          list(id = 'nice', x = -2.5, y = 1.23, z = -1.87)
        ),
        options = list(
          points = list(
            labels = list(
              enabled = T,
              style = list(colour = "white")
            ),
            points = list(enabled = T),
            selection = list(enabled = T),
            tooltip = list(enabled = T)
          )
        )
      )

    ),
    chart = list(
      axes = list(
        colour = 0x1289bb,
        labels = list(enabled = T),
        align = 'center'
      ),
      colours = list('red')
    )
  )

  output$test <- renderThreejsScatter(
    threejsScatter(data = opts, dimX = 1000, dimY = 1000, dimZ = 1000, background = '#26282f')
  )

}

# Run the application
shinyApp(ui = ui, server = server)

