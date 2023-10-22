### implementation webset: https://startang2621.shinyapps.io/Power_plants_capacity_wi_fuel/

library(tidyverse)
library(sf)
library(shiny)

power.plants <- read_sf("https://raw.githubusercontent.com/krisrs1128/stat992_f23/main/exercises/ps2/power_plants.geojson")

power.plants.new <- power.plants|>
  mutate(cap_log = log1p(capacity_mw))

scatterplot <- function(df, selected_) {
  df |>
    mutate(selected = selected_) |>
    ggplot() +
    geom_sf(aes(col = factor(primary_fuel), size = cap_log,
                alpha = as.numeric(selected))) +
    scale_color_manual(name = "primary_fuel",
                       values = c("black", "#DD64AC", "#596A9E", "#C06929", "#EDF18F", "#55B8BE")) +
    scale_alpha(range = c(0.1, 1), guide = "none") +
    scale_size(range = c(0.5, 4.8), guide = "none") +
    guides(size = guide_legend(ncol = 4)) +
    labs(size = "log(1+capacity)", color = "primary_fuel") +
    theme_minimal()
}

overlay_histogram <- function(df, selected_) {
  sub_df <- filter(df, selected_)
  ggplot(df, aes(x = cap_log, fill = primary_fuel)) +
    geom_histogram(alpha = 0.3, binwidth = 0.3, position = "stack") +
    geom_histogram(data = sub_df, binwidth = 0.3, position = "stack") +
    scale_fill_manual(name = "primary_fuel",
                      values = c("black", "#DD64AC", "#596A9E", "#C06929", "#EDF18F", "#55B8BE")) +
    labs(x = "capacity (log1p scale)", y = "count") +
    theme_minimal()
}

filter_df <- function(df, selected_) {
  filter(data.frame(df), selected_) |>
    summarise(plant = name, owner = owner, fuel = primary_fuel, built_year = commissioning_year, `capacity(mw)` = capacity_mw)
}


reset_selection <- function(x, brush) {
  brushedPoints(x, brush, allRows = TRUE)$selected_
}

ui <- fluidPage(
  h3("MidWest Power Plants"),
  fluidRow(
    column(6,
           plotOutput("histogram", brush = brushOpts("plot_brush", direction = "x"), height = 400),
           dataTableOutput("table")
    ),
    column(6, plotOutput("map", height = 800)),
  )
)

server <- function(input, output) {
  selected <- reactiveVal(rep(TRUE, nrow(power.plants.new)))
  observeEvent(
    input$plot_brush, {
      selected(reset_selection(power.plants.new, input$plot_brush))
    })
  
  output$histogram <- renderPlot(overlay_histogram(power.plants.new, selected()))
  output$map <- renderPlot(scatterplot(power.plants.new, selected()))
  output$table <- renderDataTable(filter_df(power.plants, selected()))
}

shinyApp(ui, server)

