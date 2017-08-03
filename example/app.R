library(shiny)
library(threejsScatter)

# Define UI for application that draws a histogram
ui <- fluidPage(
  tags$head(
    tags$script(src="https://use.fontawesome.com/a222ab71e2.js")
  ),
  threejsScatterOutput('test', height = '1200')
)

# Define server logic required to draw a histogram
server <- function(input, output, session) {
  opts <- list(
    data = list(
      #-- Series object
      list(
        id = 'series_1',
        color = 'white',
        data = list(
          list(id = 'hello', x = 0, y = 0, z = 0),
          list(id = 'world', x = 1, y = 3, z = 3),
          list(id = 'domo', x = 3, y = -3, z = 2),
          list(id = 'test', x = -3, y = -2, z = -3),
          list(id = 'nice', x = -2.5, y = 1.23, z = -1.87)
        ),
        option = list(
          points = list(
            labels = list(
              enabled = TRUE,
              style = list(colour = "white")
            ),
            points = list(enabled = TRUE),
            selection = list(enabled = TRUE),
            tooltip = list(enabled = TRUE)
          )
        )
      )

    ),
    chart = list(
      axes = list(
        colour = 0x12acff,
        labels = list(enabled = TRUE),
        align = 'center'
      )
    )
  )

  output$test <- renderThreejsScatter(
    threejsScatter(data = opts, dimX = 1500, dimY = 1500, dimZ = 1500, background = '#26282f')
  )

}

# Run the application
shinyApp(ui = ui, server = server)

