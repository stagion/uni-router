import { RouteNode, MatchedRoute, RouteHandler } from "../core/types";

let paramRegExp = new RegExp("^:([^:]*)")

const checkParams:(currentLevel:RouteNode, urlParts:Array<string>) => MatchedRoute = (currentLevel:RouteNode, urlParts:Array<string>) => {
    let handler:RouteHandler
    let action:Function
    let matched:boolean = false
    let matchedParts:Array<string> = []
    let matchedParams:any = {}
    if(urlParts.length){
        let part = urlParts[0]
        if(currentLevel.params && currentLevel.params.length){
            for(let c=0; c<currentLevel.params.length; c++) {
                let param = currentLevel.params[c]
                let paramKey:string = param.match(paramRegExp)![1]
                if(urlParts.length == 1 && currentLevel[param] && (<RouteNode>currentLevel[param]).endPoint) {
                    matched = true
                    handler = (<RouteNode>currentLevel[param]).handler!
                    matchedParts.push(param)
                    action = (<RouteNode>currentLevel[param]).action!
                    matchedParams[paramKey] = part
                    break
                }else {
                    let paramResult = <MatchedRoute>matchURL(<RouteNode>currentLevel[param], urlParts.slice(1,urlParts.length))
                    if(paramResult.matched){
                        matched = true
                        action = paramResult.action!
                        handler = paramResult.handler!
                        matchedParts.push(param)
                        matchedParts = matchedParts.concat(paramResult.url)
                        matchedParams = Object.assign({}, paramResult.params)
                        matchedParams[paramKey] = part
                        break
                    }else {
                        matched = false
                    }
                }
            }
        }else {
            matched = false
        }
    }
    return {
        matched: matched,
        url: matchedParts,
        params: matchedParams,
        handler: handler!,
        action: action!
    }
}

const matchURL:(currentLevel:RouteNode, urlParts:Array<string>) => MatchedRoute|Boolean = (currentLevel:RouteNode, urlParts:Array<string>) => {
    let parentLevel:RouteNode = currentLevel
    let result:MatchedRoute = {
        matched: false,
        url: [],
        params: {}
    }
    let handler:RouteHandler
    let action:Function
    let matched:boolean = false
    let matchedParts:Array<string> = []
    let matchedParams = {}
    
    if(urlParts.length){
        let part = urlParts[0]
        if(part) {
            if (part in currentLevel) {
                matchedParts.push(part)
                currentLevel = <RouteNode>currentLevel[part]
                if(urlParts.length == 1 && currentLevel.endPoint) {
                    matched = true
                    handler = currentLevel.handler!
                    action = currentLevel.action!
                }else {
                    let paramResult = <MatchedRoute>matchURL(currentLevel, urlParts.slice(1,urlParts.length))
                    if(!paramResult.matched) {
                        matchedParts.pop()
                        currentLevel = parentLevel
                        paramResult = checkParams(currentLevel, urlParts)
                    }
                    matched = paramResult.matched
                    handler = paramResult.handler!
                    action = paramResult.action!
                    matchedParts = matchedParts.concat(paramResult.url)
                    matchedParams = Object.assign({}, paramResult.params)
                }
            }else {
                let paramResult:MatchedRoute = checkParams(currentLevel, urlParts)
                matched = paramResult.matched
                handler = paramResult.handler!
                action = paramResult.action!
                matchedParts = paramResult.url
                matchedParams = paramResult.params
            }
        }else if(urlParts.length == 1 && currentLevel.endPoint) {
            matched = true
            handler = currentLevel.handler!
            action = currentLevel.action!
        }

        if(!matched && "*" in currentLevel){
            currentLevel = <RouteNode>currentLevel["*"]
            matched = true
            handler = currentLevel.handler!
            action = currentLevel.action!
            matchedParts.push("*")
        }
    }

    result.url = matchedParts
    result.params = matchedParams
    result.handler = handler!
    result.action = action!
    result.matched = matched

    return result
}

export default matchURL