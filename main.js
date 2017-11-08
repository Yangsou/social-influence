// function init(){
//   console.log('load');
// }


(function(){
  var xmlhttp, xmlTxt, xmlResult, parser, txtResult = '', arrayAuthor = [];

  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.open("GET","/result/xmlInput.txt",false);
  xmlhttp.send();

  xmlTxt = xmlhttp.responseText;

  parser = new DOMParser();
  xmlResult = parser.parseFromString(xmlTxt,"text/xml");

  var entryNode = xmlResult.getElementsByTagName('entry');
  // console.log('entryNode', entryNode);
  for ( var i = 0; i < entryNode.length; i++ ){
    var author = entryNode[i].getElementsByTagName('author');

    var arrayTxt = [];
    for( var j = 0; j < author.length; j++ ){
      var authorName = author[j].getElementsByTagName('name')[0];
      if( j === author.length - 1 ){
        txtResult += authorName.textContent;
      }else{
        txtResult += authorName.textContent + ', ';
      }
      //push to arrayAuthor
      arrayTxt.push(authorName.textContent);
    }
    txtResult += '\n';
    arrayAuthor.push(arrayTxt);
  }
  // console.log('arrayAuthor', arrayAuthor);
  // save data text crawled into data.txt
  saveData(txtResult);

  var date = new Date();
  console.log('start', date.getSeconds());
  // convert data text to arrayAuthor
  var arrayObjectAuthor = convertToObject(arrayAuthor);
  // console.log('arrayObjectAuthor', arrayObjectAuthor);

  //export nodes
  var nodes = exportNodes(xmlResult);
  // console.log('nodes', nodes);

  //export edges
  var edges = exportEdges(arrayObjectAuthor);
  // console.log('arrayEdges', edges);

  // draw graph
  draw(nodes, edges);
  var dateFinish = new Date();
  console.log('finish', dateFinish.getSeconds());
})()

function saveData(txtResult){
  // console.log('txtResult', txtResult);
  var formData  = new FormData();
  formData.append('text', txtResult);

  fetch('/api/save-data', {
    method: 'POST',
    body: formData
  })
}

function convertToObject(arrayAuthor){
  var arrayAuthorConvert = [];
  arrayAuthor.forEach( function(author, index){
      var authorPrimary = author[0];
      var authorObj = {
        name: authorPrimary,
        connect: []
      }
      for( var i = 1; i < author.length; i++ ){
        // console.log('author', author[i]);
        var connectItem = {
          to: author[i],
          influ: 0.1
        }
        authorObj.connect.push(connectItem);
      }
      arrayAuthorConvert.push(authorObj)
  })
  // console.log('arrayAuthorConvert before', arrayAuthorConvert);
  for( let i = 0; i < arrayAuthorConvert.length - 1; i++ ){
    for( let j = i+1; j < arrayAuthorConvert.length; j++ ){
      if(arrayAuthorConvert[i].name == arrayAuthorConvert[j].name){
        let arr_i = arrayAuthorConvert[i].connect;
        let arr_j = arrayAuthorConvert[j].connect;
        // console.log(arr_i);
        // console.log(arr_j);
        for( let m = 0; m < arr_i.length; m++ ){
          for( let n = 0; n < arr_j.length; n++ ){
              if( arr_i[m].to == arr_j[n].to){

                // console.log(arr_j[n].to);
                arr_i[m].influ = arr_i[m].influ + arr_j[n].influ;
                // console.log(arr_j[n].to, arr_j[n].influ);
                arr_j.splice(n, 1);
              }
          }
        }
        // console.log(i, arr_i);
        arr_i = arr_i.concat(arr_j);
        arrayAuthorConvert[i].connect = arr_i;
        // console.log(i, arr_i);
        // console.log(j, arr_j);
        arrayAuthorConvert.splice(j, 1);
        // console.log(j, arr_j);
      }
    }
  }
  // console.log('arrayAuthorConvert after', arrayAuthorConvert);
  return arrayAuthorConvert;
}

function exportNodes(xml){
  var arrayNodes = [];
  var xmlAuthor = xml.getElementsByTagName('author');
  // console.log('xmlResult', xmlAuthor);

  for( let i = 0; i < xmlAuthor.length; i++ ){
    let name = xmlAuthor[i].getElementsByTagName('name')[0].textContent;
    // console.log('name   ', name);
    let author = {
      data: {
        id: name
      }
    }
    arrayNodes.push(author);
  }
  // for( let i = 0; i < arrayObjectAuthor.length; i++ ){
  //   let author = { data: {totalInflu: 0} };
  //   let authorConnect = arrayObjectAuthor[i].connect;
  //   author.data.name = arrayObjectAuthor[i].name;
  //   author.data.id = arrayObjectAuthor[i].name;
  //   for( let j = 0; j < authorConnect.length; j++ ){
  //     author.data.totalInflu = author.data.totalInflu + authorConnect[j].influ;
  //   }
  //   arrayNodes.push(author);
  // }
  for( let i = 0; i < arrayNodes.length - 1; i++ ){
    for( let j = i+1; j < arrayNodes.length; j++ ){
      if( arrayNodes[i].data.id == arrayNodes[j].data.id ){
        arrayNodes.splice(j, 1);
      }
    }
  }
  return arrayNodes;
}

function exportEdges(arrayObjectAuthor){
  var arrayEdges = [];
  for( let i = 0; i < arrayObjectAuthor.length; i++ ){
    let connect = arrayObjectAuthor[i].connect;
    for( let j = 0; j < connect.length; j ++ ){
      let edge = {};
      edge.data = {
        source: arrayObjectAuthor[i].name,
        target: connect[j].to
      }
      arrayEdges.push(edge);
    }
  }

  return arrayEdges;
}

function draw(nodes, edges){
  // nodes = nodes.splice(0, 10);
  // console.log('nodes', nodes);
  var cy = cytoscape({
    container: document.getElementById('cy'),

    boxSelectionEnabled: false,
    autounselectify: true,

    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'content': 'data(id)'
        })
      .selector('edge')
        .css({
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'width': 4,
          'line-color': '#ddd',
          'target-arrow-color': '#ddd'
        })
      .selector('.highlighted')
        .css({
          'background-color': '#61bffc',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
        }),

    elements: {
        nodes: nodes,

        edges: edges
        // [
        //   { data: { source: 'Saeed Haji Seyed Javadi', target: 'Pedram Gharani' } },
        //   { data: { source: 'Saeed Haji Seyed Javadi', target: 'Shahram Khadivi' } },
        //   { data: { source: 'Stanisław Saganowski', target: 'Piotr Bródka' } },
        //   { data: { source: 'Stanisław Saganowski', target: 'Przemysław Kazienko' } },
        //   { data: { source: 'Stanisław Saganowski', target: 'Michał Koziarski' } },
        //   { data: { source: 'Anisa Halimi', target: 'Erman Ayday' } }
        // ]
      },

    layout: {
      // name: 'concentric',
      name: 'cose',
      directed: true,
      roots: '#a',
      padding: 10,
      fit: true
    }
  });

  var bfs = cy.elements().bfs('#a', function(){}, true);

  // var i = 0;
  // var highlightNextEle = function(){
  //   if( i < bfs.path.length ){
  //     bfs.path[i].addClass('highlighted');
  //
  //     i++;
  //     setTimeout(highlightNextEle, 1000);
  //   }
  // };
  //
  // // kick off first highlight
  // console.log(this, highlightNextEle());

}
