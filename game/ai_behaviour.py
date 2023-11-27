import random
import pygame
class AIBehaviour:
    # Constants
    SPEED = 10
    GRAVITY = 2
    LONG_DISTANCE_THRESHOLD = 400
    MEDIUM_DISTANCE_THRESHOLD = 150
    CLOSE_DISTANCE_THRESHOLD = 50
    HIGH_HEALTH_THRESHOLD = 75
    MEDIUM_HEALTH_THRESHOLD = 50
    
    def __init__(self, fighter):
        """
        @DEV Initializes the AI Behaviour with a reference to the fighter it controls.
        @param fighter: The character object that this AI controls.
        """
        self.fighter = fighter
        self.current_movement_timer = 0
        self.current_action_timer = 0
        self.current_movement = self.idle_ai
        self.current_action = self.idle_ai

    def calculate_distance(self, target):
        """
        @DEV Calculates the distance between the AI and the target.
        @param target: The character object that is the target.
        """
        return abs(self.fighter.rect.x - target.rect.x)
  
    def targets_direction(self, target):
        """
        @DEV Calculates the direction to the target (1 for right, -1 for left).
        @param target: The character object that is the target.
        """
        return 1 if target.rect.x > self.fighter.rect.x else -1
    
    
    """
    ===============================Movements/actions=====================
    """
    
    def approach_ai(self, target):
        """
        @DEV Moves the fighter towards the target.
        @param target: The character object that is the target.
        """
        self.fighter.running = True
        dx = self.SPEED * self.targets_direction(target)
        return dx
    
    def retreat_ai(self, target):
        """
        @DEV Moves the fighter away from the target.
        @param target: The character object that is the target.
        """
        self.fighter.running = True
        dx = -self.SPEED * self.targets_direction(target)
        return dx

    def jump_ai(self, target):
        """
        @DEV Makes the fighter jump.
        @param target: The character object that is the target.
        """
        if self.fighter.jump_cooldown_1 == 0:
            self.fighter.vel_y = -30
            self.fighter.jump = True
            self.fighter.jump_cooldown_1 = 30
  
    def attack_ai(self, target):
        """
        @DEV Makes the fighter perform an attack action.
        @param target: The character object that is the target.
        """
        
        if self.fighter.attack_cooldown == 0:
            self.fighter.attacking = True
            self.fighter.attack_type = random.randint(1, 2)
            self.fighter.attack_cooldown = 50
            self.fighter.state = "Combat"
            offset_x = target.rect.x - self.fighter.rect.x + (80 if self.fighter.fighter_id == 1 else -80)
            offset_y = target.rect.y - self.fighter.rect.y
            
            if self.fighter.mask.overlap(target.mask, (offset_x, offset_y)):
                target.health -= 10
                print("Fighter health:", target.health, "Fighter hit:", target.fighter_id)
                target.hit = True
        
    def defend_ai(self,target):
        """
        @DEV Makes the fighter perform a defensive action.
        @param target: The character object that is the target.
        """
        self.fighter.vel_y = -3
        self.fighter.jump = True  # makes the character jump to simulate a defense posture
        self.fighter.state = "Combat"

    def idle_ai(self,target):
        """
        @TODO: false also the attacks ? 
        @DEV Makes the fighter idle.
        @param target: The character object that is the target.
        """
        self.fighter.running = False
        self.fighter.jump = False
        dx = 0
        return dx 
 
    def take_hit(self, damage):
        """
        @DEV
        Handle the fighter taking damage.
        
        @param damage: int, the amount of damage to be taken.
        """
        self.fighter.health -= damage
        if self.fighter.health <= 0:
            self.fighter.alive = False
            self.fighter.death_time = pygame.time.get_ticks()   
    
    """
    ===========================Combat decisions==========================
    """    
    def combat_behaviour(self, target):
            """
            Defines the combat behavior of the AI.
            """
            dy = 0
            # Apply gravity
            self.fighter.vel_y += self.GRAVITY
            dy += self.fighter.vel_y

            # Get the distance to the target
            distance = self.calculate_distance(target)

            # Determine combat behavior based on fighter's health
            if self.fighter.health > self.HIGH_HEALTH_THRESHOLD:
                dx=self.aggressive_behaviour(target, distance)
            elif self.MEDIUM_HEALTH_THRESHOLD < self.fighter.health <= self.HIGH_HEALTH_THRESHOLD:
                dx=self.balanced_behaviour(target, distance)
            else:  # Low health
               dx= self.defensive_behaviour(target, distance)

            # Handle cooldowns and timers
            self._handle_cooldowns_and_timers()

            # Update fighter position
            self.fighter.rect.x += self.current_movement(target)
            self.fighter.rect.y += dy
            
            return dx, dy
    
    def aggressive_behaviour(self, target, distance):
        """
        Aggressive behavior for high health.
        """
        if distance > self.LONG_DISTANCE_THRESHOLD:
            movements = [self.approach_ai, self.idle_ai]
            movement_weights = [80, 20]
            actions = [self.attack_ai, self.jump_ai]
            action_weights = [70, 30]
        else:
            movements = [self.approach_ai]
            movement_weights = [100]
            actions = [self.attack_ai]
            action_weights = [100]

        dx = self._update_current_movement(target, movements, movement_weights)
        self._update_current_action(target, actions, action_weights)
        return dx

    def balanced_behaviour(self, target, distance):
        """
        Balanced behavior for medium health.
        """
        if distance > self.MEDIUM_DISTANCE_THRESHOLD:
            movements = [self.approach_ai, self.retreat_ai, self.jump_ai]
            movement_weights = [40, 30, 30]
            actions = [self.attack_ai, self.jump_ai]
            action_weights = [50, 50]
        else:
            movements = [self.retreat_ai, self.jump_ai]
            movement_weights = [50, 50]
            actions = [self.attack_ai, self.defend_ai]
            action_weights = [40, 60]

        dx = self._update_current_movement(target, movements, movement_weights)
        self._update_current_action(target, actions, action_weights)
        return dx
        
    def defensive_behaviour(self, target, distance):
        """
        Defensive behavior for low health.
        """
        if distance > self.CLOSE_DISTANCE_THRESHOLD:
            movements = [self.retreat_ai, self.jump_ai]
            movement_weights = [60, 40]
            actions = [self.defend, self.idle_ai]
            action_weights = [70, 30]
        else:
            movements = [self.retreat_ai]
            movement_weights = [100]
            actions = [self.defend_ai]
            action_weights = [100]

        dx = self._update_current_movement(target, movements, movement_weights)
        self._update_current_action(target, actions, action_weights)
        return dx
    
    def _update_current_movement(self, target, movements, weights):
        """
        @DEV Updates the current movement of the fighter based on choices.
        @param target: The character object that is the target.
        @param movements: List of movement functions.
        @param weights: Weights for selecting a movement function.
        """
        if self.current_movement_timer <= 0:
            self.current_movement = random.choices(movements, weights)[0]
            self.current_movement_timer = random.randint(30, 60)
        dx = self.current_movement(target)
        return dx

    def _update_current_action(self, target, actions, action_weights):
        """
        @DEV Updates the current action of the fighter based on choices.
        @param target: The character object that is the target.
        @param actions: List of action functions.
        @param action_weights: Weights for selecting an action function.
        """
        if self.current_action_timer <= 0:
            self.current_action = random.choices(actions, action_weights)[0]
            self.current_action_timer = random.randint(30, 60)
        self.current_action(target)

    def _handle_cooldowns_and_timers(self):
        """
        @DEV Handles cooldowns and timers for the fighter.
        """
    
        # Handle cooldowns
        if self.fighter.attack_cooldown > 0: 
            self.fighter.attack_cooldown -= 1
            
        if self.fighter.jump_cooldown_1 > 0: 
            self.fighter.jump_cooldown_1 -= 1
        
        # Handle movement and action timers
        if self.current_movement_timer > 0: self.current_movement_timer -= 1
        if self.current_action_timer > 0: self.current_action_timer -= 1
