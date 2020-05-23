cc.Class({
    extends: cc.Component,

    properties: {
        _map: undefined,
        _mapData: undefined,
        _playerPos: undefined,

    },

    init() {
        let map = this.node.getComponent(cc.TiledMap);
        this._map = map;
        this._mapData = this._getMapData();

        this._playerPos = this._getPlayerPos();
    },

    getMapRealSize() {
        return cc.v2(this._map.getMapSize().width * this._map.getTileSize().width, this._map.getMapSize().height * this._map.getTileSize().height)
    },

    getMap() {
        return this._map;
    },

    getMapData() {
        return this._mapData;
    },

    getPlayerPos() {
        return this._playerPos;
    },


    _getPlayerPos() {
        let objGround = this._map.getObjectGroup("playerGround");
        let player = objGround.getObject("player");

        let halfW = this.node.width / 2;
        let halfH = this.node.height / 2;
        let pos = cc.v2(player.x - halfW, player.y - halfH);
        return pos;

    },

    _getMapData() {
        let roadLayer = this._map.getLayer("road");

        let width = roadLayer.getLayerSize().width;
        let height = roadLayer.getLayerSize().height;

        let mapData = [];
        for (let i = 0; i < width; i++) {
            mapData[i] = [];
            for (let j = 0; j < height; j++) {
                let gid = roadLayer.getTileGIDAt( i, height - 1 - j);
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


    changPos(sx, sy) {
        let w = this._map.getTileSize().width;
        let h = this._map.getTileSize().height;
        let x = Math.abs(Math.floor(sx / w)) ;
        let y = Math.abs(Math.floor(sy / h));
        return { xIndex: x, yIndex: y };
    },

    getMapOrientation(){
        let d = this._map.getMapOrientation();
        let roadLayer = this._map.getLayer("road");
        let l = roadLayer.getLayerOrientation();

        console.log("aaa");
    }
});
