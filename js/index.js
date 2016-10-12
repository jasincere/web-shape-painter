
    var boxWidth=800,boxHeight=500;
    var boxRatio = boxWidth / boxHeight;
    document.getElementById("uploadBtn").addEventListener("change", previewImg);
//定义外围边界box
    var imgBox = document.getElementById("img-box");
    var imgSrc;
    var shape = new QuestionShape(imgBox);

    //图片预览函数
    function previewImg(e) {
        if (!e.target.files || !e.target.files[0]) return;
        var img = new Image();
        var fr = new FileReader();
        fr.readAsDataURL(e.target.files[0]);
        fr.onload = function (evt) {
            imgSrc = evt.target.result;//这个随便改
            img.src = evt.target.result;
        }
        imgBox.innerHTML = "";
        img.onload = function () {
            //图片自适应container尺寸
            var w = img.width, h = img.height, bh, bw;
            var ratio = w / h;
            var ratio = w / h;
            if (boxRatio >= ratio) {
                bh = boxHeight;
                bw = Math.round(boxHeight * ratio);
            } else {
                bw = boxWidth;
                bh = Math.round(boxWidth / ratio);
            }
            imgBox.style.width = bw + "px";
            imgBox.style.height = bh + "px";
            imgBox.style.backgroundImage = "url('" + imgSrc + "')";
            imgBox.style.backgroundSize = bw+"px "+bh+"px";
        }
    }

    //画圆还是画矩形切换卡
    var tabs = document.querySelectorAll(".typeTab li");
    for (var i = 0; i < 2; i++) {
        tabs[i].addEventListener("click", function () {
            if (this.nextElementSibling) this.nextElementSibling.classList.remove("active");
            else this.previousElementSibling.classList.remove("active");
            this.classList.add("active");
            shape.draw.type=Boolean(this.getAttribute("data-index"));
        });
    }

    document.getElementById("addBtn").addEventListener("click", function () {
        if (!imgSrc) {
            alert("no image");
            return;
        }
        imgBox.addEventListener("mousedown", shape.draw, true);
        imgBox.className="box-add";
        console.log("addArea");
    });
    document.getElementById("delBtn").addEventListener("click", function () {
        if (areaArr.length==0) {
            alert("no area");
            return;
        }
        selected.deleteArea();
    });


    
    
   

    



