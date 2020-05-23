cc.Class({
    extends: cc.Component,

    properties: {

    },


    init(pos) {
        // this.onDestroy.setPosition(pos);

    },

    runByPath(path, cameraNode) {

        if (path.length <= 0) {
            console.log("path有问题");
            return;
        }
        let tween = cc.tween(this.node);
        let cameraTween = cc.tween(cameraNode);
        for (let i = 0; i < path.length; i++) {
            tween.to(0.1, { x: path[i].xIndex * 8 - 320 + 4, y: path[i].yIndex * 8 - 320 + 4 });

            let cameraPos = {x: path[i].xIndex * 8 - 320 + 4, y : path[i].yIndex * 8 - 320 + 4 }

            this.camera = cameraNode.getComponent(cc.Camera);
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
            cameraTween.to(0.1, { x: cameraPos.x, y: cameraPos.y })
        }
        tween.start();
        cameraTween.start();
    },
});
