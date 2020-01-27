type MatchedRoute = {
    matched: boolean,
    url: Array<string>,
    params: {
        [key:string]: string|number|boolean
    },
    action?: Function,
    handler?: RouteHandler
}

type MatchResult = {
    matched: boolean,
    url: string,
    params: {
        [key:string]: string|number|boolean
    },
    action: Function,
    handler: RouteHandler
}

type RouteHandler = (route:MatchedRoute) => void

type RouteNode = {
    [key:string]: string|undefined|boolean|Array<string>|object|RouteHandler|RouteNode,
    endPoint?: boolean,
    params?: Array<string>,
    handler?:RouteHandler,
    action?: Function
}

type Route = {
    url: string,
    handler?:RouteHandler,
    action?: Function
}

type RouteConfig = Array<Route>

interface IRouter {
    routes:RouteNode
    handler?: (route:MatchedRoute) => void
    addRoute: (url:string, handler?:RouteHandler, action?: Function) => Boolean
    removeRoute: (url:string) => Boolean
    match: (url:string) => MatchResult
}

export { MatchedRoute, RouteHandler, RouteNode, IRouter, Route, RouteConfig, MatchResult }

