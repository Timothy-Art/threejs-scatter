# threejsScatter

A 3D scatter plot built in [threejs](https://threejs.org) with bindings for use in shiny applications and dashboards.

## Installation

Install the package using `devtools::install_github('Timothy-Art/threejsScatter')`.

## Using the Javascript Library

If you wish to use the javascript library, the source along with an example is located in the threejs-scatter folder.

*full docs coming soon*

## Use with Shiny

The R package contains functions that allow you to add a 3D scatter plot to your shiny applications and dashboards.

The `threejsScatter(data, dimX, dimY, dimZ, background)` function creates and plots your data.

`data` is a list object containing a `data` and `chart` element. The `data` element contains lists of `series` to be plotted. Each `series` element will have its own list of data points as well as configuration options that can be used. More information on the options available can be found below. The `chart` is an element containing configuration options for the chart.

`dimX, dimY, dimZ` are numbers specifying the size of the virtual space for the chart to live in. By default these are 1000, resulting in a large cube for the chart. By reducing or increasing the size, you will stretch or shrink the available space but the elements of the chart will remain the same sizes. So for very busy charts, you can increase the dimension sizes and the elements will appear to be more sparsely placed (although their relationship to one another will remain constant).

`background` a valid css unit to specify the colour you want the background of the chart to be.
