var res = {
    pointArr: [],
    e: null,
    point: null,//pointData:{id:null, x: null, y: null }
    index:0,
    get pos(){
        return {
            x: this.e.clientX - this.imgBox.getBoundingClientRect().left,
            y: this.e.clientY - this.imgBox.getBoundingClientRect().top
        }
    },
    imgBox:document.getElementById("img-box-res"),
    handleEvent: function (evt) {
        this.e = evt || window.event;
        if (this.e.stopPropagation) {
            this.e.stopPropagation();
        } else {
            this.e.cancelBubble = true;
        }     
        if (this.e.target.classList.contains("res-point")) {
            this.delPoint();
        } else if (this.e.target.classList.contains("submitPoint")) {
            this.submit();
        }else {
            this.addPoint();
        }
        console.log("response start");
    },
    addPoint: function () {
        this.point = document.createElement("div");
        this.point.className = "res-point";
        this.index++;
        this.point.innerText = this.index;
        var pointObj = {
            x:this.pos.x,
            y:this.pos.y,
            id: this.index,
            test: false,
            match:null
        };
        this.point.style.left = (this.pos.x-10) + "px";
        this.point.style.top = (this.pos.y - 10) + "px";
        this.point.style.zIndex = this.index;
        this.point.id = "p-" + this.index;
        this.point.innerText = this.index;
        this.point.addEventListener("click",this,true);
        this.pointArr.push(pointObj);
        this.imgBox.appendChild(this.point);
        console.log("addPoint");
        console.log(this.pointArr);
    },
    delPoint: function (evt) {
        this.e = evt || window.event;
        for(var i in this.pointArr){
            if(("p-"+this.pointArr[i].id)==this.e.target.id){
                this.pointArr.splice(i, 1);
                break;
            }
        }
        this.imgBox.removeChild(this.e.target);
        console.log("delPoint");
        console.log(this.pointArr);
    },
    submit: function () {
        if(this.pointArr.length==0){
            alert("no point selected");
            return;
        }
        score.pointArr = this.pointArr;
        //自动评分
        score.mark();
        //这行是额外的；
        testView = true;

    }
}

var score = {
    areaArr: areaArr,
    pointArr: null,
    mark: function () {
        if (this.pointArr && this.pointArr.length > 0) {
            var areas = this.areaArr;
            for (var i in this.pointArr) {
                var point=this.pointArr[i];
                var test = areas.some(function (area, index, areaArr) {
                    var res;
                    if(!area.test){
                        if (area.type) {
                            var t = area.O.y,
                                b = area.O.y + area.size.h,
                                l = area.O.x,
                                r = area.O.x + area.size.w;

                            testX = (point.x <= r && point.x >= l);
                            testY = (point.y <= b && point.y >= t);
                            res = (testX && testY);
                        } else {
                            var r = area.size.w / 2;
                            var cX = area.O.x + r;
                            var cY = area.O.y + r;
                            var d = Math.sqrt(Math.pow(point.x - cX, 2) + Math.pow(point.y - cY, 2));
                            res = (d <= r);
                        }
                        if (res) {
                            point.test = true;
                            area.test = true;
                            point.match = area.id;
                            area.match = point.id;
                        };
                        return res;
                    } else {
                        return false;
                    }
                });
                if (test) {
                    var p = document.createElement("p");
                    p.innerText="点"+point.id+"在区域"+point.match+"内得分:+1";
                    document.getElementById("mark-result").appendChild(p);
                }
            }
        }
    },
    testView: function () {
        var pointArr = score.pointArr;
        for (var i in areaArr) {
            var area = document.createElement("div");
            area.className = (areaArr[i].type)?"area area-rect":"area area-circle";
            area.innerHTML = "<div class='index'>" + area.id + "</div>";
            area.style.left = areaArr[i].O.x + "px";
            area.style.top = areaArr[i].O.y + "px";
            area.style.width = areaArr[i].size.w + "px";
            area.style.height = areaArr[i].size.h + "px";
            area.style.zIndex = (++i);
            imgBoxView.appendChild(area);
        }
        for (var j in pointArr) {
            var point = document.createElement("div");
            point.className = "res-point";
            point.innerText = pointArr[j].id;
            point.style.left = (pointArr[j].x-10) + "px";
            point.style.top = (pointArr[j].y-10) + "px";
            point.style.zIndex = (j+100);
            imgBoxView.appendChild(point);
        }
    }
}

