import pygame

class CustomSpriteGroup(pygame.sprite.Group):
    def __init__(self):
        super().__init__()

    def draw(self, surface):
        for sprite in self.sprites():
            if hasattr(sprite, 'draw'):
                sprite.draw(surface)
            else:
                print(f"Warning: Object {sprite} does not have a draw method.")
                
            
    def reset(self):
        for sprite in self.sprites():
            sprite.reset()