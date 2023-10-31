import pygame
import json

# Define constants for readability and ease of configuration
ANIMATION_COOLDOWN = 50
ATTACK_COOLDOWN = 20
MINOR_ATTACK_COOLDOWN = 2
GRAVITY = 2
SPEED = 10
FLOOR_HEIGHT = 110

class Fighter(pygame.sprite.Sprite):
    # @DEV
    # @param player: int, represents the player number (e.g., 1 or 2).
    # @param x: int, the x-coordinate where the fighter will be spawned.
    # @param y: int, the y-coordinate where the fighter will be spawned.
    # @param flip: bool, determines if the image of the fighter should be flipped.
    # @param fighter_def_file: str, the path to the fighter definition file in JSON format.
    def __init__(self, player, x, y, flip, fighter_def_file):
        super().__init__()
        
        with open(fighter_def_file, 'r') as f:
            fighter_def = json.load(f)
            
        # Load sprite sheet and define animations
        sprite_sheet = pygame.image.load(fighter_def['sprite_sheet']).convert_alpha()
        self.animation_list = self._load_images(sprite_sheet, fighter_def['animation_steps'], fighter_def['size'], fighter_def['scale'])
        
        # Initialize fighter attributes
        self.player = player
        self.size = fighter_def['size']
        self.offset = fighter_def['offset']
        self.flip = flip
        self.rect = pygame.Rect((x, y, 80, 180))
        self.action = 0
        self.frame_index = 0
        self.image = self.animation_list[self.action][self.frame_index]
        self.update_time = pygame.time.get_ticks()
        self.vel_y = 0
        self.reset()
        self.attack_sound = pygame.mixer.Sound(fighter_def['sound'])
        self.mask = pygame.mask.from_surface(self.image)
        self._load_config(fighter_def_file)
        self.ai_behaviour = AIBehaviour(self)

    def _load_config(self, config_file):
        """
        @DEV
        Load control configurations from the given file.
        
        @param config_file: str, the path to the configuration file in JSON format.
        """
        with open(config_file, "r") as f:
            config = json.load(f)
        
        # Assign control configurations to attributes
        self.move_left = config["move_left"]
        self.move_right = config["move_right"]
        self.move_up = config["move_up"]
        self.attack_1 = config["attack_1"]
        self.attack_2 = config["attack_2"]
        self.combo_1 = config["combo_1"]
        self.combo_2 = config["combo_2"]
        self.combo_3 = config["combo_3"]

    def _load_images(self, sprite_sheet, animation_steps, size, scale):
        """
        @DEV
        Load images from the sprite sheet for animations.
        
        @param sprite_sheet: pygame.Surface, the sprite sheet image.
        @param animation_steps: list of int, number of frames in each animation.
        @param size: int, size of each frame in the sprite sheet.
        @param scale: int, scale factor for resizing the images.
        @return: list of list of pygame.Surface, the loaded and scaled images grouped by animation.
        """
        animation_list = []
        for y, animation in enumerate(animation_steps):
            temp_img_list = []
            for x in range(animation):
                temp_img = sprite_sheet.subsurface(x * size, y * size, size, size)
                temp_img_list.append(pygame.transform.scale(temp_img, (size * scale, size * scale)))
            animation_list.append(temp_img_list)
        return animation_list

    def _ensure_on_screen(self, dx, dy, screen_width, screen_height):
        """
        @DEV
        Ensure the fighter stays within the screen boundaries.
        
        @param dx: int, change in x-coordinate.
        @param dy: int, change in y-coordinate.
        @param screen_width: int, width of the screen.
        @param screen_height: int, height of the screen.
        @return: tuple of (int, int), adjusted dx and dy values.
        """
        if self.rect.left + dx < 0:
            dx = -self.rect.left
        if self.rect.right + dx > screen_width:
            dx = screen_width - self.rect.right
        if self.rect.bottom + dy > screen_height - FLOOR_HEIGHT:
            self.vel_y = 0
            self.jump = False
            dy = screen_height - FLOOR_HEIGHT - self.rect.bottom
        return dx, dy

    def _face_opponent(self, target):
        """
        @DEV
        Adjust the fighter's orientation to face the opponent.
        
        @param target: pygame.Rect, the opponent's rect attribute to determine their position.
        """
        if self.rect.x < target.x:
            self.flip = False
        elif self.rect.x > target.x:
            self.flip = True

    def update(self, target, screen_width, screen_height):
        # Reset action variable
        action = 0
        
        # Set cooldown variables
        ATTACK_COOLDOWN = 20 if self.attack_type == 'major' else MINOR_ATTACK_COOLDOWN
        
        # Check alive status
        if self.alive:
            # Check for attack cooldown
            if self.attack:
                if pygame.time.get_ticks() - self.attack_time > ATTACK_COOLDOWN:
                    self.attack = False
                    self.frame_index = 0
                action = 4
            else:
                # Move player and apply gravity
                keys = pygame.key.get_pressed()
                dx, dy = self.move(keys, screen_width, screen_height)
                self.rect.x += dx
                self.rect.y += dy
                
                # Handle orientation
                self._face_opponent(target.rect)
                
                # Update actions
                if dy < 0:
                    action = 3  # Jumping
                elif dy > 1:
                    action = 2  # Falling
                elif dx != 0:
                    action = 1  # Running
                else:
                    action = 0  # Idle
        else:
            action = 5  # Dead
            self.image = self.animation_list[action][0]
            if pygame.time.get_ticks() - self.death_time > 3000:
                self.kill()
                
        # Handle AI behaviour
        if self.ai:
            action = self.ai_behaviour.update(target, action)
            
        # Handle animations
        self._handle_animations(action)
        self.update_time = pygame.time.get_ticks()

    def _handle_animations(self, action):
        """
        @DEV
        Handle sprite animations based on the current action.
        
        @param action: int, the current action of the fighter.
        """
        animation_cooldown = ANIMATION_COOLDOWN
        
        # Update frame index
        if pygame.time.get_ticks() - self.update_time > animation_cooldown:
            self.frame_index += 1
            
        # Reset animation
        if self.frame_index >= len(self.animation_list[action]):
            if action == 4:
                self.frame_index = len(self.animation_list[action]) - 1
            else:
                self.frame_index = 0
                
        # Set action and update image
        self.action = action
        self.image = self.animation_list[action][self.frame_index]
        if self.flip:
            self.image = pygame.transform.flip(self.image, True, False)

    def attack_enemy(self, target):
        """
        @DEV
        Handle attacking the enemy fighter.
        
        @param target: Fighter, the opponent fighter instance.
        """
        if self.attack_type == 'major':
            damage = 15
            knockback = 20
        else:
            damage = 5
            knockback = 10
        target.health -= damage
        if target.health < 0:
            target.health = 0
        target.rect.x += knockback * (-1 if self.flip else 1)
        self.attack = True
        self.attack_time = pygame.time.get_ticks()
        self.attack_sound.play()

    def move(self, keys, screen_width, screen_height):
        """
        @DEV
        Handle movement and jumping of the fighter.
        
        @param keys: list of bool, the current state of all keyboard keys.
        @param screen_width: int, the width of the screen.
        @parama screen_height: int, the height of the screen.
        @return: tuple of (int, int), the change in x and y coordinates.
        """
        # Initialize change in position
        dx = 0
        dy = 0

        # Handle movement
        if keys[self.move_left]:
            dx = -SPEED
        if keys[self.move_right]:
            dx = SPEED
        if keys[self.move_up] and not self.jump:
            self.vel_y = -30
            self.jump = True
            
        # Handle gravity
        self.vel_y += GRAVITY
        if self.vel_y > 10:
            self.vel_y
        dy += self.vel_y

        # Ensure the player stays on screen
        dx, dy = self._ensure_on_screen(dx, dy, screen_width, screen_height)

        return dx, dy

    def reset(self):
        """
        @DEV
        Reset the fighter's state.
        """
        self.alive = True
        self.health = 100
        self.attack = False
        self.attack_time = 0
        self.attack_type = 'major'
        self.jump = False

    def take_hit(self, damage):
        """
        @DEV
        Handle the fighter taking damage.
        
        @param damage: int, the amount of damage to be taken.
        """
        self.health -= damage
        if self.health <= 0:
            self.alive = False
            self.death_time = pygame.time.get_ticks()

    def draw(self, surface):
        """
        @DEV
        Draw the fighter onto the given surface.
        
        @param surface: pygame.Surface, the surface to draw the fighter on.
        """
        surface.blit(self.image, (self.rect.x - self.offset[0], self.rect.y - self.offset[1]))
        pygame.draw.rect(surface, (255, 0, 0), self.rect, 2)

# Example usage
fighter1 = Fighter(1, 100, 100, False, 'fighter1_def.json')
fighter2 = Fighter(2, 300, 100, True, 'fighter2_def.json')
