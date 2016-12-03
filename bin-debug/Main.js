var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.counter = 0;
        this.movieTotalFrame = 0;
        this.movieIndex = 0;
        this.isPlaying = false;
        this.isResourceReady = false;
        this.movieKeyList = ['preload', '3', '4', '5', '6', 'preload', '3', '4', '5', '6'];
        this.resourceMapList = {};
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     */
    p.onResourceLoadComplete = function (event) {
        console.log(event.groupName);
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.addResource("preload");
            this.createGameScene();
        }
    };
    /**
     * 播放随机动画
     */
    p.playReadomMovie = function () {
        var keyNum = Math.floor(Math.random() * 10);
        var key = "preload";
        if (keyNum < this.movieKeyList.length) {
            key = this.movieKeyList[keyNum];
        }
        if (this.resourceMapList[key]) {
            this.addResource(key);
        }
        else {
            this.stage.addChild(this.loadingView);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceReloadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            RES.loadGroup(key);
        }
    };
    /**
     * preload资源组加载完成
     */
    p.onResourceReloadComplete = function (event) {
        console.log(event.groupName);
        this.stage.removeChild(this.loadingView);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceReloadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        this.addResource(event.groupName);
    };
    /**
     * 加工播放源
     */
    p.addResource = function (key) {
        if (this.resourceMapList[key]) {
            this.resourceTextureList = this.resourceMapList[key];
        }
        else {
            var resourceList = RES.getGroupByName(key);
            this.resourceTextureList = [];
            for (var _i = 0, resourceList_1 = resourceList; _i < resourceList_1.length; _i++) {
                var item = resourceList_1[_i];
                this.resourceTextureList.push(RES.getRes(item.name));
            }
            this.movieTotalFrame = this.resourceTextureList.length;
            this.resourceMapList[key] = this.resourceTextureList;
        }
        this.openReady();
    };
    /**
     * 创建游戏场景
     */
    p.createGameScene = function () {
        // 背景
        var sky = this.createBitmapByName("2_36");
        this.addChild(sky);
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        sky.width = this.stageW;
        sky.height = this.stageH;
        // 影片容器
        this.moviePlayer = new egret.Bitmap();
        this.stage.addChild(this.moviePlayer);
        // 上一页
        var previewTxt = new egret.TextField();
        this.stage.addChild(previewTxt);
        previewTxt.text = '上一页';
        previewTxt.width = 60;
        previewTxt.height = 20;
        previewTxt.touchEnabled = true;
        previewTxt.x = 20;
        previewTxt.y = this.stageH - previewTxt.height >> 1;
        previewTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPreviewClick, this);
        // 下一页
        var nextText = new egret.TextField();
        this.stage.addChild(nextText);
        nextText.text = '下一页';
        nextText.width = 60;
        nextText.height = 20;
        nextText.touchEnabled = true;
        nextText.x = this.stageW - nextText.width - 20;
        nextText.y = this.stageH - previewTxt.height >> 1;
        nextText.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextClick, this);
        // 定时器
        this.stage.addEventListener(egret.Event.ENTER_FRAME, this.onStageUpdate, this);
        this.openPlaying();
    };
    /**
     * 上一页点击处理
     */
    p.onPreviewClick = function (e) {
        if (this.isPlaying)
            return;
        this.openPlaying();
        this.playReadomMovie();
    };
    /**
     * 下一页点击处理
     */
    p.onNextClick = function (e) {
        if (this.isPlaying)
            return;
        this.openPlaying();
        this.playReadomMovie();
    };
    /**
     * 打开播放中标记
     */
    p.openPlaying = function () {
        this.isPlaying = true;
    };
    /**
     * 关闭播放中标记
     */
    p.closePlaying = function () {
        this.isPlaying = false;
    };
    /**
     * 打开资源准备完毕标记
     */
    p.openReady = function () {
        this.isResourceReady = true;
    };
    /**
     * 关闭资源准备完毕标记
     */
    p.closeReady = function () {
        this.isResourceReady = false;
    };
    /**
     * 更新定时器
     */
    p.onStageUpdate = function (e) {
        console.log('update');
        this.counter++;
        if (this.counter % 5 == 0) {
            this.updateFrame();
        }
    };
    /**
     * 更新帧内容
     */
    p.updateFrame = function () {
        if (!this.isPlaying)
            return;
        if (!this.isResourceReady)
            return;
        this.moviePlayer.texture = this.resourceTextureList[this.movieIndex];
        this.moviePlayer.width = this.stageW;
        this.moviePlayer.height = this.stageH;
        if (this.movieIndex == 0) {
            console.log('开始播放..');
        }
        this.movieIndex++;
        if (this.movieIndex >= this.movieTotalFrame) {
            this.movieIndex = 0;
            console.log('最后一帧..');
            this.closePlaying();
        }
    };
    /**
     * 资源组加载出错
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     */
    p.onResourceLoadError = function (event) {
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     */
    p.onResourceProgress = function (event) {
        this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
