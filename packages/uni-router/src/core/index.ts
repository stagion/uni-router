import { MatchedRoute, RouteHandler, IRouter, RouteNode, RouteConfig, Route, MatchResult } from "./types"
    import { cleanUp } from "../utils/path"
    import matchURL from "../utils/matchURL"
    import removeURL from "../utils/removeURL"
/**
 * Main class for router
 */
export default class UniRouter implements IRouter {
    /**
     * Internal routes map store
     */
    public routes: RouteNode;
    routeConfig:RouteConfig
    constructor(routes:RouteConfig){
        this.routeConfig = routes
        this.routes = {}
        if( routes && routes.length){
            routes.map( (route:Route) => {
                this.addRoute(route.url, route.handler)
            })
        }
    }
    handler?: (route: MatchedRoute) => void;
    addRoute = (path: string, handler?: RouteHandler, action?:Function) => {
        let url = cleanUp(path)
        let parts:Array<string> = url.split("/")
        let currentLevel = this.routes
        let regExp = new RegExp("^:([^:]*)")
        parts.map( (part:string, index:number) => {
            let match = part.match(regExp)
            let parameterized = false
            if(match){
                parameterized = true
            }
            if(part){
                if (!(part in currentLevel)){
                    currentLevel[part] = <RouteNode>{}
                }
                if(parameterized){
                    if(!currentLevel.params){
                        currentLevel.params = []
                    }
                    let params = <Array<string>>currentLevel.params
                    params.indexOf(part) == -1 && params.push(part)
                    currentLevel.params = params
                }
                currentLevel = <RouteNode>currentLevel[part]
            }
            
            if((!part || index == parts.length - 1)){
                if(currentLevel.endPoint){
                    throw new Error(`Conflicting route: ${path}`)
                }
                currentLevel.action = action
                currentLevel.endPoint = true
                
                currentLevel.handler = handler
            }
        })
        return true
    }
    removeRoute = (path: string) => {
        let url = cleanUp( path )
        let parts:Array<string> = url.split("/")
        let currentLevel = this.routes
        return removeURL(currentLevel, parts)
    }
    match = (path: string) => {
        let url = cleanUp( path )
        let parts:Array<string> = url.split("/")
        let currentLevel = this.routes
        let result = <MatchedRoute>matchURL(currentLevel, parts)
        let matchResult:MatchResult = {
            matched: result.matched,
            url: (result.matched && `/${result.url.join("/")}`) || "",
            handler: <RouteHandler>result.handler,
            action: <Function>result.action,
            params: result.params
        }
        if(!matchResult.handler && this.handler){
            matchResult.handler = this.handler
        }
        return matchResult
    };
}