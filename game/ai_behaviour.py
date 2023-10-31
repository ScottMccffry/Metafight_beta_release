import random

class AIBehaviour:
    # Constants
    SPEED = 10
    GRAVITY = 2
    LONG_DISTANCE_THRESHOLD = 400
    MEDIUM_DISTANCE_THRESHOLD = 150
    CLOSE_DISTANCE_THRESHOLD = 50
    HIGH_HEALTH_THRESHOLD = 6
    MEDIUM_HEALTH_THRESHOLD = 5
    
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
    def approach(self, target):
        """
        @DEV Moves the fighter towards the target.
        @param target: The character object that is the target.
        """
        self.fighter.running = True
        dx = self.SPEED * self.targets_direction(target)
        return dx
    
    def retreat(self, target):
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
        """
        might be an error here because: not using target, and two cooldowns
        """
        if self.fighter.jump_cooldown_2 == 0:
            self.fighter.vel_y = -30
            self.fighter.jump = True
            self.fighter.jump_cooldown_2 = 30
    
    def attack_ai(self, target):
        """
        @DEV Makes the fighter perform an attack action.
        @param target: The character object that is the target.
        """
        if self.fighter.attack_cooldown_1 == 0:
            self.fighter.attacking = True
            self.fighter.attack_type = random.randint(1, 2)
            self.fighter.attack_cooldown_1 = 30
            self.fighter.state = "Combat"

        if self.fighter.attack_cooldown_2 == 0:
            self.fighter.attacking = True
            self.fighter.attack_type = random.randint(1, 2)
            self.fighter.attack_cooldown_2 = 30
            self.fighter.state = "Combat"
        
        offset_x = target.rect.x - self.fighter.rect.x + (190 if self.fighter.fighter_id == 1 else -190)
        offset_y = target.rect.y - self.fighter.rect.y
        if self.fighter.mask.overlap(target.mask, (offset_x, offset_y)):
            target.health -= 10
            target.hit = True
    
    def defend(self):
        """
        @DEV Makes the fighter perform a defensive action.
        @param target: The character object that is the target.
        """
        self.fighter.vel_y = -3
        self.fighter.jump = True  # makes the character jump to simulate a defense posture
        self.fighter.state = "Combat"

    def idle_ai(self):
        """
        @TODO: false also the attacks ? 
        @DEV Makes the fighter idle.
        @param target: The character object that is the target.
        """
        self.fighter.running = False
        self.fighter.jump = False
        dx = 0
        return dx 
"""
===========================Combat decisions==========================
"""    
    def combat_behaviour(self, target):
        """
        @DEV Defines the combat behavior of the AI.
        @param target: The character object that is the target.
        """
        dy = 0
        # Apply gravity
        self.fighter.vel_y += self.GRAVITY
        dy += self.fighter.vel_y
        # Get the distance to the target
        distance = self.calculate_distance(target)
        # Action decision-making based on distance to target and own health
        if self.fighter.health > self.HIGH_HEALTH_THRESHOLD:
            # Define movement and action choices based on distance
            movements, weights, actions, action_weights = self._define_choices_based_on_distance(distance)
            # Update current movement
            dx = self._update_current_movement(target, movements, weights)
            # Update current action
            self._update_current_action(target, actions, action_weights)
        elif self.MEDIUM_HEALTH_THRESHOLD < self.fighter.health <= self.HIGH_HEALTH_THRESHOLD:
            # Define behavior for medium-high health
            pass
        elif self.fighter.health <= self.MEDIUM_HEALTH_THRESHOLD:
            # Define behavior for low health
            pass
        # Update fighter position
        self.fighter.rect.x += dx
        self.fighter.rect.y += dy
        # Handle cooldowns and timers
        self._handle_cooldowns_and_timers()
        
    def _define_choices_based_on_distance(self, distance):
        """
        @DEV Defines movement and action choices based on the distance to the target.
        @param distance: The distance to the target.
        """
        if distance > self.LONG_DISTANCE_THRESHOLD:
            movements = [self.approach, self.retreat, self.idle_ai]
            weights = [70, 10, 20]
            actions = [self.idle_ai, self.jump_ai, self.attack_ai]
            action_weights = [80, 20, 5]
        elif self.MEDIUM_DISTANCE_THRESHOLD < distance <= self.LONG_DISTANCE_THRESHOLD:
            movements = [self.approach, self.retreat, self.idle_ai]
            weights = [50, 30, 20]
            actions = [self.idle_ai, self.jump_ai, self.attack_ai]
            action_weights = [50, 25, 25]
        elif self.MEDIUM_DISTANCE_THRESHOLD >= distance > self.CLOSE_DISTANCE_THRESHOLD:
            movements = [self.approach, self.retreat, self.idle_ai]
            weights = [10, 30, 20]
            actions = [self.idle_ai, self.jump_ai, self.attack_ai]
            action_weights = [10, 25, 50]
        elif distance <= self.CLOSE_DISTANCE_THRESHOLD:
            movements = [self.approach, self.retreat, self.idle_ai]
            weights = [10, 30, 20]
            actions = [self.idle_ai, self.jump_ai, self.attack_ai]
            action_weights = [10, 25, 50]
        return movements, weights, actions, action_weights
    
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
        if self.fighter.attack_cooldown_1 > 0: self.fighter.attack_cooldown_1 -= 1
        if self.fighter.attack_cooldown_2 > 0: self.fighter.attack_cooldown_2 -= 1
        if self.fighter.jump_cooldown_1 > 0: self.fighter.jump_cooldown_1 -= 1
        if self.fighter.jump_cooldown_2 > 0: self.fighter.jump_cooldown_2 -= 1
        # Handle movement and action timers
        if self.current_movement_timer > 0: self.current_movement_timer -= 1
        if self.current_action_timer > 0: self.current_action_timer -= 1
