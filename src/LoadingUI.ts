class LoadingUI extends egret.Sprite {

    public constructor() {
        super();
        this.createView();
    }

    private textField:egret.TextField;

    private createView():void {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.textField.x = 1136-480 >> 1;
        this.textField.y = 640-100 >> 1;
    }

    public setProgress(current:number, total:number):void {
        this.textField.text = `Loading...${current}/${total}`;
    }
}
