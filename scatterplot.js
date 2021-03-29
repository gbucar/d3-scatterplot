fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(data=>data.json())
    .then(data=>{
        let ms = (d) =>new Date(0, 0, 0, 0, d.split(":")[0], d.split(":")[1]);
        let padding = 100
        let h = window.innerHeight
        let w = window.innerWidth-padding-300
        let body = d3.select("body")
        let info = body.append("div")
            .attr("id", "info")
        info.append("h1")
            .attr("id", "title")
            .text("Boring chart with some data")
        let legend = info.append("div")
            .attr("id", "legend")
        let negative = legend.append("div").attr("id", "black").text("Did not use doping")
        let positive = legend.append("div").attr("id", "red").text("Used doping")

        let svg = body.append("svg")
            .attr("id", "scatterplot")
            .attr("height", h)
            .attr("width", w)
        let xScale = d3.scaleTime()
                    .domain([d3.min(data, d=>new Date(d.Year, 0)), d3.max(data, d=>new Date(d.Year, 0))])
                    .range([padding, w-padding])
        let yScale = d3.scaleTime()
                    .domain([d3.max(data, d=>ms(d.Time)), d3.min(data, d=> ms(d.Time))])
                    .range([padding, h-padding])
        let xAxis = d3.axisBottom(xScale)
        let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"))
        let tooltip = d3.select("body").append("div").attr("id", "tooltip").style("opacity", "0")

        //add circles
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d=>xScale(new Date(d.Year, 0)))
            .attr("cy", d=>yScale(ms(d.Time)))
            .attr("r", 10)
            .attr("data-xvalue", d=>new Date(d.Year, 0))
            .attr("data-yvalue", d=>ms(d.Time))
            .attr("class", "dot")
            .attr("fill", (d)=>d.Doping ? "rgb(84, 105, 111)" : "black")
            .on("mouseover", (e,d)=>{
                tooltip.attr("style", `left: ${e.clientX+10}px; top: ${e.clientY+10}px; opacity: 1;`)
                        .attr("data-year", e.originalTarget.attributes["data-xvalue"].value)
                        .text(`name: ${d.Name}\nyear: ${new Date(d.Year,).getFullYear()}\nplace: ${d.Place}\ntime: ${d.Time}\ndoping: ${d.Doping}`)
            })
            .on("mousemove", (e)=>{
                tooltip.attr("style", `left: ${e.clientX+10}px; top: ${e.clientY+10}px; opacity: 1;`)
            })
            .on("mouseout", (e)=>{
                tooltip.attr("style", "opacity: 0;")
                    .text("")
            })

        //add axis
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + (h-padding) + ")")
            .call(xAxis)
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(" + (padding-10) + ", 0)")
            .call(yAxis)
    })