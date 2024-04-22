// enemy.class.ts
import { Grid } from './Grid.class';

export class Enemy {
  x: number;
  y: number;
  health: number;
  startingHealth: number;
  path: { x: number; y: number }[];
  grid: Grid;
  speed: number; // Pixels per frame
  damage: number; // Damage the enemy deals to the player base
  currentPathIndex: number;
  targetX: number;
  targetY: number;
  reachedTarget: boolean = false;

  constructor(
    grid: Grid,
    startX: number,
    startY: number,
    speed: number,
    damage: number,
    health: number
  ) {
    this.grid = grid;
    this.x = startX * grid.getCellSize() + grid.getCellSize() / 2;
    this.y = startY * grid.getCellSize() + grid.getCellSize() / 2;
    this.speed = speed;
    this.damage = damage; // Initialize damage
    this.health = health;
    this.startingHealth = health;
    this.path = [];
    this.currentPathIndex = 0;
    this.updateTarget();
  }

  updateTarget() {
    if (this.path.length > 0 && this.currentPathIndex < this.path.length) {
      this.targetX =
        this.path[this.currentPathIndex].x * this.grid.getCellSize() +
        this.grid.getCellSize() / 2;
      this.targetY =
        this.path[this.currentPathIndex].y * this.grid.getCellSize() +
        this.grid.getCellSize() / 2;
    } else {
    }
  }

  move() {
    if (this.path.length === 0 || this.reachedTarget) return;

    let dx = this.targetX - this.x;
    let dy = this.targetY - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let moveDistance = Math.min(distance, this.speed);
    if (distance > 0) {
      this.x += (dx / distance) * moveDistance;
      this.y += (dy / distance) * moveDistance;
    }

    // Check if the enemy has reached the exact target position
    if (
      Math.abs(this.x - this.targetX) < 1 &&
      Math.abs(this.y - this.targetY) < 1
    ) {
      this.currentPathIndex++;
      if (this.currentPathIndex >= this.path.length) {
        this.reachTarget(); // Mark the enemy as having reached the target
      } else {
        this.updateTarget();
      }
    }
  }

  reachTarget() {
    this.reachedTarget = true;
    this.health = 0; // Optionally set health to zero to flag for removal
  }

  draw(ctx: CanvasRenderingContext2D) {
    const radius = this.grid.getCellSize() / 6; // Circle with a radius half the size of a cell
    const centerX = this.x + this.grid.getCellSize() / 3; // Center x coordinate
    const centerY = this.y + this.grid.getCellSize() / 3; // Center y coordinate

    ctx.save();
    ctx.fillStyle = '#F94144';
    ctx.beginPath();
    ctx.arc(centerX - radius * 2, centerY - radius * 2, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();

    let width = 30;
    let height = 5;
    let borderPadding = 2;
    let totalWidth = width + borderPadding * 2;
    let bottomPadding = 8;

    let adjustedX = this.x - totalWidth / 2;
    let adjustedY = this.y - height - borderPadding * 2 - bottomPadding;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(adjustedX, adjustedY, totalWidth, height);

    let healthWidth = (this.health / this.startingHealth) * width;

    let red = Math.min(255, (100 - this.health) * 2.55 * 2);
    let green = Math.min(255, this.health * 2.55 * 2);

    // Set the health bar color based on health value
    ctx.fillStyle = `rgb(${red.toFixed(0)}, ${green.toFixed(0)}, 0)`;
    ctx.fillRect(
      adjustedX + borderPadding,
      adjustedY + borderPadding,
      healthWidth,
      height - borderPadding * 2
    );

    ctx.restore();
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      // Handle enemy death, such as removing from the game
    }
  }

  findPath(goalX: number, goalY: number) {
    // Convert pixel coordinates back to grid indices
    let startX = Math.floor(this.x / this.grid.getCellSize());
    let startY = Math.floor(this.y / this.grid.getCellSize());
    let goalIdxX = goalX; // Assuming goalX and goalY are already grid indices
    let goalIdxY = goalY;

    let start = { x: startX, y: startY };
    let goal = { x: goalIdxX, y: goalIdxY };
    this.path = this.grid.aStar(this.grid, start, goal);
    if (this.path.length > 0) {
      this.currentPathIndex = 0;
      this.updateTarget();
    } else {
      console.log('Failed to find path from', start, 'to', goal);
    }
  }
}
