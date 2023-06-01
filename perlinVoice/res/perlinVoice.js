
const outputWidth = 192;
const gridSize = 32;
const gridSpacing = 192 / gridSize; 

// Create the grid for unit vectors
grid = new Array(gridSize).fill('').map(() => new Array(gridSize).fill(''));

// Populate the grid with gradient vectors
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    // Generate a random gradient vector
    const gradientX = Math.random() * 2 - 1;
    const gradientY = Math.random() * 2 - 1;

    // Store the gradient vector in the grid
    grid[i][j] = { x: gradientX, y: gradientY };
  }
}


function vectorToPoint(x,y){
    // calculate gridPoints
    gridX = Math.floor(x / gridSize),
    gridY = Math.floor(y / gridSize)

    // Calculate the distance between the point and the grid point
    const distanceX = x - gridX;
    const distanceY = y - gridY;
    
    // Calculate the dot product
    const dotProduct = (distanceX * grid[gridX][gridY].x) + (distanceY * grid[gridX][gridY].y);
    
    dotProduct = 
    // Return the dot product
    return dotProduct;

}