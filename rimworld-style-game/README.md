# RimWorld-Style Game Project

This Unity project implements a RimWorld-style game with procedural terrain generation, city placement, and scene transitions.

## Features

- Procedurally generated terrain with configurable parameters
- Dynamic city placement system with collision avoidance
- Interactive camera controls (rotate, zoom, pan)
- City selection UI with pop-up panels
- Scene transitions between world map and city views
- Top-down city view with orthographic camera

## Project Structure

```
Assets/
├── Scripts/
│   ├── TerrainGenerator.cs      # Handles procedural terrain generation
│   ├── CityManager.cs           # Manages city placement and UI
│   ├── CityIconHandler.cs       # Handles city icon interactions
│   ├── CameraController.cs      # Implements camera movement controls
│   ├── SceneTransitionManager.cs # Manages scene transitions
│   ├── CitySceneController.cs   # Controls city view scene
│   ├── CityIconUpdater.cs       # Updates city icon positions
│   └── MainMenuController.cs    # Main menu functionality
├── Prefabs/                     # Game object prefabs
├── Materials/                   # Material assets
└── Scenes/                      # Unity scene files
```

## How to Set Up

1. Open the project in Unity 2022.3 or later
2. Create a new scene named "WorldScene" (this is the main world map scene)
3. Create a new scene named "CityScene" (for city views)
4. Add the following GameObjects to the WorldScene:
   - Main Camera with CameraController component
   - Empty GameObject with TerrainGenerator component
   - Empty GameObject with CityManager component
   - Canvas with CityIconUpdater component
   - Empty GameObject with SceneTransitionManager component
5. Create a city icon prefab with a UI Image and CityIconHandler component
6. In the CityScene, add a Camera and CitySceneController component

## Camera Controls

- **WASD or Arrow Keys**: Move camera horizontally
- **Mouse Wheel**: Zoom in/out
- **Middle Mouse Drag**: Rotate camera
- **Right Mouse Drag**: Pan camera

## City Interaction

- Click on city icons to see details
- Press "Enter" button to transition to city view
- Use back button to return to world map

## Customization Options

- Adjust terrain size and generation parameters in TerrainGenerator
- Modify number of cities and spacing in CityManager
- Change camera sensitivity in CameraController
- Customize city appearance and layout in CitySceneController

## Dependencies

This project uses standard Unity packages and does not require any external dependencies beyond the default Unity installation.