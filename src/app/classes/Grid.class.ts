import { BaseCamp, CELL_TYPE, COLORS } from '../helpers/enums';

export class Grid {
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private width: number;
  private height: number;
  public cells: any[][]; // Using any for simplicity; define a specific type as needed

  constructor(ctx: CanvasRenderingContext2D, cellSize: number) {
    this.ctx = ctx;
    this.cellSize = cellSize;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.initializeCells();
  }

  initializeCells(): void {
    const cols = Math.floor(this.width / this.cellSize);
    const rows = Math.floor(this.height / this.cellSize);
    this.cells = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null));
  }

  drawGrid() {
    let color = COLORS.STORMY_GREY;
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;

    for (let x = 0; x <= this.width; x += this.cellSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += this.cellSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
    }

    this.ctx.stroke();
  }

  initCells() {
    let enemyBase: BaseCamp = {
      type: 'enemy-base',
      name: 'Enemy Base',
      color: COLORS.BERRY_RED,
      health: 100,
    };
    let playerBase: BaseCamp = {
      type: 'player-base',
      name: 'Player Base',
      color: COLORS.FOREST_GREEN,
      health: 100,
    };
    this.placeObjectInCell(1, 1, enemyBase);
    this.placeObjectInCell(14, 10, playerBase);
  }

  getCell(x: number, y: number) {
    return this.cells[y] ? this.cells[y][x] : null;
  }

  drawCells(currentlySelected) {
    this.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        let cellIsSelected =
          currentlySelected.x === x && currentlySelected.y === y;
        if (cell) {
          this.drawInCell(x, y, cell.color);

          if (cellIsSelected) {
            let padding = 0;
            this.ctx.save();
            this.ctx.strokeStyle = COLORS.PALE_IVORY;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(
              x * this.cellSize - padding,
              y * this.cellSize - padding,
              this.cellSize + padding * 2,
              this.cellSize + padding * 2
            );
            this.ctx.restore();
          }
        }
      });
    });
  }

  drawInCell(cellX: number, cellY: number, color: string) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      cellX * this.cellSize,
      cellY * this.cellSize,
      this.cellSize,
      this.cellSize
    );

    this.ctx.strokeStyle = COLORS.PURE_BLACK;
    this.ctx.lineWidth = 3;

    this.ctx.strokeRect(
      cellX * this.cellSize,
      cellY * this.cellSize,
      this.cellSize,
      this.cellSize
    );
    this.ctx.restore();
  }

  placeObjectInCell(cellX: number, cellY: number, object: any): void {
    if (this.cells[cellY] && this.cells[cellY][cellX] === null) {
      // Check to make sure the cell is empty before placing the object
      this.cells[cellY][cellX] = { ...object, x: cellX, y: cellY };
    }
  }

  getObjectInCell(cellX: number, cellY: number): any {
    return this.cells[cellY] ? this.cells[cellY][cellX] : null;
  }

  getCellSize(): number {
    return this.cellSize;
  }

  drawHealthBar(cellX: number, cellY: number, health: number): void {
    this.ctx.save();

    let cell = this.getObjectInCell(cellX, cellY);
    if (!cell) return;

    let cellSize = this.getCellSize();
    let x = cellX * cellSize;
    let y = cellY * cellSize;
    let width = cellSize + 10; // Bar's extra width compared to the cell size
    let barHeight = 4;
    let borderPadding = 3;
    let bottomPadding: number = 7;

    // Calculate total width including padding
    let totalWidth = width + borderPadding * 2;

    // Adjust x and y to center the health bar over the cell
    let adjustedX = x + (cellSize - totalWidth) / 2;
    let adjustedY = y - barHeight - borderPadding * 2 - bottomPadding; // Position the bar above the cell with space for border

    // Draw background of the health bar with border padding
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(
      adjustedX,
      adjustedY,
      totalWidth,
      barHeight + borderPadding * 2
    );

    let healthWidth = (health / 100) * width;

    // Calculate red and green components based on health
    let red = Math.min(255, (100 - health) * 2.55 * 2);
    let green = Math.min(255, health * 2.55 * 2);

    // Set the health bar color based on health value
    this.ctx.fillStyle = `rgb(${red.toFixed(0)}, ${green.toFixed(0)}, 0)`;
    this.ctx.fillRect(
      adjustedX + borderPadding,
      adjustedY + borderPadding,
      healthWidth,
      barHeight
    );

    this.ctx.restore();
  }

  heuristic(a: { x: number; y: number }, b: { x: number; y: number }): number {
    // Use Manhattan distance as the heuristic
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  aStar(
    grid: Grid,
    start: { x: number; y: number },
    goal: { x: number; y: number }
  ): { x: number; y: number }[] {
    let openSet: { x: number; y: number }[] = [start];
    let cameFrom: Map<string, { x: number; y: number }> = new Map();

    let gScore: Map<string, number> = new Map();
    grid.cells.forEach((row, y) =>
      row.forEach((cell, x) => gScore.set(`${x},${y}`, Infinity))
    );
    gScore.set(`${start.x},${start.y}`, 0);

    let fScore: Map<string, number> = new Map();
    grid.cells.forEach((row, y) =>
      row.forEach((cell, x) => fScore.set(`${x},${y}`, Infinity))
    );
    fScore.set(`${start.x},${start.y}`, this.heuristic(start, goal));

    while (openSet.length > 0) {
      let current = openSet.reduce((a, b) =>
        fScore.get(`${a.x},${a.y}`)! < fScore.get(`${b.x},${b.y}`)! ? a : b
      );

      if (current.x === goal.x && current.y === goal.y) {
        // Reconstruct path
        let path = [];
        while (current) {
          path.unshift(current);
          current = cameFrom.get(`${current.x},${current.y}`);
        }
        return path;
      }

      openSet = openSet.filter((item) => item !== current);
      let neighbors = grid.getNeighbors(current.x, current.y);

      for (let neighbor of grid.getNeighbors(current.x, current.y)) {
        let tentative_gScore = gScore.get(`${current.x},${current.y}`)! + 1; // Assume cost of 1 for moving to a neighbor
        if (tentative_gScore < gScore.get(`${neighbor.x},${neighbor.y}`)!) {
          cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
          gScore.set(`${neighbor.x},${neighbor.y}`, tentative_gScore);
          fScore.set(
            `${neighbor.x},${neighbor.y}`,
            tentative_gScore + this.heuristic(neighbor, goal)
          );
          if (!openSet.some((n) => n.x === neighbor.x && n.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return []; // Return an empty array if no path is found
  }

  getNeighbors(x: number, y: number): { x: number; y: number }[] {
    let neighbors: { x: number; y: number }[] = [];
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]; // Right, left, down, up

    directions.forEach(([dx, dy]) => {
      let nx = x + dx;
      let ny = y + dy;
      if (
        this.isValidCell(nx, ny) &&
        (!this.cells[ny][nx] || this.cells[ny][nx].type !== CELL_TYPE.TOWER)
      ) {
        neighbors.push({ x: nx, y: ny });
      }
    });

    return neighbors;
  }

  // Also, ensure you have a method to validate cell boundaries:
  isValidCell(x: number, y: number): boolean {
    return (
      x >= 0 && y >= 0 && x < this.cells[0].length && y < this.cells.length
    );
  }
}
