function QuestionShapeController(imgBox) {
    var self = this;
    this.e = null;
    this.start = { x: null, y: null };
    this.O = { x: null, y: null };
    this.size = { w: null, h: null };
    this.oO = { x: null, y: null };
    this.oSize = { w: null, h: null };
    this.type = 0;
    this.area = null;
    this.valid = false;
    this.areaIndex = 0;
    this.imgBox = imgBox;
    this.bound = {
        get x() { return self.imgBox.offsetWidth },
        get y() { return self.imgBox.offsetHeight }
    };
    this.pos = {
        get x() {
            return self.e.clientX - self.imgBox.getBoundingClientRect().left;
        },
        get y() {
            return self.e.clientY - self.imgBox.getBoundingClientRect().top;
        }
    }

    this.clear = function () {
        this.start = { x: null, y: null };
        this.O = { x: null, y: null };
        this.size = { w: null, h: null };
        this.oO = { x: null, y: null };
        this.oSize = { w: null, h: null };
        this.rDir = null;
        this.valid = false;
    };
    this.minSize = function () {
        if (this.size.w < 10) {
            if (this.type) {
                if (this.start.x) {
                this.O.x = (this.pos.x - this.start.x > 0) ? this.start.x : this.start.x - 10;
                }
            } else {
                this.O.x = this.start.x - 5;
            }
            this.size.w = 10;
        }
        if (this.size.h<10) {
            if (this.type) {
                if (this.start.y) {
                    this.O.y = (this.pos.y - this.start.y > 0) ? this.start.y : this.start.y - 10;
                }
            } else {
                this.O.y = this.start.y - 5;
            }
            this.size.h = 10;
        }
    };
    this.show = function () {
        this.area.style.left = this.O.x + "px";
        this.area.style.top = this.O.y + "px";
        this.area.style.width = this.size.w + "px";
        this.area.style.height = this.size.h + "px";
    };
    this.dir = {
        t: function () {
            var side = self.oO.y + self.oSize.h;
            self.start.y = side;
            var dltY = self.pos.y - side;
            if (!self.outBoundTestY(self.pos.y)) {
                self.O.y = dltY > 0 ? side : self.pos.y;
                self.size.h = Math.abs(dltY);
            } else {
                self.O.y = dltY > 0 ? side : 0;
                self.size.h = dltY > 0 ? self.bound.y - side : side;
            }
        },
        b: function () {
            var side = self.oO.y;
            self.start.y = side;
            var dltY = self.pos.y - side;
            if (!self.outBoundTestY(self.pos.y)) {
                self.O.y = dltY > 0 ? side : self.pos.y;
                self.size.h = Math.abs(dltY);
            } else {
                self.O.y = dltY > 0 ? side : 0;
                self.size.h = dltY > 0 ? self.bound.y - side : side;
            }
        },
        l: function () {
            var side = self.oO.x + self.oSize.w;
            self.start.x = side;
            var dltX = self.pos.x - side;
            if (!self.outBoundTestX(self.pos.x)) {
                self.O.x = dltX > 0 ? side : self.pos.x;
                self.size.w = Math.abs(dltX);
            } else {
                self.O.x = dltX > 0 ? side : 0;
                self.size.w = dltX > 0 ? self.bound.x - side : side;
            }

        },
        r: function () {
            var side = self.oO.x;
            self.start.x = side;
            var dltX = self.pos.x - side;
            if (!self.outBoundTestX(self.pos.x)) {
                self.O.x = dltX > 0 ? side : self.pos.x;
                self.size.w = Math.abs(dltX);
            } else {
                self.O.x = dltX > 0 ? side : 0;
                self.size.w = dltX > 0 ? self.bound.x - side : side;
            }

        }
    };
    this.outBoundTestX = function (x) {
        return (x < 0 || x > this.bound.x) ? true : false;
    };
    this.outBoundTestY = function (y) {
        return (y < 0 || y > this.bound.y) ? true : false;
    };
    this.outBoundTestDragX = function (x) {
        return (x - this.start.x + this.oO.x < 0 || x + this.oO.x + this.oSize.w - this.start.x > this.bound.x) ? true : false;
    };
    this.outBoundTestDragY = function (y) {
        return (y - this.start.y + this.oO.y < 0 || y + this.oO.y + this.oSize.h - this.start.y > this.bound.y) ? true : false;
    };
    this.outBoundTestCircle = function (c, r) {
        var minR = Math.min(c.x, this.bound.x - c.x, c.y, this.bound.y - c.y);
        if (minR < r) return minR;
        else return false;
    };
    this.handleEvent = function (evt) {
        this.e = evt || window.event;
        switch (this.e.type) {
            case "mousedown":
                this.mousedown();
                break;
            case "mousemove":
                this.mousemove();
                break;
            case "mouseup":
                this.mouseup();
                break;
        }
    };
}

var QuestionDraw = function (imgBox, select) {
    QuestionShapeController.call(this, imgBox);
    this.mousedown = function () {
        this.start.x = this.pos.x;
        this.start.y = this.pos.y;
        this.area = document.createElement("div");
        this.areaIndex++;
        this.area.id = "area-" + this.areaIndex;
        var areaType = this.type ? "area-rect" : "area-circle";
        this.area.className = "area " + areaType;
        this.area.style.left = this.start.x + "px";
        this.area.style.top = this.start.y + "px";
        this.area.style.zIndex = this.areaIndex;
        this.imgBox.appendChild(this.area);
        document.addEventListener("mousemove", this, false);
        document.addEventListener("mouseup", this, true);
    };
    this.mousemove = function () {
        if (this.type) {
            if (!this.outBoundTestX(this.pos.x)) {
                this.O.x = (this.start.x - this.pos.x > 0 ? this.pos.x : this.start.x);
                this.size.w = Math.abs(this.start.x - this.pos.x);
            } else {
                this.O.x = (this.start.x - this.pos.x > 0 ? 0 : this.start.x);
                this.size.w = (this.start.x - this.pos.x > 0 ? this.start.x : this.bound.x - this.start.x);
            }
            if (!this.outBoundTestY(this.pos.y)) {
                this.O.y = (this.start.y - this.pos.y > 0 ? this.pos.y : this.start.y);
                this.size.h = Math.abs(this.start.y - this.pos.y);
            } else {
                this.O.y = (this.start.y - this.pos.y > 0 ? 0 : this.start.y);
                this.size.h = (this.start.y - this.pos.y > 0 ? this.start.y : this.bound.y - this.start.y);
            }
        } else {
            var maxR;
            var r = Math.max(Math.abs(this.start.x - this.pos.x), Math.abs(this.start.y - this.pos.y));
            if (maxR = this.outBoundTestCircle(this.start, r)) {
                r = maxR;
            }
            this.O.x = this.start.x - r;
            this.O.y = this.start.y - r;
            this.size.w = this.size.h = 2 * r;
        }
        this.show();
        this.valid = true;
    }
    this.mouseup = function () {
        if (this.valid) {
            this.minSize();
            this.show();
            select.selectArea(this.area);
            this.area.addEventListener("click", select);
            this.area.classList.add("area-selected");
        } else {
            this.imgBox.removeChild(this.area);
        }
        this.clear();
        this.imgBox.className = "box-edit";
        this.imgBox.removeEventListener("mousedown", this, true);
        document.removeEventListener("mousemove", this, false);
        document.removeEventListener("mouseup", this, true);
    }
}

var QuestionDrag = function (imgBox) {
    QuestionShapeController.call(this, imgBox);
    this.index = 0;
    this.mousedown = function () {
        this.area = this.area || this.e.target;
        this.start.x = this.pos.x;
        this.start.y = this.pos.y;
        this.oO = {
            x: this.area.offsetLeft,
            y: this.area.offsetTop
        };
        this.oSize = {
            w: this.area.offsetWidth,
            h: this.area.offsetHeight
        }
        this.type = this.area.classList.contains("area-rect");
        document.addEventListener("mousemove", this, true);
        document.addEventListener("mouseup", this, true);
    };
    this.mousemove = function () {
        if (!this.outBoundTestDragX(this.pos.x)) {
            this.O.x = this.oO.x + this.pos.x - this.start.x;
        } else {
            this.O.x = (this.pos.x - this.start.x > 0) ? this.bound.x - this.oSize.w : 0;
        }
        if (!this.outBoundTestDragY(this.pos.y)) {
            this.O.y = this.oO.y + this.pos.y - this.start.y;
        } else {
            this.O.y = (this.pos.y - this.start.y > 0) ? this.bound.y - this.oSize.h : 0;
        }
        this.show();
    }
    this.mouseup = function () {
        this.clear();
        document.removeEventListener("mousemove", this, true);
        document.removeEventListener("mouseup", this, true);
    }
};

var QuestionResize = function (imgBox) {
    QuestionShapeController.call(this, imgBox);
    var rDir;
    this.mousedown = function () {
        if (this.e.stopPropagation) {
            this.e.stopPropagation();
        } else {
            this.e.cancelBubble = true;
        }
        this.oO = {
            x: this.area.offsetLeft,
            y: this.area.offsetTop
        };
        this.oSize = {
            w: this.area.offsetWidth,
            h: this.area.offsetHeight
        }
        this.size = {
            w: this.area.offsetWidth,
            h: this.area.offsetHeight
        }
        this.type = this.area.classList.contains("area-rect");
        if (this.type) {
            var rStr = this.e.target.className.trim().substr(2, 2);
            rDir = rStr.split("");
        } else {
            this.start.x = this.oO.x + this.oSize.w / 2;
            this.start.y = this.oO.y + this.oSize.h / 2;
        }
        document.addEventListener("mousemove", this, true);
        document.addEventListener("mouseup", this, true);
    }
    this.mousemove = function () {
        if (this.e.stopPropagation) {
            this.e.stopPropagation();
        } else {
            this.e.cancelBubble = true;
        }
        if (this.type) {
            for (var i in rDir) {
                this.dir[rDir[i]]();
            }
        } else {
            var r = Math.max(Math.abs(this.start.x - this.pos.x), Math.abs(this.start.y - this.pos.y));
            if (maxR = this.outBoundTestCircle(this.start, r)) {
                r = maxR;
            }
            this.O.x = this.start.x - r;
            this.O.y = this.start.y - r;
            this.size.w = this.size.h = 2 * r;
        }
        this.show();
        this.valid = true;

    };
    this.mouseup = function () {
        if (this.valid) {
            this.minSize();
            this.show();
        }
        this.clear();
        document.removeEventListener("mousemove", this, true);
        document.removeEventListener("mouseup", this, true);
    }
}

var QuestionSelect = function (drag, resize) {
    var r = ["lt", "lb", "rt", "rb", "t", "b", "l", "r"];
    this.area = null;
    this.handleEvent = function (evt) {
        var e = evt || window.event;
        if (e.target.classList.contains("area") && !e.target.classList.contains("area-selected")) {
            this.selectArea(e.target);
        };
    };
    this.selectArea = function (obj) {
        this.unselectArea();
        this.area = obj;
        obj.classList.add("area-selected");
        drag.area = this.area;
        resize.area = this.area;
        this.area.addEventListener("mousedown", drag);
        for (var j = 0; j < 8; j++) {
            var span = document.createElement("span");
            span.className = "r-" + r[j];
            span.addEventListener("mousedown", resize, false);
            obj.appendChild(span);

        };
        drag.imgBox.parentNode.previousElementSibling.lastElementChild.removeAttribute("disabled");
    };
    this.unselectArea = function () {
        if (this.area) {
            this.area.innerHTML = "";
            this.area.classList.remove("area-selected");
            this.area.removeEventListener("mousedown", drag);
            this.area = null;
            drag.imgBox.parentNode.previousElementSibling.lastElementChild.setAttribute("disabled", "disabled");
        }
    };
}

var QuestionShape = function (imgBox) {
    var drag = new QuestionDrag(imgBox);
    var resize = new QuestionResize(imgBox);
    var select = new QuestionSelect(drag, resize);
    var draw = new QuestionDraw(imgBox, select);
    return {
        draw: draw,
        select: select
    }
}













