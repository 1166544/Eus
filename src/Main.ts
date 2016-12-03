class Main extends egret.DisplayObjectContainer {

    private loadingView:LoadingUI;
    private resourceTextureList: Array<egret.Texture>;
    private textfield:egret.TextField;
    private counter:number = 0;
    private moviePlayer:egret.Bitmap;
    private stageW:number;
    private stageH:number;
    private movieTotalFrame:number = 0;
    private movieIndex:number = 0;
    private isPlaying:boolean = false;
    private isResourceReady = false;
    private movieKeyList = ['preload', '3', '4', '5', '6','preload', '3', '4', '5', '6'];
    private resourceMapList = {};

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
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
    }

    /**
     * 播放随机动画
     */
    private playReadomMovie() {
        const keyNum:number = Math.floor(Math.random() * 10);
        let key = "preload";
        if (keyNum < this.movieKeyList.length) {
           key = this.movieKeyList[keyNum];     
        }
        if (this.resourceMapList[key]) {
            this.addResource(key);
        } else {
            this.stage.addChild(this.loadingView);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceReloadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            RES.loadGroup(key);     
        }    
    }

    /**
     * preload资源组加载完成
     */
    private onResourceReloadComplete(event:RES.ResourceEvent):void {
        console.log(event.groupName);
        this.stage.removeChild(this.loadingView);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceReloadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        this.addResource(event.groupName);
    }

    /**
     * 加工播放源
     */
    private addResource(key) {
        if (this.resourceMapList[key]) {
            this.resourceTextureList = this.resourceMapList[key];
        } else {
            const resourceList: Array<RES.ResourceItem> = RES.getGroupByName(key);
            this.resourceTextureList = [];
            for (let item of resourceList) {
                this.resourceTextureList.push(RES.getRes(item.name));
            }
            this.movieTotalFrame = this.resourceTextureList.length; 
            this.resourceMapList[key] = this.resourceTextureList;      
        }
        this.openReady();
    }

    /**
     * 创建游戏场景
     */
    private createGameScene():void {
        // 背景
        let sky:egret.Bitmap = this.createBitmapByName("2_36");
        this.addChild(sky);
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        sky.width = this.stageW;
        sky.height = this.stageH;

        // 影片容器
        this.moviePlayer = new egret.Bitmap();
        this.stage.addChild(this.moviePlayer);

        // 上一页
        var previewTxt:egret.TextField = new egret.TextField();
        this.stage.addChild(previewTxt);
        previewTxt.text = '上一页';
        previewTxt.width = 120;
        previewTxt.height = 20;
        previewTxt.touchEnabled = true;
        previewTxt.x = 20;
        previewTxt.y = this.stageH - previewTxt.height >> 1;
        previewTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPreviewClick, this);    

        // 下一页
        var nextText:egret.TextField = new egret.TextField();
        this.stage.addChild(nextText);
        nextText.text = '下一页';
        nextText.width = 120;
        nextText.height = 20;
        nextText.touchEnabled = true;
        nextText.x = this.stageW - nextText.width - 20;
        nextText.y = this.stageH - previewTxt.height >> 1;
        nextText.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextClick, this);    

        // 定时器
        this.stage.addEventListener(egret.Event.ENTER_FRAME, this.onStageUpdate, this);    
        this.openPlaying();
    }

    /**
     * 上一页点击处理
     */
    private onPreviewClick(e:egret.TouchEvent):void {
       if (this.isPlaying) return;
       this.openPlaying();
       this.playReadomMovie();
    }

    /**
     * 下一页点击处理
     */
    private onNextClick(e:egret.TouchEvent):void {
        if (this.isPlaying) return;  
        this.openPlaying();
        this.playReadomMovie(); 
    }

    /**
     * 打开播放中标记
     */
    private openPlaying():void {
        this.isPlaying = true;
    }

    /**
     * 关闭播放中标记
     */
    private closePlaying():void {
        this.isPlaying = false;
    }

    /**
     * 打开资源准备完毕标记
     */
    private openReady():void {
        this.isResourceReady = true;
    }

    /**
     * 关闭资源准备完毕标记
     */
    private closeReady():void {
        this.isResourceReady = false;
    }

    /**
     * 更新定时器
     */
    private onStageUpdate(e:egret.Event):void {
        this.counter++;
        if (this.counter % 5 == 0) {
            this.updateFrame();
        } 
    }    

    /**
     * 更新帧内容
     */
    private updateFrame() {
        if (!this.isPlaying) return;
        if (!this.isResourceReady) return;

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
    }

    /**
     * 资源组加载出错
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
       this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    private createBitmapByName(name:string):egret.Bitmap {
        let result = new egret.Bitmap();
        let texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}


