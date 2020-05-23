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
        this.gameMapCtrl.init();
        this.gameMapCtrl.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.newPlayer();

    },

    newPlayer() {
        let item = cc.instantiate(this.playerPrefab);
        this.playerParent.addChild(item);
        let pos = this.gameMapCtrl.getPlayerPos();
        item.setPosition(pos);
        this.player = item;


        this.playerPositionChange();

        // this.player.on(cc.Node.EventType.POSITION_CHANGED, this.playerPositionChange, this)
    },

    playerPositionChange() {
        let worldPos = this.player.convertToWorldSpaceAR(cc.v2(0, 0));

        let cameraPos = this.camera.node.convertToNodeSpaceAR(worldPos);

        let zoomRatio = this.camera.zoomRatio;
        let w = cc.winSize.width / zoomRatio;
        let h = cc.winSize.height / zoomRatio;

        if (cameraPos.x - w / 2 < -320) {
            cameraPos.x = -320 + w / 2;
        }

        if (cameraPos.x + w / 2 > 320) {
            cameraPos.x = 320 - w / 2
        }
        if (cameraPos.y - h / 2 < -320) {
            cameraPos.y = -320 + h / 2;
        }

        if (cameraPos.y + h / 2 > 320) {
            cameraPos.y = 320 - h / 2
        }


        this.camera.node.setPosition(cameraPos);


    },

    touchEnd(event) {

        // let tempPos = cc.find("Canvas").width;
        // let apos = this.camera.node.width;

        // return;

        let d = this.gameMapCtrl.getMapOrientation();
        console.log("222");
        let touch = event.touch;
        let pos = touch.getLocation();

        pos = this.camera.getScreenToWorldPoint(pos)

        let realPos = this.playerParent.convertToNodeSpaceAR(pos);

        let mapSize = this.gameMapCtrl.getMapRealSize();
        let halfW = mapSize.x / 2;
        let halfH = mapSize.y / 2;

        let mapArr = this.gameMapCtrl._getMapData();

        let startPos = this.gameMapCtrl.changPos(this.player.x + halfW, this.player.y + halfH);
        let endPos = this.gameMapCtrl.changPos(realPos.x + halfW, realPos.y + halfH);

        if (!mapArr[endPos.xIndex][endPos.yIndex]) {
            return;
        }

        let path = ASTART.findPath(startPos, endPos, mapArr);

        this.player.getComponent("playerCtrl").runByPath(path, this.camera.node);

    },
});
