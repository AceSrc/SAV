/* TRIE
*/

function trie_insert(root, s, info) {
    root.info = ''
    root.keypoint = true
    for (var i = 0; i < s.length; i++) {
        if (!root.children[ s[i] ]) root.children[ s[i] ] = {children: {}, info: ''}
        root = root.children[ s[i] ];
        info += s[i]
        root.info = info
    }
    root.keypoint = true
}

function trie_query(root, s) {
    for (var i = 0; i < s.length; i++) {
        root = root.children[ s[i] ];
        if (!root) return null
    }
    while (root.notshow) {
        for (key in root.children) {
            root = root.children[key]
            break
        }
    }
    return root
}

function place_node(root, width, height, border) {
    function recurse(root) {
        var rt = new Array()
        for (var key in root.children) {
            tmp = recurse(root.children[key])
            rt.push(tmp)
        }
        if (rt.length != 0) 
            return {
                'ref': root,
                'children': rt
            }
        else 
            return {
                'ref': root
            }
    }
    data = recurse(root)
    var treeLayout = d3.tree().size([width, height])
    var layout = d3.hierarchy(data)
    treeLayout(layout)

    nodes = layout.descendants()
    for (var i in nodes) {
        nodes[i].data.ref.x = nodes[i].x + border
        nodes[i].data.ref.y = nodes[i].y + border
    }
}

function flatten(root) {
    var rt = []
    function recurse(root) {
        // console.log(root.info)
        rt.push({
            'x': root.x,
            'y': root.y,
            'classes': 'keynode',
            'info': {
                'x': root.x + 10,
                'y': root.y + 10,
                'classes': '',
                'text': root.info
            }
        })
        root.node_ref = rt[rt.length - 1];

        for (var i in root.children) recurse(root.children[i])
    }
    recurse(root)
    return rt
}

function link_trie_edge(root) {
    var rt = []
    var real_root = root
    function recurse(root, s) {
        for (var i in root.children) {
            var p = root.children[i]
            rt.push({
                'source': root.node_ref,
                'target': p.node_ref,
                'classes': 'keyedge constant',
                'controlx': (root.x + p.x) / 2,
                'controly': (root.y + p.y) / 2,
                'info': {
                    'classes': 'keyinfo constant',
                    'x': (root.x + p.x) / 2,
                    'y': (root.y + p.y) / 2,
                    'text': i
                }
            })
            recurse(p, s + i)
        }
        if (s.length != 0) {
            for (var i = 1; i <= s.length; i++) {
                var p = trie_query(real_root, s.substring(i))
                if (s == 'acac') console.log(s.substring(i), p)
                if (p) {
                    var d = Math.sqrt((root.x - p.x) * (root.x - p.x) + (root.y - p.y) * (root.y - p.y))
                    var X = (root.x + p.x) / 2;
                    var Y = (root.y + p.y) / 2;
                    if (s.substring(0, s.length - i) == s.substring(i)) X = (root.x + p.x) / 2 + (root.y - p.y) / 4 + 10, Y = (root.y + p.y) / 2 - (root.x - p.x) / 4 + 10
                    rt.push({
                        'source': root.node_ref,
                        'target': p.node_ref,
                        'classes': 'optionaledge',
                        'controlx': X,//(root.x + p.x) / 2 + (root.y - p.y) / 2 + 10,
                        'controly': Y,//(root.y + p.y) / 2 - (root.x - p.x) / 2 + 10,
                        'info': {
                            'classes': 'keyinfo',
                            'x': (root.x + p.x) / 2,
                            'y': (root.y + p.y) / 2,
                            'text': ''
                        }
                    })
                    break;
                }
            }
        }
    }
    recurse(root, '')
    return rt
}

total_width = 400
total_height = 400
border = 10
width = total_width - 2 * border
height = total_height - 2 * border


// nodes = [
//     {
//         'x': 10,
//         'y': 10,
//         'classes': 'keynode',
//         'info': 
//         {
//             'x': 20,
//             'y': 20,
//             'text': 'keynode1'
//         }
//     },
//     {
//         'x': 100,
//         'y': 100,
//         'classes': 'keynode',
//         'info': 
//         {
//             'x': 90,
//             'y': 90,
//             'text': 'keynode2'
//         }
//     },
// ]

// edges = [
//     {
//         'source': nodes[0],
//         'target': nodes[1],
//         'classes': 'keyedge',
//         'info':
//         {
//             'x': 50,
//             'y': 50,
//             'text': 'keyedge'
//         }
//     }
// ]



// draw(svg1, nodes, edges)

// draw(svg2, nodes, edges)

// draw(svg3, nodes, edges)

// var treeLayout = d3.tree().size([width, height])

// var root = d3.hierarchy(data)

// treeLayout(root)

// svg.selectAll('line.link')
//     .data(root.links())
//     .enter()
//     .append('line')
//     .classed('link', true)
//     .attr('x1', function(d) {return d.source.x;})
//     .attr('y1', function(d) {return d.source.y;})
//     .attr('x2', function(d) {return d.target.x;})
//     .attr('y2', function(d) {return d.target.y;});


// var node = svg.selectAll("circle")
//             .data(root.descendants())
//             .enter()
//                 .append('circle')

// node.attr('r', 10)
//     .attr('cx', function(d) { return d.x; })
//     .attr('cy', function(d) { return d.y; })
//     .classed('keynode', true)
//     .on('click', function(d) {
//         d3.select(this).raise().attr('color', 'red')
//     })
    // .call(d3.drag()
    //     .on('start', dragstarted)
    //     .on('drag', dragged)
    //     .on('end', dragended))

// function dragstarted(d) { 
//     d3.select(this).raise().attr("stroke", "black");
// }

// function dragged(d) {
//     d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
// }

// function dragended(d) {
//     d3.select(this).attr("stroke", null);
// }



//   // Nodes
//   d3.select('svg g.nodes')
//     .selectAll('circle.node')
//     .data(root.descendants())
//     .enter()
//     .append('circle')
//     .classed('node', true)
//     .attr('cx', function(d) {return d.x;})
//     .attr('cy', function(d) {return d.y;})
//     .attr('r', 4);
  