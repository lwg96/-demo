cc.Class({
    extends: cc.Component,

    properties: {
        _map: undefined,
        // _mapData: undefined,
        _playerPos: undefined,

    },

    /**
     * bevelSwitch 斜对角开关
     **/
    init(bevelSwitch) {
        this.bevelSwitch = bevelSwitch;
        ASTART.BevelSwitch = bevelSwitch;
        let map = this.node.getComponent(cc.TiledMap);
        this._map = map;
        // this._mapData = this.getMapData(); 这个时候获取没啥用
        this._playerPos = this.getPlayerPos();
    },

    getMapRealSize() {
        let w = this._map.getMapSize().width * this._map.getTileSize().width;
        let h = this._map.getMapSize().height * this._map.getTileSize().height;
        return { width: w, height: h };
    },

    getMap() {
        return this._map;
    },

    getPlayerPos() {
        let objGround = this._map.getObjectGroup("playerGround");
        let player = objGround.getObject("player");

        let halfW = this.node.width / 2;
        let halfH = this.node.height / 2;
        let pos = cc.v2(player.x - halfW, player.y - halfH);
        return pos;

    },

    getMapData() {
        let roadLayer = this._map.getLayer("road");

        let width = roadLayer.getLayerSize().width;
        let height = roadLayer.getLayerSize().height;

        let mapData = [];
        for (let i = 0; i < width; i++) {
            mapData[i] = [];
            for (let j = 0; j < height; j++) {
                let gid = roadLayer.getTileGIDAt(i, height - 1 - j);
                if (gid != 0) {
                    mapData[i][j] = true;
                } else {
                    mapData[i][j] = false;
                }
            }
        }

        return mapData;
        // getTileGIDAt
    },


    getTiledPos(sx, sy) {
        let w = this._map.getTileSize().width;
        let h = this._map.getTileSize().height;
        let x = Math.abs(Math.floor(sx / w));
        let y = Math.abs(Math.floor(sy / h));
        return { xIndex: x, yIndex: y };
    },

    posDealWith(endPos, mapArr) {
        if (!mapArr[endPos.xIndex][endPos.yIndex]) {
            return this.getMaxClosePos(endPos, mapArr);
        } else {
            return endPos;
        }
    },

    getMaxClosePos(endPos, mapArr) {
        let x = endPos.xIndex;
        let y = endPos.yIndex;
        let posArr = [];
        for (let i = x - 1; i >= 0; i--) {//左边
            if (mapArr[i][y]) {
                posArr.push({ xIndex: i, yIndex: y });
                break;
            }
        }
        for (let i = x + 1; i < mapArr.length; i++) {//右边
            if (mapArr[i][y]) {
                posArr.push({ xIndex: i, yIndex: y });
                break;
            }
        }
        for (let i = y - 1; i >= 0; i--) {//下边
            if (mapArr[x][i]) {
                posArr.push({ xIndex: x, yIndex: i });
                break;
            }
        }

        for (let i = y + 1; i < mapArr[x].length; i++) {//上边
            if (mapArr[x][i]) {
                posArr.push({ xIndex: x, yIndex: i });
                break;
            }
        }

        if (ASTART.BevelSwitch) {
            let bool = false;
            for (let i = x - 1; i >= 0; i--) {//左下
                for (let j = y - 1; j >= 0; j--) {
                    if (mapArr[i][j]) {
                        posArr.push({ xIndex: i, yIndex: j });
                        bool = true
                        break;
                    }

                }
                if (bool) {
                    break;
                }
            }
            bool = false;
            for (let i = x - 1; i >= 0; i--) {//左上
                for (let j = y + 1; j < mapArr[i].length; j++) {
                    if (mapArr[i][j]) {
                        posArr.push({ xIndex: i, yIndex: j });
                        bool = true
                        break;
                    }
                }
                if (bool) {
                    break;
                }
            }
            bool = false;
            for (let i = x + 1; i < mapArr.length; i++) {//右下
                for (let j = y - 1; j >= 0; j--) {
                    if (mapArr[i][j]) {
                        posArr.push({ xIndex: i, yIndex: j });
                        bool = true
                        break;
                    }
                }
                if (bool) {
                    break;
                }
            }

            bool = false;
            for (let i = x + 1; i < mapArr.length; i++) {//右上
                for (let j = y + 1; j < mapArr[i].length; j++) {
                    if (mapArr[i][j]) {
                        posArr.push({ xIndex: i, yIndex: j });
                        bool = true
                        break;
                    }
                }
                if (bool) {
                    break;
                }
            }
        }

        if (posArr.length > 0) {
            posArr.sort(function (a, b) {
               return Math.abs(a.xIndex - endPos.xIndex) + Math.abs(a.yIndex - endPos.yIndex) - (Math.abs(b.xIndex - endPos.xIndex) + Math.abs(b.yIndex - endPos.yIndex))
            })

            return posArr[0];
        } else {
            return endPos;
        }
    }
});
