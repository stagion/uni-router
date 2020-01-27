const cleanUp:(path:string) =>string = (path:string) => {
    path = path.replace(/^\/|\/$/g, "" );
    path = path.replace(/^\/\//, "/" );
    return path
}

export { cleanUp }