// Plotly Homework -- Scott Brown

// Nothing changed in HTML.


function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    var route_to_metadata="/metadata/"+sample;
    var html_metadata_append=d3.select("#sample-metadata");


    html_metadata_append.html("");


    d3.json(route_to_metadata).then(function(data){
      Object.entries(data).forEach(([key,value])=>{
        html_metadata_append.append("h5").text(`${key}: ${value}`);
      })
   

    //Gauge chart
    //WFREQ is neede variable

    //This needs to be converted to a 180 degree scale  =>  180=9x, (9 is the max value)  => multiplier = 20.
    var scrubs=data.WFREQ;

    var degrees=180-(scrubs*20), radius=.5;

    var radians=degrees*Math.PI/180;
    var x=radius*Math.cos(radians);
    var y=radius*Math.sin(radians);

    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';

    var mainPath = path1, pathX = String(x), space = ' ', pathY =String(y), pathEnd = ' Z';


    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data_gauge = [{ 
      type: 'scatter',
      x: [0], y:[0],
      marker: {size: 14, color:'rgb(255,0,0)'},
      showlegend: false,
      name: 'Scrubs',
      text: scrubs,
      hoverinfo: `text+name`},
      { values: [45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 50],
      rotation: 90,
      text: [`8-9`, `7-8`, `6-7`, '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(132, 181, 137, 1)', 'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)', 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)', 'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)', 'rgba(244, 241, 228, 1)', 'rgba(248, 243, 236, 1)', 'rgba(255, 255, 255, 0)',]},


      labels: [`8-9 scrubs`, `7-8 scrubs`, `6-7 scrubs`, '5-6 scrubs', '4-5 scrubs', '3-4 scrubs', '2-3 scrubs', '1-2 scrubs', '0-1 scrubs', ''],


      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
      }];

      var layout_gauge = {
        shapes:[{
        type: 'path',
        path: path,
        fillcolor: 'rgb(255,0,0)',
        line: {
        color: 'rgb(255,0,0)'
        }
      }],
      title: { 
      text: '<b>Belly Button Washing Frequency</b> <br>Scrubs per Week',
      font: {
          color: "black",
          size: 20
        },
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: 'rgba(0,0,0,0)',
      //paper_bgcolor: "rgb(0, 0, 0)",
      //height: 400,
      //width: 400,
      xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
      };

    Plotly.newPlot('gauge', data_gauge, layout_gauge,);

  })
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  //Route declaration
  var route_to_samples="/samples/"+sample;

  //Pie chart
  d3.json(route_to_samples).then(function(data){
    var trace_pie={
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      hovertext: data.otu_labels.slice(0,10),
      textposition: 'inside',
      type:"pie"
    };

    var data_pie=[trace_pie];
    var layout_pie={
      title: { 
        text: `Sample Breakdown:`,
        font: {
          size: 28
      },
      },
      showlegend:true
    };

    Plotly.newPlot("pie", data_pie, layout_pie);


    //Bubble Plot

    var trace_bubble = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values,
        colorscale: "Earth" //Needed for colors to match provided homework template.
      }
    };

    var data_bubble = [trace_bubble];

    var layout_bubble = {
      title: { 
        text: `Sample ${sample} Visualization`,
        font: {
          size: 28
      },
      },
      showlegend: false,
      height: 750,
      xaxis: { title: { text: "OTU ID"}},
    };
    
    Plotly.newPlot('bubble', data_bubble, layout_bubble);

  })
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    console.log(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
