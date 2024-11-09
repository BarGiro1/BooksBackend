$(document).ready(function() {
    const ordersData = [
        { "_id": { "year": 2024, "month": 1 }, "totalOrders": 5 },
        { "_id": { "year": 2024, "month": 2 }, "totalOrders": 8 },
        { "_id": { "year": 2024, "month": 3 }, "totalOrders": 12 },
        { "_id": { "year": 2024, "month": 4 }, "totalOrders": 15 },
        { "_id": { "year": 2024, "month": 5 }, "totalOrders": 9 },
        { "_id": { "year": 2024, "month": 6 }, "totalOrders": 14 },
        { "_id": { "year": 2024, "month": 7 }, "totalOrders": 10 },
        { "_id": { "year": 2024, "month": 8 }, "totalOrders": 18 },
        { "_id": { "year": 2024, "month": 9 }, "totalOrders": 20 },
        { "_id": { "year": 2024, "month": 10 }, "totalOrders": 22 },
        { "_id": { "year": 2024, "month": 11 }, "totalOrders": 11 },
    ];

    function createBarChart(svgSelector, data, xValue, yValue, xLabel, yLabel) {
        const svg = d3.select(svgSelector);
        const margin = { top: 20, right: 30, bottom: 200, left: 40 };
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const x = d3.scaleBand()
            .domain(data.map(xValue))
            .rangeRound([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, yValue)])
            .nice()
            .rangeRound([height, 0]);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10))
            .append("text")
            .attr("class", "axis-label")
            .attr("fill", "#000")
            .attr("x", 5)
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "start")
            .text(yLabel);

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(xValue(d)))
            .attr("y", d => y(yValue(d)))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(yValue(d)))
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 0.8);
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`${yLabel}: ${yValue(d)}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).style("opacity", 1);
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }

    // Create the orders per month chart
    createBarChart(".orders-per-month", ordersData, 
        d => `${d._id.year}-${d._id.month}`, 
        d => d.totalOrders, 
        "Month", 
        "Total Orders");

    // Fetch and create the sales per book chart
    $.ajax({
        type: "GET",
        url: "http://localhost:3001/statistics/getSalesPerBook",
        success: function(response) {
            createBarChart(".sales-per-book", response, 
                d => d.bookName, 
                d => d.count, 
                "Book", 
                "Sales");
        }
    });
});