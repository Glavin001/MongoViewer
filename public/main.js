// Wait for DOM to finish loading.
$(document).ready(function() {
    // Ready!
    console.log('READY!');

    var aggregate = function(collection, pipeline, options, callback) {
        $.get(
            "/api/v1/"+collection+"/aggregate",
            {
                "pipeline": JSON.stringify(pipeline || []),
                "options": JSON.stringify(options || {})
            }
        ).done(function(results) {
            return callback && callback(results);
        });
    };

    var graph = function(selector, title, collection, pipeline, options) {

        // Discrete Bar graph
        aggregate(collection, 
            pipeline,
            options,
            function(results) {
                var data = [{
                    key: title,
                    values: results
                }];
                console.log(data);

                nv.addGraph(function() {
                  var chart = nv.models.discreteBarChart()
                      .x(function(d) { return d.label })    //Specify the data accessors.
                      .y(function(d) { return d.value })
                      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
                      .tooltips(false)        //Don't show tooltips
                      .showValues(true)       //...instead, show the bar value right on top of each bar.
                      .transitionDuration(350)
                      ;

                  d3.select(selector)
                      .datum(data)
                      .call(chart);

                  nv.utils.windowResize(chart.update);

                  return chart;
                });
        });

    };

    // Graph it!
    graph(
        "#charts svg#discreteBarDemo", 
        "Cumulative Return", 
        "discreteBar", 
        [ { "$project": {"_id":0, "label": 1, "value": 1} } ],
        {}
    );

    // Zips 1
    graph(
        "#charts svg#zips1", 
        "Zip Codes Example 1",
        "zips",
        [ 
            { $group : { _id : "$state", totalPop : { $sum : "$pop" } } },
            { $match : { totalPop : { $gte : 10*1000*1000 } } },
            { $project: { _id : 0, label: "$_id", value: "$totalPop" } }
        ],
        {}
    );

    // Zips 2
    graph(
        "#charts svg#zips2", 
        "Zip Codes Example 2",
        "zips",
        [ 
            { $group :
                { 
                    _id : { state : "$state", city : "$city" },
                    pop : { $sum : "$pop" } 
                } 
            },
            { $group :
                { 
                    _id : "$_id.state",
                    avgCityPop : { $avg : "$pop" } 
                } 
            },
            { 
                $project: { 
                    _id : 0, 
                    label: "$_id", 
                    value: "$avgCityPop" 
                } 
            }
        ],
        {}
    );

    // Zips 3
    graph(
        "#charts svg#zips3", 
        "Zip Codes Example 3",
        "zips",
        [ 
            {
                $group: {
                    _id: {
                        state: "$state",
                        city: "$city"
                    },
                    pop: {
                        $sum: "$pop"
                    }
                }
            }, {
                $sort: {
                    pop: 1
                }
            }, {
                $group: {
                    _id: "$_id.state",
                    biggestCity: {
                        $last: "$_id.city"
                    },
                    biggestPop: {
                        $last: "$pop"
                    },
                    smallestCity: {
                        $first: "$_id.city"
                    },
                    smallestPop: {
                        $first: "$pop"
                    }
                }
            },

            // the following $project is optional, and
            // modifies the output format.

            {
                $project: {
                    _id: 0,
                    state: "$_id",
                    biggestCity: {
                        name: "$biggestCity",
                        pop: "$biggestPop"
                    },
                    smallestCity: {
                        name: "$smallestCity",
                        pop: "$smallestPop"
                    }
                }
            },

            { $project: { _id : 0, label: "$state", value: "$biggestCity.pop" } }
        ],
        {}
    );

    // Zips 4
    graph(
        "#charts svg#zips4", 
        "Zip Codes Example 4",
        "zips",
        [ 
            {
                $group: {
                    _id: {
                        state: "$state",
                        city: "$city"
                    },
                    pop: {
                        $sum: "$pop"
                    }
                }
            }, {
                $sort: {
                    pop: 1
                }
            }, {
                $group: {
                    _id: "$_id.state",
                    biggestCity: {
                        $last: "$_id.city"
                    },
                    biggestPop: {
                        $last: "$pop"
                    },
                    smallestCity: {
                        $first: "$_id.city"
                    },
                    smallestPop: {
                        $first: "$pop"
                    }
                }
            },

            // the following $project is optional, and
            // modifies the output format.

            {
                $project: {
                    _id: 0,
                    state: "$_id",
                    biggestCity: {
                        name: "$biggestCity",
                        pop: "$biggestPop"
                    },
                    smallestCity: {
                        name: "$smallestCity",
                        pop: "$smallestPop"
                    }
                }
            },

            { $project: { _id : 0, label: "$state", value: "$smallestCity.pop" } }
        ],
        {}
    );


});

//Each bar represents a single discrete quantity.
function exampleData() {
 return  [ 
    {
      key: "Cumulative Return",
      values: [
        { 
          "label" : "A Label" ,
          "value" : -29.765957771107
        } , 
        { 
          "label" : "B Label" , 
          "value" : 0
        } , 
        { 
          "label" : "C Label" , 
          "value" : 32.807804682612
        } , 
        { 
          "label" : "D Label" , 
          "value" : 196.45946739256
        } , 
        { 
          "label" : "E Label" ,
          "value" : 0.19434030906893
        } , 
        { 
          "label" : "F Label" , 
          "value" : -98.079782601442
        } , 
        { 
          "label" : "G Label" , 
          "value" : -13.925743130903
        } , 
        { 
          "label" : "H Label" , 
          "value" : -5.1387322875705
        }
      ]
    }
  ]

}
