var applicArray = null;
var applicUL = null;

// 判断是否在数组里
function inArray(arr, item) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == item) {
            return true;
        }
    }
    return false;
}
// 删除数据
function remove(ind, names) {
    var i;
    for (i = 0; i < applicArray.length; i++) {
        if (applicArray[i].id == ind) {
            applicArray.splice(i, 1);
        }
    }
    var s = document.getElementById(applicUL);
    var t = s.childNodes;
    for (i = 0; i < t.length; i++) {
        if (t[i].id == ind) {
            s.removeChild(s.childNodes[i]);
        }
    }
}

// 选中时
function getCheck(ind, names) {
    if (inArray(applicArray, ind)) {
        remove(ind, names);
    } else {
        applicArray.unshift({
            id: ind,
            label: names
        });
        var li = '<li id="' + ind + '" class="checkboxli">' + names + '<a style="cursor:pointer;" onclick="remove(' + (ind) + ',\'' + names + '\')">X</a></li>';
        $('#' + applicUL).append(li);
    }
}

// 初始化下拉内容
function ContentMethod(origArray, kindOpt) {
    var str = '';
    for (var i = 0; i < kindOpt.length; i++) {
        if (origArray && inArray(origArray, kindOpt[i].id)) {
            str += '<input type="checkbox" id="checkboxname' + i + '" checked="checked" onclick="remove(' + kindOpt[i].id + ',\'' + kindOpt[i].label + '\')" value="' + kindOpt[i].id + '">' + kindOpt[i].label + '</br>';
        } else {
            str += '<input type="checkbox" id="checkboxname' + i + '" onclick="getCheck(' + kindOpt[i].id + ',\'' + kindOpt[i].label + '\')" value="' + kindOpt[i].id + '">' + kindOpt[i].label + '</br>';
        }
    }
    applicArray = origArray;
    return str;
}

// 初始化数据项及下拉框
function initOrig(origArray, vehicleOptions, ul) {
    // 下拉框方法
    // $("#"+ul).popover({
    //    trigger: 'click',
    //    placement: 'left', //top, bottom, left or right
    //    html: 'true',
    //    content:function(){ return ContentMethod(origArray,vehicleOptions)}
    // });
    ContentMethod(origArray, vehicleOptions);
    applicUL = ul;
    if (origArray) {
        for (var j = 0; j < origArray.length; j++) {
            var li = '<li id="' + origArray[j].id + '" class="checkboxli">' + origArray[j].label + '<a onclick="remove(' + (origArray[j].id) + ',\'' + origArray[j].label + '\')">X</a></li>';
            $('#' + ul).append(li);
        }
        applicArray = origArray;
    }
}

function initdiv(ul) {
    applicUL = ul;
}

// 返回最终结果
function getEndArray() {
    return applicArray;
}
