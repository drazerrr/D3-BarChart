const width = 900;
const height = 500;
const padding = 40;
let req = new XMLHttpRequest();
let svg;


const createTitle = () => {
    return d3.select('main')
             .append('div')
             .attr('id', 'title')
             .text('United States GDP');
};

const createCanvas = () => {
    const svg = d3.select('main')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)
                  
         
        return svg;
};


const createTootip = () => {
    return d3.select('body')
             .append('div')
             .attr('id', 'tooltip')

};

const sendRequestToAPI = (req) => {

    const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    const method = 'GET';
    req.open(method, url, true) // asynchronous
    return req;

};

const defineScales = (dates, gdps) => {
    const minDate = d3.min(dates, (d) => new Date(d));
    const maxDate = d3.max(dates, (d) => new Date(d));
    const maxgdp = d3.max(gdps, (d) => d);
    
    const xScale = d3.scaleTime().domain([minDate, maxDate])
                                   .range([padding, width - padding]);
    
    const yScale = d3.scaleLinear().domain([0, maxgdp])
                                   .range([height -padding, padding]);
                                   
       return {xScale, yScale};                            
};

const createAxis = (scales, svg) => {
    svg.append('g')
       .attr("id", "x-axis")
       .call(d3.axisBottom(scales.xScale))
       .attr('transform', 'translate(0, '+(height-padding)+')');

       svg.append('g')
          .attr("id", "y-axis")
          .call(d3.axisLeft(scales.yScale))
          .attr('transform', 'translate('+padding+', 0)')
};

const createBars = (dates, gdps, scales) => {
     svg.selectAll('rect')
        .data(gdps)
        .enter()
        .append('rect')
        .attr('x', (d, i) => scales.xScale(new Date(dates[i])))
        .attr('y', (d) => scales.yScale(d))
        .attr("width", (width - (2 * padding))/ gdps.length)
        .attr("height", (d) => height - scales.yScale(d) - padding)
        .attr('class', 'bar')
        .attr("data-date", (d, i) => dates[i])
        .attr("data-gdp", (d) => d)
        .on('mouseover', (e, d) => {
            let bil = d.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1, ')
            d3.select('#tooltip')
              .style('opacity', 0.85)
              .style('left', e.pageX + 6 + 'px')
              .style('top', e.pageY + 'px')
              .html(`<p>Date: ${dates[gdps.indexOf(d)]}</p><p>$${bil} Billion</p>`).attr("data-date", dates[gdps.indexOf(d)])
        })
        .on('mouseout', () => {
            return d3.select("#tooltip")
                     .style('opacity', 0)
                     .style('left', 0)
                     .style('top', 0)
        })
}
req.onload = () => {
    const dates = [];
    const gdps = [];
    const data = JSON.parse(req.responseText);
    data.data.forEach(element => {
        gdps.push(element[1]);
        dates.push(element[0]);
        
    });
    const scales = defineScales(dates, gdps); // {xScale, yScale};
    createAxis(scales, svg);
    createBars(dates, gdps, scales)
};






const driver = () => {

    createTitle();
    svg = createCanvas();
    createTootip();
    req = sendRequestToAPI(req);
    req.send();



};

driver();