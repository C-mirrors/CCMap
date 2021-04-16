
var scale = {
    x: 200,
    y: 60
}
var nodeSize = {
    width: 100,
    height: 50
}

module.exports.treePre = function (data, width, height) {
    console.log()
    var treeObj = data;
    computePos(treeObj);
    return treeObj;
}


function computePos(node) {
    if (node.children) {
        if (node.data.id == "root")
            node.pos = {
                x: 0,
                y: 0,
                line: ""
            }
        for (var i in node.children) {
            node.children[i].pos = {
                x: node.pos.x + scale.x,
                y: node.pos.y + (i - node.children.length / 2) * scale.y,
                line: "M" +
                    (node.pos.x + nodeSize.width) +
                    "   " +
                    (node.pos.y + nodeSize.height / 2) +
                    " C" +
                    (node.pos.x + scale.x / 2 + nodeSize.width / 2) +
                    "," +
                    (node.pos.y + nodeSize.height / 2) +
                    " " +
                    (node.pos.x + scale.x / 2 + nodeSize.width / 2) +
                    "," +
                    (node.pos.y + (i - node.children.length / 2) * scale.y + nodeSize.height / 2) +
                    " " +
                    (node.pos.x + scale.x) +
                    "," +
                    (node.pos.y + (i - node.children.length / 2) * scale.y + nodeSize.height / 2)
            }
            computePos(node.children[i]);
        }
    }
}