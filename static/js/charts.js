function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
   var wfreq = data.metadata.map(d => d.wfreq)
   console.log(`Washing Freq: ${wfreq}`)
  
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samples = data.samples.filter(s => s.id.toString() === sample)[0];
    console.log(samples)
    //  5. Create a variable that holds the first sample in the array.
    var samplevalues = samples.sample_values.slice(0, 10).reverse();
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
    var OTU_id = OTU_top.map(d => "OTU " + d)
   
    var labels = samples.otu_labels.slice(0, 10).reverse;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var trace1 = {
      type: "bar",
      orientation: "h",
      x: samplevalues,
      y: OTU_id,
    };

    // 8. Create the trace for the bar chart. 
    var barData = [trace1
    ];
     
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis:{
          tickmode:"linear",
      },
      margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 30
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x: samples.otu_ids,
      y: samples.sample_values,
      mode: "markers",
      marker: {
          size: samples.sample_values,
          color: samples.otu_ids, 
      },
      
      text: samples.otu_labels

  };
    var bubbleData = [trace2
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: { text: "Belly Button Weekly Washing Frequency <br> Scrubs per Week"},
        type: "indicator",
        
        mode: "gauge+number",
        gauge: { axis: { range: [null, 10] },
                 steps: [
                  { range: [0, 2], color: "yellow" },
                  { range: [2, 4], color: "orange" },
                  { range: [4, 6], color: "red" },
                  { range: [6, 8], color: "purple" },
                  { range: [8, 10], color: "blue" },
                ]}
            
        }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 700, 
      height: 600, 
      margin: { t: 20, b: 40, l:100, r:100 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
  

