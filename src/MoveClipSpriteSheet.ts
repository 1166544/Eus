class MoveClipSpriteSheet extends egret.Bitmap {
    private textureName: string;
    private framefNum: number;
    private spriteSheet: egret.SpriteSheet;
    private currFrame: number = 0;
    private frameW: number = 0;
    private frameH: number = 0;
    private movieCurrentTime: number = 0;
 
 
    public constructor(resName: string,frameCount: number) {
        super()
        this.textureName = resName;
        this.framefNum = frameCount;
 
        this.init();
    }
 
    private init(): void {
        //创建 SpriteSheet 对象
        var texture: egret.Texture = RES.getRes(this.textureName);
        this.spriteSheet = new egret.SpriteSheet(texture);
 
        this.frameW = texture._bitmapWidth / this.framefNum;
        this.frameH = texture._bitmapHeight;
        this.anchorOffsetX = this.frameW / 2;
        this.anchorOffsetY = this.frameH / 2;
 
        this.draw();
    }
 
 
    private draw(): void {
        //console.log("this.currFrame :" + this.currFrame )
        var key: string = this.textureName + this.currFrame;
        this.texture = this.spriteSheet.getTexture(key);
        if(!this.texture) {
            this.texture = this.spriteSheet.createTexture(key,this.frameW * this.currFrame,0,this.frameW,this.frameH);
        }
    }
 
 
    public render(dtime: number): void {
        this.movieCurrentTime += dtime;
        var tF: number = Math.floor(this.movieCurrentTime / 120);
        //console.log("tf:"+tF)
        if(tF != this.currFrame) {
            this.currFrame = tF;
 
            if(this.currFrame >= this.framefNum) {
                //console.log("moveClip over!");
                this.currFrame = 0;
                this.movieCurrentTime = 0;
            }
 
            this.draw();
        }
    }
 
 
}