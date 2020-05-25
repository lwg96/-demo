// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        gameMapCtrl: require("gameMapCtrl"),
        playerParent: cc.Node,
        playerPrefab: cc.Prefab,

        camera: cc.Camera,
    },

    onLoad() {
        this.gameMapCtrl.init(true);
        this.gameMapCtrl.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.newPlayer();

    },

    newPlayer() {
        let item = cc.instantiate(this.playerPrefab);
        this.playerParent.addChild(item);
        let pos = this.gameMapCtrl.getPlayerPos();
        item.setPosition(pos);
        this.player = item;

        this.initCameraPos();
    },

    initCameraPos() {
        let worldPos = this.player.convertToWorldSpaceAR(cc.v2(0, 0));//拿到player的世界坐标

        let cameraPos = this.camera.node.convertToNodeSpaceAR(worldPos);//将player的世界坐标转换为摄像机节点下的坐标

        let zoomRatio = this.camera.zoomRatio;//摄像机的缩放比例
        let w = cc.winSize.width / zoomRatio;//摄像机实际的宽
        let h = cc.winSize.height / zoomRatio;//摄像机实际的高

        let mapSzie = this.gameMapCtrl.getMapRealSize();

        let mapLeftBorder = -mapSzie.width / 2;
        let mapRightBorder = mapSzie.width / 2;

        let mapBottomBorder = -mapSzie.height / 2;
        let mapTopBorder = mapSzie.height / 2;
        //摄像机原点 - 实际宽高 = 边界位置坐标
        if (cameraPos.x - w / 2 < mapLeftBorder) {//左边边界
            cameraPos.x = mapLeftBorder + w / 2;
        }

        if (cameraPos.x + w / 2 > mapRightBorder) {//右边边界
            cameraPos.x = 320 - w / 2
        }
        if (cameraPos.y - h / 2 < mapBottomBorder) {//下边边界
            cameraPos.y = mapBottomBorder + h / 2;
        }

        if (cameraPos.y + h / 2 > mapTopBorder) {//上边边界
            cameraPos.y = mapTopBorder - h / 2
        }

        this.camera.node.setPosition(cameraPos);
    },

    touchEnd(event) {

        let touch = event.touch;
        let pos = touch.getLocation();

        pos = this.camera.getScreenToWorldPoint(pos)

        let realPos = this.playerParent.convertToNodeSpaceAR(pos);

        let mapSize = this.gameMapCtrl.getMapRealSize();
        let halfW = mapSize.width / 2;
        let halfH = mapSize.height / 2;

        let mapArr = this.gameMapCtrl.getMapData();

        let startPos = this.gameMapCtrl.getTiledPos(this.player.x + halfW, this.player.y + halfH);
        let endPos = this.gameMapCtrl.getTiledPos(realPos.x + halfW, realPos.y + halfH);

        endPos = this.gameMapCtrl.getMaxClosePos(endPos, mapArr);

        let path = ASTART.findPath(startPos, endPos, mapArr);

        this.player.getComponent("playerCtrl").runByPath(path, this.camera.node, this.gameMapCtrl);

    },
});
