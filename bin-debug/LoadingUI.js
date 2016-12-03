var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        _super.call(this);
        this.createView();
    }
    var d = __define,c=LoadingUI,p=c.prototype;
    p.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.textField.x = 1136 - 480 >> 1;
        this.textField.y = 640 - 100 >> 1;
    };
    p.setProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
egret.registerClass(LoadingUI,'LoadingUI');
