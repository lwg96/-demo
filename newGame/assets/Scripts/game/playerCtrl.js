cc.Class({
    extends: cc.Component,

    properties: {

    },


    init(pos) {
        // this.onDestroy.setPosition(pos);

    },

    runByPath(path, cameraNode, gameMapCtrl) {

        if (path.length <= 0) {
            console.log("path有问题");
            return;
        }
        let tween = cc.tween(this.node);
        let cameraTween = cc.tween(cameraNode);
        for (let i = 0; i < path.length; i++) {
            tween.to(0.1, { x: path[i].xIndex * 8 - 320 + 4, y: path[i].yIndex * 8 - 320 + 4 });

            let cameraPos = { x: path[i].xIndex * 8 - 320 + 4, y: path[i].yIndex * 8 - 320 + 4 }

            this.camera = cameraNode.getComponent(cc.Camera);
            let zoomRatio = this.camera.zoomRatio;//摄像机的缩放比例
            let w = cc.winSize.width / zoomRatio;//摄像机实际的宽
            let h = cc.winSize.height / zoomRatio;//摄像机实际的高

            this.gameMapCtrl = gameMapCtrl;

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
            cameraTween.to(0.1, { x: cameraPos.x, y: cameraPos.y })
        }
        tween.start();
        cameraTween.start();
    },
});
