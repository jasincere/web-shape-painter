

var areaArr = [];

//图形的范围，鼠标的相对位置
var box = {
    get bound() {
        return {
            x: imgBox.offsetWidth,
            y: imgBox.offsetHeight
        }
    },
    pos: function (e) {
        return {
            x: e.clientX - imgBox.getBoundingClientRect().left,
            y: e.clientY - imgBox.getBoundingClientRect().top
        }
    }
}


//图形对象模型
var Area = function (id, type, O, size) {
    this.id = id;
    this.type = parseInt(type); //0 is circle,1 is rectangle;
    this.O = O;
    this.size = size;
    this.getO = function () {
        return {
            x: this.O.x,
            y: this.O.y
        }
    };
    this.test = false;
    this.match = null;
    this.getSize = function () {
        return {
            w: this.size.w,
            h: this.size.h
        }
    };
    this.setO = function (O) {
        if (this.O) { this.O = O; }
    };
    this.setSize = function (size) {
        if (this.size) { this.size = size; }
    };
};




//画图
var draw = {
    type: 0,
    index: 0,
    // box: imgBox,
    start: { x: 0, y: 0 },
    O: { x: 0, y: 0 },
    size: { w: 0, h: 0 },
    area: null,
    valid: false,
    handleEvent: function (evt) {
        var e = evt || window.event;
        this.start.x = box.pos(e).x;
        this.start.y = box.pos(e).y;
        var div = document.createElement("div");
        this.index++;
        div.id = "area-" + this.index;
        var areaType = this.type ? "area-rect" : "area-circle";
        div.className = "area " + areaType;
        div.style.left = this.start.x + "px";
        div.style.top = this.start.y + "px";
        div.style.zIndex = this.index + 1;
        this.area = div;
        imgBox.appendChild(div);
        console.log("draw mousedown");
        document.addEventListener("mousemove", this.mousemove, false);
        document.addEventListener("mouseup", this.mouseup, true);
    },
    mousemove: function (evt) {
        var self = draw;
        //if (self.drawing) {
        var e = evt || window.event;
        var pos = box.pos(e);   //鼠标相对box左上角的坐标
        if (self.type) { //画矩形
            if (!self.outBoundTestX(pos.x)) {
                self.O.x = (self.start.x - pos.x > 0 ? pos.x : self.start.x);
                self.size.w = Math.abs(self.start.x - pos.x);
            } else {
                self.O.x = (self.start.x - pos.x > 0 ? 0 : self.start.x);
                self.size.w = (self.start.x - pos.x > 0 ? self.start.x : box.bound.x - self.start.x);
            }
            if (!self.outBoundTestY(pos.y)) {
                self.O.y = (self.start.y - pos.y > 0 ? pos.y : self.start.y);
                self.size.h = Math.abs(self.start.y - pos.y);
            } else {
                self.O.y = (self.start.y - pos.y > 0 ? 0 : self.start.y);
                self.size.h = (self.start.y - pos.y > 0 ? self.start.y : box.bound.y - self.start.y);
            }
        } else { //画圆
            //计算圆的半径

            var r = Math.max(Math.abs(self.start.x - pos.x), Math.abs(self.start.y - pos.y));
            if (maxR = self.outBoundTestCircle(self.start, r)) {
                r = maxR;
            }
            console.log(maxR);
            self.O.x = self.start.x - r;
            self.O.y = self.start.y - r;
            self.size.w = self.size.h = 2 * r;
        }
        showCoordO(self.O);
        showCoordSize(self.size);
        self.area.style.width = self.size.w + "px";
        self.area.style.height = self.size.h + "px";
        self.area.style.left = self.O.x + "px";
        self.area.style.top = self.O.y + "px";
        self.valid = true;
    },
    mouseup: function (evt) {
        var self = draw;
        var e = evt || window.event;
        if (self.valid) {
            //
            var no=document.createElement("div");
            no.innerText=self.index;
            no.className="index";
            self.area.appendChild(no);
            
            //
            self.minSize(e);
            self.area.addEventListener("click", selected);
            selected.selectArea(self.area);
            var newArea = new Area(self.index, self.type, self.O, self.size);
            areaArr.push(newArea);
            console.log("有效");
        } else {
            imgBox.removeChild(self.area);
        }
        self.clear();
        imgBox.className = "box-edit";
        imgBox.removeEventListener("mousedown", self, true);
        document.removeEventListener("mousemove", self.mousemove, false);
        document.removeEventListener("mouseup", self.mouseup, true);
        console.log("draw mouseup");
        console.log(areaArr);
        showCoordO(newArea.O);
        showCoordSize(newArea.size);
    },
    clear: function () {
        this.start = { x: 0, y: 0 },
        this.O = { x: 0, y: 0 },
        this.size = { w: 0, h: 0 },
        this.area = null;
        this.valid = false;
        console.log("draw clear");
    },
    //最小不能宽高小于50px
    minSize: function (e) {
        if (this.size.w <= 50 && this.size.h <= 50) {
            var pos = box.pos(e);
            this.size.w = 50;
            this.size.h = 50;
            if(self.type){
                this.O.x = (pos.x - this.start.x > 0) ? this.start.x : this.start.x - 50;
                this.O.y = (pos.y - this.start.y > 0) ? this.start.y : this.start.y - 50;
            } else {
                this.O.x = this.start.x - 25;
                this.O.y = this.start.y - 25;
            }
            this.area.style.left = this.O.x + "px";
            this.area.style.top = this.O.y + "px";
            this.area.style.width = this.size.w + "px";
            this.area.style.height = this.size.h + "px";
           
        }
    },
    //横向边界检测
    outBoundTestX: function (x) {
        return (x < 0 || x > box.bound.x) ? true : false;
    },
    //纵向边界检测
    outBoundTestY: function (y) {
        return (y < 0 || y > box.bound.y) ? true : false;
    },
    //圆形碰撞检测
    outBoundTestCircle: function (c, r) {
        var minR = Math.min(c.x, box.bound.x - c.x, c.y, box.bound.y - c.y);
        if (minR < r) return minR;
        else return false;
    }
}

//选中操作
var selected = {
    // selectedId: null,
    selectedObj: null,
    resize: ["lt", "lb", "rt", "rb", "t", "b", "l", "r"],
    handleEvent: function (evt) {
        var e = evt || window.event;
        if (e.target.classList.contains("area") && !e.target.classList.contains("area-selected")) {
            this.selectArea(e.target);
        };
    },
    //选中area，并添加拖动缩放功能
    selectArea: function (obj) {
        this.unselectArea();
        this.selectedObj = obj;
        //  this.selectedId = obj.id;
        this.selectedObj.classList.add("area-selected");
        this.selectedObj.addEventListener("mousedown", drag);
        for (var j = 0; j < 8; j++) {
            var span = document.createElement("span");
            span.className = "r-" + this.resize[j];
            span.addEventListener("mousedown", resize, false);
            this.selectedObj.appendChild(span);
        }

    },
    //取消选中当前选中的area
    unselectArea: function () {
        if (this.selectedObj) {
            this.selectedObj.innerHTML = "";
            //加序号
            var index = this.selectedObj.id.split("-")[1];
            var no = document.createElement("div");
            no.innerText = index;
            no.className = "index";
            this.selectedObj.appendChild(no);
            //
            this.selectedObj.classList.remove("area-selected");
            this.selectedObj.removeEventListener("mousedown", drag);
        }
        console.log("unselect area");
    },
    //删除当前选中的area
    deleteArea: function () {
        if (selected.selectedObj) {
            for (var i in areaArr) {
                if ("area-" + areaArr[i].id == selected.selectedObj.id) {
                    areaArr.splice(i, 1);
                    break;
                }
            }
            console.log(areaArr);
            imgBox.removeChild(selected.selectedObj);
            selected.selectedObj = null;
        } else {
            alert("no selected");
        }
    }

}

//拖动
var drag = {
    arrIndex: 0,
    start: { x: 0, y: 0 },
    oO: { x: 0, y: 0 },
    O: { x: 0, y: 0 },
    oSize: { w: 0, h: 0 },
    area: null,
    valid: false,
    handleEvent: function (evt) {
        var e = evt || window.event;
        this.area = selected.selectedObj || e.target;
        this.start.x = box.pos(e).x;
        this.start.y = box.pos(e).y;
        for (var i in areaArr) {
            if ("area-" + areaArr[i].id == this.area.id) {
                this.oO = areaArr[i].getO();
                this.oSize = areaArr[i].size;
                this.arrIndex = i;
                break;
            }

        }
        document.addEventListener("mousemove", this.mousemove, true);
        document.addEventListener("mouseup", this.mouseup, true);
        console.log("drag mousedown");
    },
    mousemove: function (evt) {
        var self = drag;
        var e = evt || window.event;
        var pos = box.pos(e);
        if (!self.outBoundTestX(pos.x)) {
            self.O.x = self.oO.x + pos.x - self.start.x;
        } else {
            self.O.x = (pos.x - self.start.x > 0) ? box.bound.x - self.oSize.w : 0;
        }
        if (!self.outBoundTestY(pos.y)) {
            self.O.y = self.oO.y + pos.y - self.start.y;
        } else {
            self.O.y = (pos.y - self.start.y > 0) ? box.bound.y - self.oSize.h : 0;
        }
        //console.log("判定对象恒等");
        //console.log(self.oO === areaArr[self.arrIndex].O);
        showCoordO(self.O);
        showCoordSize(self.oSize);
        self.area.style.left = self.O.x + "px";
        self.area.style.top = self.O.y + "px";
        self.valid = true;
        console.log("drag mousemove");
    },
    mouseup: function (evt) {
        var self = drag;
        var e = evt || window.event;
        if (self.valid) {
            console.log("有效");
            areaArr[self.arrIndex].setO(self.O);
        }
        self.clear();
        document.removeEventListener("mousemove", self.mousemove, true);
        document.removeEventListener("mouseup", self.mouseup, true);
        console.log("draw mouseup");
        console.log(areaArr);
        showCoordO(areaArr[self.arrIndex].O);
        showCoordSize(areaArr[self.arrIndex].size);
    },
    clear: function () {
        this.start = { x: 0, y: 0 },
        this.oO = { x: 0, y: 0 };
        this.O = { x: 0, y: 0 },
        this.oSize = { w: 0, h: 0 },
        this.area = null;
        this.valid = false;
        console.log("drag clear");
    },
    //横向边界检测
    outBoundTestX: function (x) {
        return (x - this.start.x + this.oO.x < 0 || x + this.oO.x + this.oSize.w - this.start.x > box.bound.x) ? true : false;
    },
    //纵向边界检测
    outBoundTestY: function (y) {
        return (y - this.start.y + this.oO.y < 0 || y + this.oO.y + this.oSize.h - this.start.y > box.bound.y) ? true : false;
    }
}

//缩放
var resize = {
    arrIndex: 0,
    start: { x: null, y: null },
    O: { x: 0, y: 0 },
    size: { w: 0, h: 0 },
    oO: { x: 0, y: 0 },
    oSize: { w: 0, h: 0 },
    //corner: null,
    area: null,
    r: null,
    valid: false,
    handleEvent: function (evt) {
        var e = evt || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        this.area = selected.selectedObj;
        for (var i in areaArr) {
            if ("area-" + areaArr[i].id == this.area.id) {
                this.oO = areaArr[i].getO();
                this.oSize = areaArr[i].getSize();
                this.O = areaArr[i].O;
                this.size = areaArr[i].size;
                this.type = areaArr[i].type;
                this.arrIndex = i;
                break;
            }
        }
        if (this.type) {
            var rStr = e.target.className.trim().substr(2, 2);
            this.r = rStr.split("");
            this.dir.i = this;
            console.log(this.r);
        } else {
            this.start.x = this.oO.x + this.size.w / 2;
            this.start.y = this.oO.y + this.size.h / 2;
        }
        document.addEventListener("mousemove", this.mousemove, true);
        document.addEventListener("mouseup", this.mouseup, true);
        console.log("resize mousedown");
    },
    mousemove: function (evt) {
        var self = resize;
        var e = evt || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        var pos = box.pos(e);
        //console.log("判定对象恒等");
        //console.log(self.oO === areaArr[self.arrIndex].O);
        if (self.type) {
            for (var i in self.r) {
                self.dir[self.r[i]](pos);
            }
        } else {
            //计算圆的半径
            var r = Math.max(Math.abs(self.start.x - pos.x), Math.abs(self.start.y - pos.y));
            if (maxR = self.outBoundTestCircle(self.start, r)) {
                r = maxR;
            }
            console.log(maxR);
            self.O.x = self.start.x - r;
            self.O.y = self.start.y - r;
            self.size.w = self.size.h = 2 * r;
        }
        showCoordO(self.O);
        showCoordSize(self.size);
        self.area.style.width = self.size.w + "px";
        self.area.style.height = self.size.h + "px";
        self.area.style.left = self.O.x + "px";
        self.area.style.top = self.O.y + "px";
        self.valid = true;
    },
    mouseup: function (evt) {
        var self = resize;
        var e = evt || window.event;
        if (self.valid) {
            self.minSize(e);
            areaArr[self.arrIndex].setO(self.O);
            areaArr[self.arrIndex].setSize(self.size);
            console.log("有效");
        }
        self.clear();
        document.removeEventListener("mousemove", self.mousemove, true);
        document.removeEventListener("mouseup", self.mouseup, true);
        console.log("resize mouseup");
        console.log(areaArr);
        showCoordO(areaArr[self.arrIndex].O);
        showCoordSize(areaArr[self.arrIndex].size);
    },
    clear: function () {
        this.start = { x: null, y: null };
        this.oO = { x: 0, y: 0 };
        this.O = { x: 0, y: 0 };
        this.size = { w: 0, h: 0 };
        this.oSize = { w: 0, h: 0 };
        this.area = null;
        this.arrIndex = 0;
        this.r = null;
        this.valid = false;
        console.log("resize clear");
        console.log(this);
    },
    //最小不能宽高小于50px
    minSize: function (e) {
        if (this.size.w <= 50 && this.size.h <= 50) {
            var pos = box.pos(e);
            this.size.w = 50;
            this.size.h = 50;
            showCoordO(this.start);
            if (self.type) {
                if (this.start.x) {
                    this.O.x = (pos.x - this.start.x > 0) ? this.start.x : this.start.x - 50;
                }
                if (this.start.y) {
                    this.O.y = (pos.y - this.start.y > 0) ? this.start.y : this.start.y - 50;
                } 
            } else {
                this.O.x = this.start.x - 25;
                this.O.y = this.start.y - 25;
            }
            
            this.area.style.left = this.O.x + "px";
            this.area.style.top = this.O.y + "px";
            this.area.style.width = this.size.w + "px";
            this.area.style.height = this.size.h + "px";
        }
    },
    /*
    setCornerCoord: function () {
        this.corner = [
            { x: this.oO.x, y: this.oO.y },
            { x: this.oO.x, y: this.oO.y + this.oSize.h },
            { x: this.oO.x + this.oSize.w, y: this.oO.y + this.oSize.h },
            { x: this.oO.x + this.oSize.w, y: this.oO.y }
        ] //lt,lb,rb,rt
    }*/
    dir: {
        i: null,
        side: {

        },
        t: function (pos) {
            /*var dlt=this.i.outBoundTestX(pos.x)?0:pos.y;*/
            var side = this.i.oO.y + this.i.oSize.h;
            this.i.start.y = side;
            var dltY = pos.y - side;
            if (!this.i.outBoundTestY(pos.y)) {
                this.i.O.y = dltY > 0 ? side : pos.y;
                this.i.size.h = Math.abs(dltY);
            } else {
                this.i.O.y = dltY > 0 ? side : 0;
                this.i.size.h = dltY > 0 ? box.bound.y - side : side;
            }
            console.log("execute t");
        },
        b: function (pos) {
            var side = this.i.oO.y;
            this.i.start.y = side;
            var dltY = pos.y - side;
            if (!this.i.outBoundTestY(pos.y)) {
                this.i.O.y = dltY > 0 ? side : pos.y;
                this.i.size.h = Math.abs(dltY);
            } else {
                this.i.O.y = dltY > 0 ? side : 0;
                this.i.size.h = dltY > 0 ? box.bound.y - side : side;
            }
            // this.i.size.h = Math.abs(pos.y - this.i.oO.y);
            console.log("execute b");
        },
        l: function (pos) {
            var side = this.i.oO.x + this.i.oSize.w;
            this.i.start.x = side;
            var dltX = pos.x - side;
            if (!this.i.outBoundTestX(pos.x)) {
                this.i.O.x = dltX > 0 ? side : pos.x;
                this.i.size.w = Math.abs(dltX);
            } else {
                this.i.O.x = dltX > 0 ? side : 0;
                this.i.size.w = dltX > 0 ? box.bound.x - side : side;
            }
            //this.i.O.x = pos.x;
            //this.i.size.w = Math.abs(pos.x - this.i.oO.x - this.i.oSize.w);
            console.log("execute l");
        },
        r: function (pos) {
            var side = this.i.oO.x;
            this.i.start.x = side;
            var dltX = pos.x - side;
            if (!this.i.outBoundTestX(pos.x)) {
                this.i.O.x = dltX > 0 ? side : pos.x;
                this.i.size.w = Math.abs(dltX);
            } else {
                this.i.O.x = dltX > 0 ? side : 0;
                this.i.size.w = dltX > 0 ? box.bound.x - side : side;
            }
            console.log("execute r");
        }
    },
    //横向边界检测
    outBoundTestX: function (x) {
        return (x < 0 || x > box.bound.x) ? true : false;
    },
    //纵向边界检测
    outBoundTestY: function (y) {
        return (y < 0 || y > box.bound.y) ? true : false;
    },
    //圆形碰撞检测
    outBoundTestCircle: function (c, r) {
        var minR = Math.min(c.x, box.bound.x - c.x, c.y, box.bound.y - c.y);
        if (minR < r) return minR;
        else return false;
    }

}

function showCoordO(O) {
    console.log("位置坐标：(" + O.x + "," + O.y + ")");
}

function showCoordSize(size) {
    console.log("宽高：(" + size.w + "," + size.h + ")");
}