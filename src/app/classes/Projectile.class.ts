// projectile.class.ts
import { COLORS } from '../helpers/enums';
import { Enemy } from './Enemy.class';
import { Grid } from './Grid.class';

export class Projectile {
  private x: number;
  private y: number;
  private readonly speed: number;
  private readonly damage: number;
  private target: Enemy;
  private grid: Grid;
  public isActive: boolean = true;

  constructor(
    grid: Grid,
    startX: number,
    startY: number,
    speed: number,
    damage: number,
    target: Enemy
  ) {
    this.grid = grid;
    this.x = startX;
    this.y = startY;
    this.speed = speed;
    this.damage = damage;
    this.target = target;
  }

  update() {
    if (!this.isActive || !this.target) return;

    const targetX = this.target.x;
    const targetY = this.target.y;

    // Calculate direction towards the target
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed) {
      this.x = targetX;
      this.y = targetY;
      this.hitTarget();
    } else {
      // Move towards the target
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }

    // Check for collision with the target at the new position
    if (Math.sqrt((this.x - targetX) ** 2 + (this.y - targetY) ** 2) < 5) {
      this.hitTarget();
    }
  }

  hitTarget() {
    this.target.takeDamage(this.damage);
    this.isActive = false; // Deactivate the projectile after it hits the target
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isActive) return;

    ctx.save();
    ctx.fillStyle = COLORS.TOMATO_RED; // Color of the projectile
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI); // Draw a small circle as the projectile
    ctx.fill();
    ctx.restore();
  }
}
