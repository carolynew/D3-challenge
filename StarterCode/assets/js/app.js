//Define SVG area
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

//Define margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Import data
d3.csv("assets/data/data.csv").then(function(censusData) {
    //Parse data and set as numbers
    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
    });

    //Create scale for axes
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.smokes)])
        .range([height, 0]);

    //Create axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //Create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", ".stateCircle")
    .attr("opacity", ".5")
    
    chartGroup.append("text")
    .text(function(d) {return censusData.abbr}, ".stateText");

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokers (%)");
  
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Lack Healthcare (%)");
    }).catch(function(error) {
      console.log(error);
});

