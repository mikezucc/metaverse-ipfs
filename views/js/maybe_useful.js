/*
// for monolithic infrastructure
function deleteObjectCallback(event) {
  event = event || window.event;
  var input = event.target || event.srcElement;
  console.log("requesting deletion of " + input.id + " with new value: " + input.value);
  var splitString = input.id.split(" "); // space delim !!!
  var updateTarget = splitString[1];
  var elementInQuestion = document.getElementById(updateTarget);
  document.querySelector('a-scene').removeChild(elementInQuestion);
  var data = new FormData();
  data.append('block', currentBlock);
  data.append('name',updateTarget);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      // socket.emit('model-declared', { 'mememodel': updateTarget, 'memeperp': socket.id });
    }
  }
  // xmlHttp.open("POST","/delete-object", true);
  // xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // xmlHttp.send(data);
  // xmlHttp.send("block="+currentBlock+"&name="+updateTarget);
}

function objectChangeCallback(event) {
  event = event || window.event;
  var input = event.target || event.srcElement;
  console.log("adjusting properties of " + input.id + " with new value: " + input.value);
  var splitString = input.id.split(" "); // space delim !!!
  var updateType = splitString[0];
  var updateTarget = splitString[1];
  var elementInQuestion = document.getElementById(updateTarget);
  if (updateType == "pos") {
    elementInQuestion.setAttribute('position', input.value);
  }
  if (updateType == "rot") {
    elementInQuestion.setAttribute('rotation', input.value);
  }
  if (updateType == "sca") {
    elementInQuestion.setAttribute('scale', input.value);
  }
  var data = new FormData();
  data.append('block', currentBlock);
  data.append('name',updateTarget);
  data.append('updateType', updateType);
  data.append('value', input.value);
  var newValue = input.value;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      socket.emit('model-updated', { 'mememodel': updateTarget, 'memeperp': socket.id, 'updateType':updateType, 'value':newValue});
    }
  }
  // xmlHttp.open("POST","/update-property", true);
  // xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // xmlHttp.send(data);
  // xmlHttp.send("block="+currentBlock+"&name="+updateTarget+"&updateType="+updateType+"&value="+input.value);
}

document.getElementById('editblock').addEventListener('click',function() {
  var adjusterDiv = document.getElementById('elementBrowser');
  var allUserCreatedElements = document.getElementsByClassName('userprovided');
  console.log("edit block items");
  console.log(allUserCreatedElements);
  while (adjusterDiv.firstChild) {
    adjusterDiv.removeChild(adjusterDiv.firstChild);
  }
  if (adjusterDiv.style.display === "none") {
    adjusterDiv.style.display = "block";
    document.getElementById('editblock').innerHTML = "Hide Block Editor";
  } else {
    adjusterDiv.style.display = "none";
    document.getElementById('editblock').innerHTML = "Open Block Editor";
  }
  var titleH = document.createElement('h3');
  titleH.innerHTML = "Modify basic attributes of the user provided objects";
  adjusterDiv.appendChild(titleH);
  for (i = 0; i < allUserCreatedElements.length; i++) {
    var element = allUserCreatedElements[i];
    var humanReadableDescription = element.id;// + " " + element.getAttribute('obj-model').obj + " " + element.getAttribute('obj-model').mtl;
    var existingPosition = element.getAttribute('position');
    var existingRotation = element.getAttribute('rotation');
    var existingScale = element.getAttribute('scale');
    var modifyElement;
    if (existingPosition != null) {
      modifyElement = document.createElement('div');
      var humanReadableParagraph = document.createElement('p');
      humanReadableParagraph.setAttribute('color', 'white');
      humanReadableParagraph.innerHTML = humanReadableDescription;
      var positionValueAdjuster = document.createElement('input');
      positionValueAdjuster.setAttribute('class','object-adjuster');
      // SPACE LIMITED
      positionValueAdjuster.id = 'pos ' + element.id; // random bullshit here to ref later in callback
      positionValueAdjuster.setAttribute('type', 'text');
      positionValueAdjuster.setAttribute('value', existingPosition.x.toString() + " " + existingPosition.y.toString() + " " + existingPosition.z.toString());
      var rotationValueAdjuster = document.createElement('input');
      rotationValueAdjuster.setAttribute('class','object-adjuster');
      rotationValueAdjuster.id = 'rot ' + element.id; // random bullshit here to ref later in callback
      rotationValueAdjuster.setAttribute('type', 'text');
      rotationValueAdjuster.setAttribute('value', existingRotation.x.toString() + " " + existingRotation.y.toString() + " " + existingRotation.z.toString());
      var scaleValueAdjuster = document.createElement('input');
      scaleValueAdjuster.setAttribute('class','object-adjuster');
      scaleValueAdjuster.id = 'sca ' + element.id; // random bullshit here to ref later in callback
      scaleValueAdjuster.setAttribute('type', 'text');
      scaleValueAdjuster.setAttribute('value', existingScale.x.toString() + " " + existingScale.y.toString() + " " + existingScale.z.toString());
      var deleteButton = document.createElement('button');
      deleteButton.id = "delete " + element.id;
      deleteButton.innerHTML = "Delete";
      modifyElement.appendChild(humanReadableParagraph);
      humanReadableParagraph.appendChild(deleteButton);
      modifyElement.appendChild(positionValueAdjuster);
      modifyElement.appendChild(rotationValueAdjuster);
      modifyElement.appendChild(scaleValueAdjuster);
      positionValueAdjuster.addEventListener('input', objectChangeCallback);
      rotationValueAdjuster.addEventListener('input', objectChangeCallback);
      scaleValueAdjuster.addEventListener('input', objectChangeCallback);
      deleteButton.addEventListener('click', deleteObjectCallback);
      adjusterDiv.appendChild(modifyElement);
    }
  }
});
}

function fetchBlocksObjects(blockName) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      console.log(xmlHttp.responseText);
      var response = JSON.parse(xmlHttp.responseText);
      var objects = response["objects"];
      var allUserCreatedElements = document.getElementsByClassName('userprovided');
      var counter = 0;
      while (counter < allUserCreatedElements.length) {
        var existingElement = allUserCreatedElements[counter];
        var found = false;
        for (var i = 0; i < objects.length; i++) {
          var testObject = objects[i];
          if (existingElement.id === testObject["name"]) {
            found = true;
          }
          // remove because no longer in database
        }
        if (found == false) {
          document.querySelector('a-scene').removeChild(existingElement);
        } else {
          counter += 1;
        }
        allUserCreatedElements = document.getElementsByClassName('userprovided');
      }

      for (i=0;i<objects.length;i++) {
        var object = objects[i];
        var objectName = object["name"];
        var objectProperties = object["properties"];
        var file1URL = objectProperties["file1"];
        var file1URLFull = "assets/" + file1URL;
        var file2URL = objectProperties["file2"];
        var file2URLFulll;
        if (file2URL != null){
          file2URLFull = "assets/" + file2URL;
        }
        var newUserObject = document.getElementById(objectName);
        var existed = true;
        if (newUserObject == null) {
          existed = false;
          newUserObject = document.createElement('a-entity');
          newUserObject.id = objectName;
          newUserObject.setAttribute('class', 'userprovided');
          newUserObject.setAttribute('static-body',true);
          if (objectProperties["type"] === "obj") {
            newUserObject.setAttribute('obj-model', {obj: "url(" + file1URLFull +")",  "mtl": "url(" + file2URLFull +")"});
          } else if (objectProperties["type"] === "ply") {
            newUserObject.setAttribute('ply-model', {src: "url(" + file1URLFull +")"});
          }
        }
        var position = objectProperties["position"] || {"x":0,"y":0,"z":0};
        var rotation = objectProperties["rotation"] || {"x":0,"y":0,"z":0};
        var scale = objectProperties["scale"] || {"x":1,"y":1,"z":1};
        newUserObject.setAttribute('position', position);
        newUserObject.setAttribute('rotation', rotation);
        newUserObject.setAttribute('scale', scale);
        if (existed == false) {
          var sceneEl = document.querySelector("a-scene");
          sceneEl.appendChild(newUserObject);
        }
      }
    }
  }
  xmlHttp.open("GET","/blocks?block="+blockName, true);
  xmlHttp.send(null);
}

setTimeout(function() {
  fetchBlocksObjects("starterplace");
}, 2000);

document.getElementById('uploadFileButtonToggle').addEventListener('click',function() {
  //action="/add-asset" method="POST" enctype="multipart/form-data"
  var pseudoForm = document.getElementById('uploadFileFields');
  console.log(pseudoForm.style.display);
  if (pseudoForm.style.display === "none") {
    pseudoForm.style.display = "block";
    document.getElementById('uploadFileButtonToggle').innerHTML = "Hide Uploader";
  } else {
    pseudoForm.style.display = "none";
    document.getElementById('uploadFileButtonToggle').innerHTML = "Open Block Uploader";
  }
});

document.getElementById('uploadFileButton').addEventListener('click',function() {
  var formData = new FormData();

  formData.append('file1',document.getElementById('uploaderProperty1').files[0]);
  formData.append('file2',document.getElementById('uploaderProperty2').files[0]);
  var additionalFiles = document.getElementsByClassName('assetinput');
  for (var i = 0; i < additionalFiles.length; i++) {
    var fileElement = additionalFiles[i];
    if (fileElement.files.length == 0) { continue; }
    formData.append('file'+(i+2).toString(),fileElement.files[0]);
  }
  console.log(formData);
  document.getElementById('uploadFileButton').innerHTML = "Uploading...";
  document.getElementById('uploadFileButton').disabled = true;
  $.ajax({
    url: '/add-asset',
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function(data){
        console.log('upload successful!\n' + data);
        document.getElementById('uploadFileButton').innerHTML = "Insert Object";
        document.getElementById('uploadFileButton').disabled = false;
        fetchBlocksObjects("starterplace");
        socket.emit('model-created', { 'memeperp': socket.id});
        if (document.getElementById('uploadFileFields').style.display === "block") {
          document.getElementById('uploadFileFields').style.display = "none";
        }
    }
  });
});
*/
