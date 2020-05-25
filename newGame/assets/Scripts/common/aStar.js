function RoadNode(startPos, endPos, parent) {
    this.startPos = startPos;
    this.endPos = endPos;
    this.parent = parent || null;

    this.xIndex = startPos.xIndex || -1;
    this.yIndex = startPos.yIndex || -1;

    this.linkNodeList = [];
};

RoadNode.prototype.resetData = function (startPos, endPos, parent) {
    this.startPos = startPos;
    this.endPos = endPos;
    this.parent = parent || null;

    this.xIndex = startPos.xIndex || -1;
    this.yIndex = startPos.yIndex || -1;

    this.linkNodeList = [];
};
RoadNode.prototype.getParent = function () {
    return this.parent;
};


RoadNode.prototype.getF = function () {
    let f = this.getG() + this.getH();
    // console.log("aStar.getF: ", f);
    return f;
};

RoadNode.prototype.getG = function () {
    let parent = this.parent;
    let g = 0;
    while (parent) {
        g++;
        parent = parent.parent;
    }
    // console.log("aStar.getG: ", g);
    return g;
};

/**
 * 曼哈顿 x-x0 + y-y0
 * 欧几里 Math.sqrt(Math.pow((x-x0),2) + Math.pow((y-y0),2)) 
 */

RoadNode.prototype.getH = function () {
    let h = -1;
    if (this.endPos) {
        h = Math.abs(this.endPos.xIndex - this.xIndex) + Math.abs(this.endPos.yIndex - this.yIndex);
    }
    // console.log("aStar.getH: ", h);
    return h;
};

RoadNode.prototype.checkLinkNode = function (closeList, mapArr) {
    console.log("checkLinkNode.index: ", this.xIndex, this.yIndex);
    if (this.xIndex - 1 >= 0) {
        this._addLink(this.xIndex - 1, this.yIndex, closeList, mapArr)
    }
    if (this.xIndex + 1 < mapArr.length) {
        this._addLink(this.xIndex + 1, this.yIndex, closeList, mapArr)
    }
    if (this.yIndex - 1 >= 0) {
        this._addLink(this.xIndex, this.yIndex - 1, closeList, mapArr)
    }

    if (this.yIndex + 1 < mapArr[this.xIndex].length) {
        this._addLink(this.xIndex, this.yIndex + 1, closeList, mapArr)
    }

    if (ASTART.BevelSwitch) {
        if (this.xIndex - 1 >= 0 && this.yIndex - 1 >= 0) {//左下
            this._addLink(this.xIndex - 1, this.yIndex - 1, closeList, mapArr)
        }

        if (this.xIndex - 1 >= 0 && this.yIndex + 1 < mapArr[this.xIndex - 1].length) {//左上
            this._addLink(this.xIndex - 1, this.yIndex + 1, closeList, mapArr)
        }

        if (this.xIndex + 1 < mapArr.length && this.yIndex - 1 >= 0) {//右下
            this._addLink(this.xIndex + 1, this.yIndex - 1, closeList, mapArr)
        }

        if (this.xIndex + 1 < mapArr.length && this.yIndex + 1 < mapArr[this.xIndex + 1].length) {//右上
            this._addLink(this.xIndex + 1, this.yIndex + 1, closeList, mapArr)
        }


    }
};

RoadNode.prototype.getxIndex = function () {
    return this.xIndex;
};
RoadNode.prototype.getyIndex = function () {
    return this.yIndex;
};

RoadNode.prototype.getLinkNodeList = function () {
    return this.linkNodeList;
};

RoadNode.prototype._addLink = function (x, y, closeList, mapArr) {
    if (mapArr[x] && mapArr[x][y] && !closeList[x + "*" + y]) {
        let path = new RoadNode({ xIndex: x, yIndex: y }, this.endPos, this);
        this.linkNodeList.push(path);
    }
};

let PathManager = {
    BevelSwitch: false,
    findPath(startPos, endPos, mapArr) {

        let startNode = new RoadNode(startPos, endPos, null);
        let openList = [];
        let closeList = {};
        openList.push(startNode);
        while (true) {
            let currentNode = openList[0];
            openList.splice(0, 1);
            closeList[currentNode.xIndex + "*" + currentNode.yIndex] = currentNode;
            if (currentNode.getxIndex() == endPos.xIndex && currentNode.getyIndex() == endPos.yIndex) {
                console.log("aStar.找到路了");
                // break;
                return this.getRightPath(currentNode);
            }
            if (!currentNode.getLinkNodeList().length) {
                currentNode.checkLinkNode(closeList, mapArr);
            }
            let linkNodeList = currentNode.getLinkNodeList();
            for (let i = 0, len = linkNodeList.length; i < len; i++) {
                let linkNode = linkNodeList[i];
                if (this.checkOpenList(openList, linkNode)) {//检查open列表，在里面要修改parent
                    linkNode.resetData(linkNode, endPos, currentNode);
                } else {
                    openList.push(linkNode);
                }
            }

            if (!openList.length) {
                console.log("aStar.无路可走");
                return [];
                break;
            }

            openList.sort(function (a, b) {
                return a.getF() - b.getF();
            })
        }

    },

    checkOpenList(openList, item) {
        for (let i = 0, len = openList.length; i < len; i++) {
            let openItem = openList[i];
            if (openItem.xIndex == item.xIndex && openItem.yIndex == item.yIndex) {
                return true;
            }
        }
        return false;
    },


    getRightPath(finalNode) {
        let path = [];
        let tempNode = finalNode;
        while (tempNode) {
            path.unshift(tempNode);
            tempNode = tempNode.getParent();
        }
        return path;
    },
}

window.ASTART = PathManager;



