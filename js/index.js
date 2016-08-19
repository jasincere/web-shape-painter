
    var boxWidth=800,boxHeight=500;
    var boxRatio = boxWidth / boxHeight;
    document.getElementById("uploadBtn").addEventListener("change", previewImg);
//定义外围边界box
    var imgBox = document.getElementById("img-box");
    var imgBoxRes = document.getElementById("img-box-res");
    var imgBoxView = document.getElementById("img-box-view");
    var imgSrc;
    var testView = false;

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
        imgBox.appendChild(img);
        img.onload = function () {
            //图片自适应container尺寸
            console.log(img.width);
            console.log(img.height);
            var w = img.width, h = img.height;
            var ratio = w / h;
            if (boxRatio >= ratio) {
                img.height = boxHeight;
            } else {
                img.width = boxWidth;
            }
            imgBox.style.width = img.width + "px";
            imgBox.style.height = img.height + "px";
        }
    }

    //画圆还是画矩形切换卡
    var tabs = document.querySelectorAll(".typeTab li");
    for (var i = 0; i < 2; i++) {
        tabs[i].addEventListener("click", function () {
            if (this.nextElementSibling) this.nextElementSibling.classList.remove("active");
            else this.previousElementSibling.classList.remove("active");
            this.classList.add("active");
            draw.type=parseInt(this.getAttribute("data-index"));
        });
    }

    document.getElementById("addBtn").addEventListener("click", function () {
        if (!imgSrc) {
            alert("no image");
            return;
        }
        imgBox.addEventListener("mousedown", draw, true);
        imgBox.className="box-add";
        selected.unselectArea();
        selected.selectedObj = null;
        console.log("addArea");
    });
    document.getElementById("delBtn").addEventListener("click", function () {
        if (areaArr.length==0) {
            alert("no area");
            return;
        }
        selected.deleteArea();
    });

    document.getElementById("previewBtn").addEventListener("click", function () {
        if (!imgSrc) {
            alert("no image");
            return;
        }
        if(areaArr.length==0){
            alert("no area created");
            return;
        }
        paintImg(imgBoxRes);
        imgBoxRes.addEventListener("click", res, true);
        document.getElementById("submitBtn").addEventListener("click", res);
        document.getElementById("response").style.display="block";
    });
    document.getElementById("testviewBtn").addEventListener("click", function () {
        if (!testView) {
            alert("you should submit your response first");
            return;
        }
        paintImg(imgBoxView);
        score.testView();
        document.getElementById("testview").style.display = "block";
    });

    function paintImg(imgBox) {
        var img = new Image();
        img.src = imgSrc;
        img.width = box.bound.x;
        img.height = box.bound.y;
        imgBox.style.width = box.bound.x+"px";
        imgBox.style.height = box.bound.y+"px";
        imgBox.appendChild(img);
    }

    
    
   

    



