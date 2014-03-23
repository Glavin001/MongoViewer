MongoViewer
===========

> MongoDB + Node.js + Express + D3

## Installation

```bash
npm install
bower install
```

## Example

### Load the example dataset, `discreteData`

```
node load.js
```

### Start the Server

```bash
node index.js
```

This will start the server. Now you can view at [http://localhost:8080/](http://localhost:8080/).

### Example `find` API Query

```
http://localhost:8080/api/v1/discreteBar/find?query={%22label%22:%22A%20Label%22}
```

### Example `findOne` API Query

```
http://localhost:8080/api/v1/discreteBar/findOne?query={%22label%22:%22A%20Label%22}
```

### Example `aggretate` API Query

```
http://localhost:8080/api/v1/discreteBar/aggregate?pipeline=[{%22$match%22:{%22label%22:%22A%20Label%22}}]
```
