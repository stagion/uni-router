import { RouteNode } from "../core/types"

const removeURL:(routes:RouteNode, urlParts:Array<string>) => boolean = (routes:RouteNode, urlParts:Array<string>) => {
    let currentLevel:RouteNode = routes
    for(let c=0; c< urlParts.length; c++) {
        let part = urlParts[c]
        currentLevel = <RouteNode>currentLevel[part]
        if(!currentLevel){
            return false
        }
    }

    currentLevel.endPoint = false
    return true
}

export default removeURL