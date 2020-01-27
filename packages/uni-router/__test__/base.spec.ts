'use strict';

import UniRouter from "../src/core"
import { MatchResult, MatchedRoute } from "../src/core/types";


const routes = [
    {
      url: '/',
      handler: function(){
          return "Home"
      }
    },
    {
        url: '/about',
        handler: function(){
            return "/about"
        }
    },
    {
      url: '/posts/entity',
      handler: function(){
          return "/posts/entity"
      }
    },
    {
      url: '/posts/:id',
      handler: function(){
          return "/posts/:id"
      }
    },
    {
      url: '/posts/:id/edit',
      handler: function(){
          return "/posts/:id/edit"
      }
    },
    {
        url: '/posts/:type/:id/',
        handler: function(){
            return "/posts/:type/:id"
        }
    },
    {
      url: '/posts/:id/update',
      handler: function(){
          return "/posts/:id/update"
      }
    },
    {
      url: '/posts/custom/*',
      handler: function(){
          return "/posts/custom/*"
      }
    },
    {
        url: '/posts/custom',
        handler: function(){
            return "/posts/custom"
        }
    },
    {
      url: '/posts/custom/:id/update',
      handler: function(){
          return "/posts/custom/:id/update"
      }
    },
    {
        url: '/posts/custom/post/update',
        handler: function(){
            return "/posts/custom/post/update"
        }
    }
];

let router = new UniRouter(routes)
let matchedRoute = <MatchedRoute>{}

test('Match Home URL', () => {
    let match:MatchResult = router.match("")
    expect(match.matched).toBeTruthy()
    expect(match.handler(matchedRoute)).toBe("Home")
    expect(match.url).toBe("/")
})

test('Match static URL', () => {
    let match:MatchResult = router.match("/about")
    expect(match.matched).toBeTruthy()
    expect(match.handler(matchedRoute)).toBe("/about")
})

test('Match end parameter', () => {
    let match:MatchResult = router.match("posts/1234")
    expect(match.matched).toBeTruthy()
    expect(match.params.id).toBe("1234")
    expect(match.url).toBe("/posts/:id")
})
test('Remove URL', () => {
    expect(router.removeRoute("/posts/:id")).toBe(true)

    let match:MatchResult = router.match("posts/1234")
    expect(match.matched).toBeFalsy()
})

test('Match end parameter special case', () => {
    let match:MatchResult = router.match("/posts/entity")
    expect(match.matched).toBeTruthy()
    expect(match.handler(matchedRoute)).toBe("/posts/entity")
    expect(match.url).toBe("/posts/entity")

    match = router.match("/posts/custom")
    expect(match.matched).toBeTruthy()
    expect(match.handler(matchedRoute)).toBe("/posts/custom")
    expect(match.url).toBe("/posts/custom")
})

test('Match intermediate parameter', () => {
    let match:MatchResult = router.match("posts/custom/1234/update")
    expect(match.matched).toBeTruthy()
    expect(match.params.id).toBe("1234")
    expect(match.url).toBe("/posts/custom/:id/update")
})

test('Match intermediate/multiple parameter(s) special case', () => {
    let match:MatchResult = router.match("/posts/custom/post/update")
    expect(match.matched).toBeTruthy()
    expect(match.url).toBe("/posts/custom/post/update")
})

test('Match multiple parameters', () => {
    let match:MatchResult = router.match("posts/marketing/1234")
    expect(match.matched).toBeTruthy()
    expect(match.params.id).toBe("1234")
    expect(match.params.type).toBe("marketing")
    expect(match.url).toBe("/posts/:type/:id")
})