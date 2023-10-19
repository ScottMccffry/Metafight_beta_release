#!/bin/bash

# Define the base directory path where you want to create the directories
BASE_DIR="/Users/armandfatalot/Desktop/Metafight_beta_release/frontend/src/assets/images/characterGeneratorSprites"

# Define the main categories and their subcategories
# Create directories for body
mkdir -p "$BASE_DIR/body/Body_type" "$BASE_DIR/body/Shadow" "$BASE_DIR/body/Body_color" "$BASE_DIR/body/Special" "$BASE_DIR/body/Wounds" "$BASE_DIR/body/Prostheses" "$BASE_DIR/body/Lizard"

# Create directories for head
mkdir -p "$BASE_DIR/head/Heads" "$BASE_DIR/head/Ears" "$BASE_DIR/head/Nose" "$BASE_DIR/head/Eyes" "$BASE_DIR/head/Wrinkles" "$BASE_DIR/head/Beards" "$BASE_DIR/head/Hair" "$BASE_DIR/head/Appendages" "$BASE_DIR/head/Head_coverings" "$BASE_DIR/head/Hats_and_Helmets" "$BASE_DIR/head/Accessories" "$BASE_DIR/head/Neck"

# Create directories for arms
mkdir -p "$BASE_DIR/arms/Shoulders" "$BASE_DIR/arms/Armour" "$BASE_DIR/arms/Bauldron" "$BASE_DIR/arms/Wrists" "$BASE_DIR/arms/Gloves"

# Create directories for torso
mkdir -p "$BASE_DIR/torso/Shirts" "$BASE_DIR/torso/Aprons" "$BASE_DIR/torso/Bandages" "$BASE_DIR/torso/Chainmail" "$BASE_DIR/torso/Jacket" "$BASE_DIR/torso/Vest" "$BASE_DIR/torso/Armour" "$BASE_DIR/torso/Cape" "$BASE_DIR/torso/Waist"

# Create directories for legs
mkdir -p "$BASE_DIR/legs/Legs" "$BASE_DIR/legs/Boots" "$BASE_DIR/legs/Shoes"

# Create directories for tools
mkdir -p "$BASE_DIR/tools/Rod" "$BASE_DIR/tools/Smash" "$BASE_DIR/tools/Thrust" "$BASE_DIR/tools/Whip"

# Create directories for weapons
mkdir -p "$BASE_DIR/weapons/Shield" "$BASE_DIR/weapons/Quiver" "$BASE_DIR/weapons/Ranged" "$BASE_DIR/weapons/Sword" "$BASE_DIR/weapons/Blunt" "$BASE_DIR/weapons/Polearm" "$BASE_DIR/weapons/Magic" "$BASE_DIR/weapons/Misc" "$BASE_DIR/weapons/Preview" "$BASE_DIR/weapons/Walk"

echo "Directories created successfully!"

