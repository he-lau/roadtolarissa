console.clear()

var tidy = []

function fill(d){
  var s = d.status
  return s == 'Legal' ? 'rgb(33, 150, 243)' : 
    s == 'No Law' ? '#bbb' : 
    s == 'Statutory Ban' ? 'rgb(255, 152, 0)' : 'rgb(244, 67, 54)'
}

function statusVal(d){
  var s = d.status
  return s == 'Legal' ? 1 : 
    s == 'No Law' ? 0 : 
    s == 'Statutory Ban' ? -1 : -3

}


d3.loadData('data.csv', (err, res) => { 
  data = res[0]

  var years = data.columns.filter(d => d != 'State' && d != 'abbrev')

  data.forEach(d => {
    var abv = d.abbrev
    years.forEach(year => {
      tidy.push({year, abv, status: d[year]})
    })
  })

  var c = d3.conventions({
    sel: d3.select('.chart').html(''),
    height: 800,
    width: 400,
    margin: {left: 0, top: 350, bottom: 400}
  })

  c.x.domain([1995, 2015])
  c.y.domain([0, 50])

  c.xAxis.tickFormat(d => d).tickValues([1995, 2000, 2005, 2010, 2015])
  d3.drawAxis(c)

  c.svg.select('.x')
    .translate([7, -c.margin.top - 25])
    .selectAll('line')
    .translate([0, 25])

  byState = d3.nestBy(tidy, d => d.abv)
  byState.forEach(state => {
    state.forEach((d, i) => {
      if (!i) return
      if (d.status != state[i - 1].status) d.changed = true
    })
  })

  byYear = d3.nestBy(tidy, d => d.year)
  byYear.forEach(year => {
    year.sort(d3.descendingKey(d => statusVal(d)*(d.changed ? .5 : 1)))

    year.forEach((d, i) => d.i = i)

    year.yOffset = d3.sum(year, d => Math.sign(statusVal(d))) - 50
    year.yOffset = Math.round(year.yOffset/2)*2
  })

  var yearSel = c.svg.appendMany('g', byYear)
    .translate(d => [c.x(d.key), c.y(-d.yOffset)/2])

  var circleSel = yearSel.append('circle')
    .at({fill: 'none', r: 13, strokeWidth: 2})
    .translate([7, -5])

  var textSel = yearSel.appendMany('text', d => d)
    .text(d => d.abv)
    .at({
      y: d => c.y(d.i),
      fill,
      fontSize: 14,
      fontWeight: d => d.changed ? 900 : 300,
      opacity: d => d.changed ? 1 : .45
    })
    .on('mouseover', d => {
      textSel
        .classed('active', 0)
        .filter(e => d.abv == e.abv)
        .classed('active', 1)

      circleSel.data(tidy.filter(e => d.abv == e.abv))
        .at({
          stroke: fill,
          cy: d => c.y(d.i),
          // r: 0
        })
    })

  annotations = 
[
  {
    "path": "M 316,-323 A 27.118 27.118 0 0 0 291,-297",
    "text": "Constitutional Ban",
    "textOffset": [
      323,
      -320
    ],
    "status": "Constitutional Ban"
  },
  {
    "path": "M 10,-291 A 37.558 37.558 0 0 0 28,-237",
    "text": "Statutory Ban",
    "textOffset": [
      12,
      -317
    ],
    "status": "Statutory Ban"
  },
  {
    "path": "M 144,564 A 45.228 45.228 0 0 0 109,512",
    "text": "No Law",
    "textOffset": [
      97,
      575
    ],
    "status": "No Law"
  },
  {
    "path": "M 239,559 A 38.382 38.382 0 0 1 256,501",
    "text": "Legal",
    "textOffset": [
      244,
      570
    ],
    "status": "Legal"
  }
]

annotations.forEach(d => d.status = d.text)


  var swoopy = d3.swoopyDrag()
      .draggable(0)
      .x(d => 0)
      .y(d => 0)
      .annotations(annotations)

  swoopySel = c.svg.append('g.annotations').call(swoopy)
  swoopySel.selectAll('path').attr('marker-end', 'url(#arrow)')

  swoopySel.selectAll('text')
    .st({fill, fontWeight: 600})
    .each(function(d){
      d3.select(this)
          .text('')                        
          .tspans(d3.wordwrap(d.text, 10)) 
    })  



})


d3.select('html').selectAppend('svg.marker')
  .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '-10 -10 20 20')
    .attr('markerWidth', 20)
    .attr('markerHeight', 20)
    .attr('orient', 'auto')
  .append('path')
    .attr('d', 'M-6.75,-6.75 L 0,0 L -6.75,6.75')
