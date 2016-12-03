var MoveClipSpriteSheet = (function (_super) {
    __extends(MoveClipSpriteSheet, _super);
    function MoveClipSpriteSheet(resName, frameCount) {
        _super.call(this);
        this.currFrame = 0;
        this.frameW = 0;
        this.frameH = 0;
        this.movieCurrentTime = 0;
        this.textureName = resName;
        this.framefNum = frameCount;
        this.init();
    }
    var d = __define,c=MoveClipSpriteSheet,p=c.prototype;
    p.init = function () {
        //创建 SpriteSheet 对象
        var texture = RES.getRes(this.textureName);
        this.spriteSheet = new egret.SpriteSheet(texture);
        this.frameW = texture._bitmapWidth / this.framefNum;
        this.frameH = texture._bitmapHeight;
        this.anchorOffsetX = this.frameW / 2;
        this.anchorOffsetY = this.frameH / 2;
        this.draw();
    };
    p.draw = function () {
        //console.log("this.currFrame :" + this.currFrame )
        var key = this.textureName + this.currFrame;
        this.texture = this.spriteSheet.getTexture(key);
        if (!this.texture) {
            this.texture = this.spriteSheet.createTexture(key, this.frameW * this.currFrame, 0, this.frameW, this.frameH);
        }
    };
    p.render = function (dtime) {
        this.movieCurrentTime += dtime;
        var tF = Math.floor(this.movieCurrentTime / 120);
        //console.log("tf:"+tF)
        if (tF != this.currFrame) {
            this.currFrame = tF;
            if (this.currFrame >= this.framefNum) {
                //console.log("moveClip over!");
                this.currFrame = 0;
                this.movieCurrentTime = 0;
            }
            this.draw();
        }
    };
    return MoveClipSpriteSheet;
}(egret.Bitmap));
egret.registerClass(MoveClipSpriteSheet,'MoveClipSpriteSheet');
