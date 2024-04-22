import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Grid } from './classes/Grid.class';
import { CELL_TYPE, Towers, COLORS } from './helpers/enums';
import { TextHelper } from './helpers/helpers';
import { Enemy } from './classes/Enemy.class';
import { Projectile } from './classes/Projectile.class';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('gameCanvas') gameCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('healthBar') healthBar!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private requestId: number | null = null;
  private grid!: Grid;
  private currentMouseCell: { x: number; y: number } = { x: -1, y: -1 };
  public currentlySelected: any = { type: 'None' };
  public isPlacingTower: boolean = false;
  public isGamePaused: boolean = true;
  environment = environment;

  towerToPlace: any;
  towers = Towers;
  textHelper = TextHelper;
  enemyHealth = 100;
  playerHealth = 100;
  playerMoney = 150;

  playerHealthBarColor;
  playerhealthBarWidth;

  projectiles: Projectile[] = [];
  enemies: Enemy[] = [];
  enemySpawnRate: number = 5000; // Time in ms between enemy spawns
  lastSpawnTime: number = 0;
  waveNumber: number = 0;
  waveDelayTimer: any = null;
  waves: any[] = [
    {
      count: 3,
      speed: 0.85,
      health: 100,
      damage: 5,
      spawnDelay: 2000,
      waveStartDelay: 5000,
    },
    {
      count: 5,
      speed: 0.85,
      health: 120,
      damage: 5,
      spawnDelay: 2000,
      waveStartDelay: 5000,
    },
    {
      count: 8,
      speed: 0.85,
      health: 150,
      damage: 5,
      spawnDelay: 2000,
      waveStartDelay: 5000,
    },
  ];

  constructor(private cdr: ChangeDetectorRef) {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onRightClick = this.onRightClick.bind(this);
    this.onLeftClick = this.onLeftClick.bind(this);
  }

  ngAfterViewInit(): void {
    this.ctx = this.gameCanvas.nativeElement.getContext('2d')!;
    this.grid = new Grid(this.ctx, 50);
    this.grid.initCells();
    this.play();
  }

  onLeftClick(event: MouseEvent): void {
    if (this.isPlacingTower && this.towerToPlace.cost <= this.playerMoney) {
      this.grid.placeObjectInCell(
        this.currentMouseCell.x,
        this.currentMouseCell.y,
        {
          ...this.towerToPlace,
          type: CELL_TYPE.TOWER,
        }
      );
      this.updateEnemyPaths(); // Recalculate paths for all enemies
      this.clearSelected();
      this.isPlacingTower = false;
      this.playerMoney -= this.towerToPlace.cost;
      this.towerToPlace = null;
      this.cdr.detectChanges();
      return;
    }

    let cell = this.grid.getCell(
      this.currentMouseCell.x,
      this.currentMouseCell.y
    );
    if (cell) {
      this.currentlySelected = cell;
    } else {
      this.clearSelected();
    }
    this.cdr.detectChanges();
  }

  generateNextWave(currentWaves) {
    const lastWave = currentWaves[currentWaves.length - 1];
    const newWave = {
      count: lastWave.count + 2,
      speed: lastWave.speed,
      health: lastWave.health + 20,
      damage: lastWave.damage,
      spawnDelay: lastWave.spawnDelay,
      waveStartDelay: lastWave.waveStartDelay,
    };
    currentWaves.push(newWave);
    return newWave;
  }

  updateEnemyPaths(): void {
    let playerBase = this.getBaseCoords(CELL_TYPE.PLAYER_BASE);

    this.enemies.forEach((enemy) => {
      enemy.findPath(playerBase.x, playerBase.y);
    });
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();

    if (this.currentlySelected.type != 'None') this.clearSelected();

    if (this.isPlacingTower) {
      this.isPlacingTower = false;
      this.towerToPlace = null;
      this.clearSelected();
    }
  }

  clearSelected(): void {
    this.currentlySelected = { type: 'None' };
  }

  getTowerById(id: string): any {
    return this.towers.find((tower) => tower.id === id);
  }

  onMouseMove(event: MouseEvent): void {
    const rect = this.gameCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let cellCol = Math.floor(x / this.grid.getCellSize());
    let cellRow = Math.floor(y / this.grid.getCellSize());

    if (
      this.currentMouseCell.x !== cellCol ||
      this.currentMouseCell.y !== cellRow
    ) {
      this.currentMouseCell = { x: cellCol, y: cellRow };
    }
  }

  openSettings() {
    console.log('Settings opened');
  }

  selectTowerToPlace(tower: any) {
    if (this.currentlySelected === tower) {
      this.clearSelected();
      this.isPlacingTower = false;
      this.towerToPlace = null;
      return;
    }

    this.towerToPlace = tower;
    this.isPlacingTower = true;
  }

  toggleGame(): void {
    if (this.isGamePaused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play(): void {
    if (!this.isGamePaused) return; // Prevent re-starting the game if it's already running
    this.isGamePaused = false;
    const loop = () => {
      this.update();
      this.draw();
      this.requestId = requestAnimationFrame(loop);
      this.cdr.detectChanges();
    };
    loop();
  }

  pause(): void {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
    this.isGamePaused = true;
    this.cdr.detectChanges();
  }

  update(): void {
    let currentTime = Date.now();

    // Manage wave spawning
    if (
      !this.waveDelayTimer &&
      currentTime - this.lastSpawnTime > this.enemySpawnRate
    ) {
      this.lastSpawnTime =
        currentTime + this.waves[this.waveNumber].waveStartDelay;
      this.waveDelayTimer = setTimeout(() => {
        this.spawnWave();
        this.waveDelayTimer = null;
      }, this.waves[this.waveNumber].waveStartDelay);
    }

    // Move and manage existing enemies
    this.enemies.forEach((enemy, index) => {
      enemy.move();
      if (enemy.reachedTarget) {
        this.playerHealth -= enemy.damage;
        this.enemies.splice(index, 1);
      }
      if (enemy.health <= 0) {
        this.increaseMoney();
        this.enemies.splice(index, 1);
      }
    });

    this.grid.cells.flat().forEach((cell) => {
      if (cell?.type === CELL_TYPE.TOWER) {
        if (cell.shootingCooldown > 0) {
          cell.shootingCooldown -= currentTime - cell.lastShotTime;
          if (cell.shootingCooldown < 0) {
            cell.shootingCooldown = 0;
          }
        }
      }
    });

    // Handle shooting and projectiles
    this.shootEnemies();
    this.updateProjectiles();

    if (this.playerHealth <= 0) {
      this.gameOver();
    }

    this.cdr.detectChanges();
  }

  shootProjectile(fromTower: any, targetEnemy: Enemy): void {
    const projectile = new Projectile(
      this.grid,
      fromTower.x * this.grid.getCellSize() + this.grid.getCellSize() / 2,
      fromTower.y * this.grid.getCellSize() + this.grid.getCellSize() / 2,
      5, // Speed of the projectile
      fromTower.damage, // Damage of the tower
      targetEnemy
    );
    this.projectiles.push(projectile);
    fromTower.lastShotTime = Date.now(); // Set last shot time
  }

  updateProjectiles(): void {
    this.projectiles.forEach((projectile, index) => {
      projectile.update();
      if (!projectile.isActive) {
        // Assuming there's an isActive flag in Projectile class
        this.projectiles.splice(index, 1);
      }
    });
  }

  gameOver(): void {
    alert('Game Over! Starting new game...');
    this.resetGame();
  }

  resetGame(): void {
    this.playerHealth = 100; // Reset health
    this.playerMoney = 160; // Reset money
    this.enemies = []; // Clear enemies
    this.waveNumber = 0; // Reset waves
    this.lastSpawnTime = Date.now(); // Reset spawn timer
    this.grid.initCells(); // Reinitialize grid with bases
    this.play(); // Restart the game loop
    this.waveDelayTimer = null; // Reset wave delay timer
    this.isPlacingTower = false; // Reset tower placement
    this.clearSelected(); // Clear selected cell
    this.towerToPlace = null; // Reset tower to place

    this.grid.initializeCells();
    this.grid.initCells();
  }

  shootEnemies() {
    this.grid.cells.flat().forEach((cell) => {
      if (cell && cell.type === CELL_TYPE.TOWER) {
        if (cell.shootingCooldown <= 0) {
          // Check if tower can shoot
          const closestEnemy = this.findClosestEnemy(
            cell.x,
            cell.y,
            cell.range
          );
          if (closestEnemy) {
            this.shootProjectile(cell, closestEnemy);
            cell.shootingCooldown = cell.attackSpeed; // Set shootingCooldown
          }
        }
      }
    });
  }

  findClosestEnemy(
    towerX: number,
    towerY: number,
    range: number
  ): Enemy | null {
    let closestEnemy = null;
    let minDist = range;
    this.enemies.forEach((enemy) => {
      let dx =
        towerX * this.grid.getCellSize() +
        this.grid.getCellSize() / 2 -
        enemy.x;
      let dy =
        towerY * this.grid.getCellSize() +
        this.grid.getCellSize() / 2 -
        enemy.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDist) {
        minDist = distance;
        closestEnemy = enemy;
      }
    });
    return closestEnemy;
  }

  spawnWave(): void {
    let wave = this.waves[this.waveNumber];
    let initialDelay = 0;
    let timeBetweenWaves = 5000; // Time in ms between waves

    for (let i = 0; i < wave.count; i++) {
      setTimeout(() => {
        let enemyBase = this.getBaseCoords(CELL_TYPE.ENEMY_BASE);
        let playerBase = this.getBaseCoords(CELL_TYPE.PLAYER_BASE);
        let newEnemy = new Enemy(
          this.grid,
          enemyBase.x,
          enemyBase.y,
          wave.speed,
          wave.damage,
          wave.health
        );
        newEnemy.findPath(playerBase.x, playerBase.y);
        this.enemies.push(newEnemy);
        this.cdr.detectChanges();
      }, initialDelay);

      initialDelay += wave.spawnDelay;
    }

    this.lastSpawnTime = Date.now() + initialDelay + timeBetweenWaves; // Reset the spawn timer after the last enemy is scheduled and add delay between waves
    this.generateNextWave(this.waves);
    this.waveNumber++;
  }

  getBaseCoords(baseType: string): { x: number; y: number } | null {
    let baseCoordinates = null;
    this.grid.cells.flat().forEach((cell, index) => {
      if (cell && cell.type === baseType) {
        const y = Math.floor(index / this.grid.cells[0].length);
        const x = index % this.grid.cells[0].length;
        baseCoordinates = { x, y };
      }
    });
    return baseCoordinates;
  }

  draw(): void {
    if (this.isGamePaused) return; // Skip drawing if the game is paused
    this.clearCanvas();
    this.grid.drawGrid();

    this.renderPlayerHealth();

    this.enemies.forEach((enemy) => enemy.draw(this.ctx));
    this.projectiles.forEach((projectile) => projectile.draw(this.ctx)); // Draw projectiles

    if (this.currentlySelected.type === 'tower' || this.isPlacingTower) {
      this.ctx.save();
      let cellSize = this.grid.getCellSize();
      let centerX = this.currentMouseCell.x * cellSize + cellSize / 2;
      let centerY = this.currentMouseCell.y * cellSize + cellSize / 2;

      // Draw the filled cell
      if (this.isPlacingTower) {
        this.grid.drawInCell(
          this.currentMouseCell.x,
          this.currentMouseCell.y,
          this.towerToPlace.color
        );
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.towerToPlace.range, 0, 2 * Math.PI);
        this.ctx.strokeStyle = this.towerToPlace.color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.globalAlpha = 0.1;
        this.ctx.fillStyle = this.towerToPlace.color;
        this.ctx.fill();

        this.ctx.restore();
      }

      this.grid.cells.flat().forEach((cell) => {
        if (
          cell &&
          cell.type === CELL_TYPE.TOWER &&
          this.currentlySelected.x === cell.x &&
          this.currentlySelected.y === cell.y
        ) {
          let gridSize = this.grid.getCellSize();

          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.arc(
            cell.x * gridSize + gridSize / 2,
            cell.y * gridSize + gridSize / 2,
            cell.range,
            0,
            2 * Math.PI
          );
          this.ctx.strokeStyle = cell.color;
          this.ctx.lineWidth = 2;
          this.ctx.stroke();

          this.ctx.globalAlpha = 0.1;
          this.ctx.fillStyle = cell.color;
          this.ctx.fill();

          this.ctx.restore();
        }
      });

      this.ctx.restore();
    }

    this.grid.drawCells(this.currentlySelected);
    this.drawHealthBars();
  }

  getTowerColor(towerId: string): string {
    let tower = this.towers.find((tower) => tower.id === towerId);
    return tower.color;
  }

  drawHealthBars(): void {
    this.grid.cells.flat().forEach((cell) => {
      if (cell) {
        switch (cell.type) {
          case CELL_TYPE.ENEMY_BASE:
            this.grid.drawHealthBar(cell.x, cell.y, this.enemyHealth);
            break;
          case CELL_TYPE.PLAYER_BASE:
            this.grid.drawHealthBar(cell.x, cell.y, this.playerHealth);
            break;
        }
      }
    });
  }

  renderPlayerHealth() {
    let width = this.healthBar.nativeElement.offsetWidth - 5;
    let healthWidth = (this.playerHealth / 100) * width;

    let red = Math.min(255, (100 - this.playerHealth) * 2.55 * 2);
    let green = Math.min(255, this.playerHealth * 2.55 * 2);

    let color = `rgb(${red.toFixed(0)}, ${green.toFixed(0)}, 0)`;

    this.playerHealthBarColor = color;
    this.playerhealthBarWidth = healthWidth;

    this.healthBar.nativeElement.style.setProperty('--health-bar-color', color);
    this.healthBar.nativeElement.style.setProperty(
      '--health-bar-width',
      `${healthWidth}px`
    );
  }

  clearCanvas(): void {
    this.ctx.save();
    this.ctx.fillStyle = COLORS.NIGHT_BLACK;
    this.ctx.fillRect(
      0,
      0,
      this.gameCanvas.nativeElement.width,
      this.gameCanvas.nativeElement.height
    );
    this.ctx.restore();
  }

  increaseMoney(): void {
    this.playerMoney += 10;
  }
  decreaseMoney(): void {
    this.playerMoney -= 10;
  }

  increaseHealth(): void {
    if (this.playerHealth >= 100) return;

    this.playerHealth += 10;
  }
  decreaseHealth(): void {
    this.playerHealth -= 10;
  }
}
