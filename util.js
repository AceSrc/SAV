var r = 5
function draw(svg, nodes, edges) {
    function update_edge() {
        dom_edges.classed('showed', function(d) {
            if (d.source.clicked) {
                d3.select(d['info'].dom_ref).raise().classed('showed', true)
                if (d3.select(d['info'].dom_ref).raise().classed('halfinvisible')) return false;
                return true;
            }
            d3.select(d['info'].dom_ref).raise().classed('showed', false)
            d3.select(d['info'].dom_ref).raise().classed('halfinvisible', false);
            return false;
        })
    }
    
    function click_node(d) {
        if (d.clicked) {
            d3.select(d['info'].dom_ref).raise().classed('showed', false)
            d3.select(this).raise().classed('showed', false)
            d.clicked = false
        }
        else {
            d3.select(d['info'].dom_ref).raise().classed('showed', true)
            d3.select(this).raise().classed('showed', true)
            d.clicked = true
        }
        update_edge();
    }
    var prefix = Math.random().toString(36).substr(2)
    var dom_edges = svg.selectAll('path')
        .data(edges)
        .enter()
            .append('path')
            .attr('class', function(d) { return d['classes']; })
            .attr('id', function(d, i) { return prefix + i.toString(); })
            .attr('d', function(d, i) {
                var dx = d.target['x'] - d.source['x']
                var dy = d.target['y'] - d.source['y']
                var dh = Math.sqrt(dx * dx + dy * dy)

                var rt = 'M' + (d.source['x']/* + r / dh * dx */) + ',' + (d.source['y']/* + r / dh * dy*/)
                rt += 'Q' + d.controlx + ',' + d.controly + ' '
                rt += (d.target['x'] - r / dh * dx) + ',' + (d.target['y'] - r / dh * dy)
                return rt
            })
            .attr('marker-end', function(d) {
                if (d.target.invisible) return '';
                if (d3.select(this).raise().classed('keyedge')) return 'url(#keyedgearrow)';
                else return 'url(#optionaledgearrow)';
            })
    dom_edges.exit().remove()

    var dom_nodes = svg.selectAll('circle')
        .data(nodes)
        .enter()
            .append('circle')
            .attr('class', function(d) { return d['classes']; })
            .attr('cx', function(d) { return d['x']; })
            .attr('cy', function(d) { return d['y']; })
            .on('click', click_node)
    dom_nodes.exit().remove()

    var dom_nodes_info = svg.selectAll('text.nodeinfo')
        .data(nodes)
        .enter()
            .append('text')
            .attr('class', function(d) { d['info'].dom_ref = this; return d['info']['classes'] })
            .classed('nodeinfo', true)
            .attr('text-anchor', 'end')
            .attr('x', function(d) { return d['x'] - 10; })
            .attr('y', function(d) { return d['y'] + 3; })
            .text(function(d) { return d['info']['text']; })
    dom_nodes_info.exit().remove()
    
    var dom_edges_info = svg.selectAll('text.edgeinfo')
        .data(edges)
        .enter()
            .append('text')
            .attr('class', function(d) { d['info'].dom_ref = this; return d['info']['classes'] })
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .classed('edgeinfo', true)
            .attr('x', function(d, i) {
                var path = document.getElementById(prefix + i.toString())
                var L = path.getTotalLength()
                var rt = path.getPointAtLength(L / 2)
                return rt.x
            })
            .attr('y', function(d, i) {
                var path = document.getElementById(prefix + i.toString())
                var L = path.getTotalLength()
                var rt = path.getPointAtLength(L / 2)
                return rt.y
            })
            .text(function(d) { return d['info']['text']; })
            // .append('textPath')
            //     .attr('xlink:href', function(d, i) {
            //         return '#' + prefix + i.toString();
            //     })
            //     .attr('startOffset', '50%')
            //     .text(function(d) { return d['info']['text']; })
    dom_edges_info.exit().remove()

    dom_edges_info.on('click', function(d) {
        d3.select(this).raise().classed('halfinvisible', function(d) {
            if (d3.select(this).raise().classed('halfinvisible')) { 
                return false;
            }
            // d3.select(d['info'].dom_ref).raise().classed('showed', true)
            return true;
        })
        update_edge()
    })
    update_edge()

    var defs = svg.selectAll('defs')
        .data([0])
        .enter().append('defs')
    defs.exit().remove()
    var marker = defs.selectAll('marker')
        .data([0, 1])
        .enter()
            .append('marker')
            .attr('id', function(d) { 
                if (d == 0) return 'keyedgearrow'; 
                else return 'optionaledgearrow'; 
            })
            .attr('markerWidth', '10')
            .attr('markerHeight', '10')
            .attr('refX', '9')
            .attr('refY', '3')
            .attr('orient', 'auto')
            .attr('markerUnits', 'strokeWidth')

    marker.selectAll('path')
        .data([0, 1])
        .enter()
            .append('path')
            .attr('d', "M0,0 L0,6 L9,3 z")
}