var parentSel = d3.select('#slope').html('')

var bgcolor = '#f5f5f5'
var color = {'L': '#878787', '7': '#BE00C1'}


var sel = parentSel.append('div')
var c = d3.conventions({
  sel, 
  margin: {left: 50, right: 70, bottom: 50},
  height: 400,
})


c.y.domain([0, 810])
c.x.domain([0, 1])


var data = [
  [217, 328],
  [632, 810]
]

data.forEach((d, i) => d.line = !i ? 'L' : '7')


c.svg.appendMany('pattern', ['L', '7'])
  .at({x: 0, y: 0, width: 2, height: 2, id: d => 'line-pattern-' + d})
  .attr('patternUnits', 'userSpaceOnUse')
  .append('circle')
  .at({r: 5, fill: bgcolor})
  .parent()
  .append('line')
  .at({x1: 10, stroke: d => color[d], strokeWidth: 1.5})

var line = c.svg.appendMany('g', data)
  .at({class: d => 'line-' + d.line})



line.append('path')
  .at({
    stroke: '#000',
    strokeWidth: 1,
    d: d => 'M' + [c.x(0), c.y(d[0])] + 'L' + [c.x(1), c.y(d[1])]
  })


line.appendMany('circle', d => d)
  .at({
    r: 6,
    cx: (d, i) => c.x(i),
    cy: c.y,
  })
  .st({
    fill: (d, i) => i ? '' : `url(#line-pattern-${d == 217 ? 'L' : 7})`,
    strokeWidth: 0,
  })

line.appendMany('text', d => d)
  .at({
    x: (d, i) => c.x(i),
    y: c.y,
    dy: '.33em',
    textAnchor: (d, i) => i ? 'start' : 'end',
    dx: (d, i) => i ? 7 : -9,
  })
  .text(d => '$' + d + 'M')


var baseSel = c.svg.append('g.axis')
  .translate(c.height, 1)

baseSel.append('line')
  .at({x2: c.width, stroke: '#000'})
baseSel.append('line')
  .at({y2: 5, stroke: '#000'})
baseSel.append('line')
  .translate(c.width, 0)
  .at({y2: 5, stroke: '#000'})

baseSel.append('text')
  .tspans('Estimated Cost'.split(' '))
  .at({
    textAnchor: 'middle',
    dy: 17
  })

baseSel.append('text')
  .tspans('Actual Cost'.split(' '))
  .at({
    textAnchor: 'middle',
    x: c.width,
    dy: 17
  })













// TODO 
// Mask pattern fill circle
// Cost and Timeline label


// timeline


var sel = parentSel.append('div')
var c = d3.conventions({
  sel, 
  margin: {left: 50, right: 70, bottom: 50},
  height: 400,
})


c.x.domain([0, 1])
c.y.domain([2019, 1999].map(d3.timeParse('%Y')).reverse())


c.svg.appendMany('g.axis', d3.range(2000, 2020, 2))
  .translate(d => [c.width/2, c.y(d3.timeParse('%Y')(d))])
  .append('text')
  .text(d => d)
  .at({textAnchor: 'middle', dy: '.33em'})



var timeline = [
  {line: 'L', type: 0, t0: 'Oct. 1999', t1: 'April 2004'},
  {line: 'L', type: 1, t0: 'Dec. 1999', t1: 'March 2009'},

  {line: '7', type: 0, t0: 'June 2007', t1: 'Dec. 2013'},
  {line: '7', type: 1, t0: 'June 2010', t1: 'Nov. 2018'},
]

timeline.forEach(d => {
  d.d0 = d3.timeParse('%b %Y')(d.t0)
  d.d1 = d3.timeParse('%b %Y')(d.t1)
})


var line = c.svg.appendMany('g', timeline)
  .translate(d => c.x(d.type), 0)

line.append('path')
  .at({
    stroke: '#000',
    strokeWidth: 5,
    d: d => 'M' + [0, c.y(d.d0)] + 'V' + c.y(d.d1)
  })
  .st({
    // stroke: 'url(line-pattern-7)'
    stroke: d => color[d.line],
    strokeDasharray: d => d.type ? '' : '1 2'
  })


// line.append('circle')
//   .at({
//     r: 4,
//     strokeWidth: 2,
//     cy: d => c.y(d.d0),
//   })
//   .st({
//     stroke: d => color[d.line],
//     fill: bgcolor
//   })

// line.append('circle')
//   .at({
//     r: 4,
//     strokeWidth: 2,
//     cy: d => c.y(d.d1),
//   })
//   .st({
//     stroke: d => color[d.line],
//     fill: d => color[d.line]
//   })



var baseSel = c.svg.append('g.axis')
  .translate(c.height, 1)

baseSel.append('line')
  .at({x2: c.width, stroke: '#000'})
baseSel.append('line')
  .at({y2: 5, stroke: '#000'})
baseSel.append('line')
  .translate(c.width, 0)
  .at({y2: 5, stroke: '#000'})

baseSel.append('text')
  .tspans('Estimated Timeline'.split(' '))
  .at({
    textAnchor: 'middle',
    dy: 17
  })

baseSel.append('text')
  .tspans('Actual Timeline'.split(' '))
  .at({
    textAnchor: 'middle',
    x: c.width,
    dy: 17
  })



// baseSel.append('text')
//   .text('Timeline')
//   .at({
//     textAnchor: 'middle',
//     x: c.width/2,
//     dy: 17
//   })




window.tlanno = 
[
  {
    "path": "M -63,-25 A 35.86 35.86 0 0 0 -12,21",
    "text": "The MTA planned on starting in 2007 and working for 6.5 years",
    "textOffset": [
      -108,
      -59
    ]
  }
]


var swoopy = d3.swoopyDrag()
  .x(d => c.x(0))
  .y(d => c.y(d3.timeParse('%Y')(2013)))
  .draggable(0)
  .annotations(tlanno)

var swoopySel = c.svg.append('g.swoopy').call(swoopy)
  .st({opacity: innerWidth< 700 ? 0 : 1})

swoopySel.selectAll('path')
  .attr('marker-end', 'url(#arrow)')
  .at({fill: 'none', stroke: '#000', strokeWidth: .4})

swoopySel.selectAll('text')
    .each(function(d){
      d3.select(this)
          .text('')                        //clear existing text
          .tspans(d3.wordwrap(d.text, 20)) //wrap after 20 char
    })



parentSel.append('div.source')
  .html(`
    L timeline and costs don't include Phase I prototyping. 7 estimated start date from the 2005 capital plan, estimated duration from the 2010 contract award.
    <br>
    <a href='https://reinventalbany.org/2018/11/flushing-7-train-cbtc-signals-late-and-over-budget-what-lessons-will-the-mta-learn-for-systemwide-modernization/'>Reinvent Albany</a>
    <a href='https://cbcny.org/sites/default/files/MTA_Capital_Report.pdf'>Citizens Budget Commission</a>
    <a href='https://ieeexplore.ieee.org/document/668106'>IEEE</a>
`)


