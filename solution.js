
/*
Challenge
Have the function CityTraffic(strArr) read strArr which will be a representation of an undirected graph 
in a form similar to an adjacency list. Each element in the input will contain an integer which will 
represent the population for that city, and then that will be followed by a comma separated list of 
its neighboring cities and their populations (these will be separated by a colon). 
For example: strArr may be 
["1:[5]", "4:[5]", "3:[5]", "5:[1,4,3,2]", "2:[5,15,7]", "7:[2,8]", "8:[7,38]", "15:[2]", "38:[8]"]. 
This graph then looks like the following picture: 
 
Each node represents the population of that city and each edge represents a road to that city. 

Your goal is to determine the maximum traffic that would occur via a single road if everyone decided to go to that city. 
For example: if every single person in all the cities decided to go to city 7, then via the upper road the 
number of people coming in would be (8 + 38) = 46. If all the cities beneath city 7 decided to go to it via 
the lower road, the number of people coming in would be (2 + 15 + 1 + 3 + 4 + 5) = 30. 
So the maximum traffic coming into the city 7 would be 46 because the maximum value of (30, 46) = 46. 
Your program should determine the maximum traffic for every single city and return the answers in a 
comma separated string in the format: city:max_traffic,city:max_traffic,... 
The cities should be outputted in sorted order by the city number. 
For the above example, the output would therefore be: 
1:82,2:53,3:80,4:79,5:70,7:46,8:38,15:68,38:45. 
The cities will all be unique positive integers and there will not be any cycles in the graph. 
There will always be at least 2 cities in the graph. 
Hard challenges are worth 15 points and you are not timed for them.
Sample Test Cases
Input:"1:[5]", "2:[5]", "3:[5]", "4:[5]", "5:[1,2,3,4]"
Output:"1:14,2:13,3:12,4:11,5:4"
Input:"1:[5]", "2:[5,18]", "3:[5,12]", "4:[5]", "5:[1,2,3,4]", "18:[2]", "12:[3]"
Output:"1:44,2:25,3:30,4:41,5:20,12:33,18:27"
*/

// sample of arr: ["1:[5]", "2:[5,18]", "3:[5,12]", "4:[5]", "5:[1,2,3,4]", "18:[2]", "12:[3]"]
function parseNodesAndEdges(arr) {
    let nodes = []
    let edges = []

    for (let el of arr) {
        let splitEL = el.split(':[')
        let node = parseInt(splitEL[0])
        nodes.push(node)
        let splitEdges = splitEL[1].replace(']').split(',')
        for (let edge of splitEdges) {
            edges.push([node, parseInt(edge)])
        }
    }
    return [nodes, edges]
}


function createAdjacencyList(nodesAndEdges) {
    let nodes = nodesAndEdges[0]
    let edges = nodesAndEdges[1]
    let adjacencyList = new Map()

    for (let node of nodes) {
        adjacencyList.set(node, [])
    }

    for (let edge of edges) {
        let mainCity = edge[0]
        let neighborCity = edge[1]
        adjacencyList.get(mainCity).push(neighborCity)
    }

    return adjacencyList
}

// visited is not created as new set on first call
// as is normal - instead it is going to be created
// prior to first iteration - once for each first level edge
function depthFirstSearch(currentCity, adjacencyList, visited) {
    visited.add(currentCity)
    let neighboringCities = adjacencyList.get(currentCity)
    for (let neighborCity of neighboringCities) {
        if (!visited.has(neighborCity)) {
            depthFirstSearch(neighborCity, adjacencyList, visited)
        }
    }
    return visited
}

function getEdgePaths(el, adjacencyList) {
    let mainCity = el[0]
    let neighboringCities = el[1]
    // This is where things get weird ...
    // The algo will iterate BUT only past first city ...
    let visited = {}
    for (let neighborCity of neighboringCities) {
        visited[neighborCity] = new Set()
        visited[neighborCity].add(mainCity)
        let travelledCitiesSet = depthFirstSearch(neighborCity, adjacencyList, visited[neighborCity])
        let travelledCitiesArr = Array.from(travelledCitiesSet)
        visited[neighborCity] = travelledCitiesArr.slice(1)
    }
    return visited
}

function getEdgeSums(edgePaths) {
    for (let edge in edgePaths) {
        let sum = 0
        for (let population of edgePaths[edge]) {
            sum += population
        }
        edgePaths[edge] = sum
    }
    return edgePaths
}


function getEdgeMax(edgeSums) {
    let values = Object.values(edgeSums)
    let max = Math.max(...values)
    return max
}


function getAnserObj(adjacencyList) {
    let answerObj = {}
    for (let el of adjacencyList) {
        let edgePaths = getEdgePaths(el, adjacencyList)
        let edgeSums = getEdgeSums(edgePaths)
        let edgeMax = getEdgeMax(edgeSums)
        answerObj[`${el[0]}`] = `${edgeMax}`
    }
    return answerObj
}

function getFormattedAnswer(answerObj) {
    let formattedAnswer = ''
    let sortedKeys = Object.keys(answerObj).sort(function (a, b) { return a - b })
    for (let key of sortedKeys) {
        let value = answerObj[key]
        formattedAnswer += `${key}:${value},`
    }
    return formattedAnswer.slice(0, formattedAnswer.length - 1)
}

function CityTraffic(arr) {
    let nodesAndEdges = parseNodesAndEdges(arr)
    let adjacencyList = createAdjacencyList(nodesAndEdges)
    let answerObj = getAnserObj(adjacencyList)
    let formattedAnswer = getFormattedAnswer(answerObj)
    return formattedAnswer
}

// keep this function call here 
console.log(CityTraffic(readline()))
