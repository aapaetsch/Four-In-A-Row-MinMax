import {message} from 'antd';

class TranspositionTable{
    constructor(){
        this.visited = {}
    }

    store(hashValue, score){
        this.visited[hashValue] = score;
    }

    lookup(hashValue){
        return this.visited[hashValue];
    }
}

export class FourInARow_AB{
    constructor(maxDepth, moveScores){
        this.maxDepth = maxDepth;
        this.moveScores = moveScores;
    }


    findMove(gameState){
        this.tt = new TranspositionTable();
    }

}