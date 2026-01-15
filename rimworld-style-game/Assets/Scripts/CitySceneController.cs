using UnityEngine;
using UnityEngine.UI;

public class CitySceneController : MonoBehaviour
{
    [Header("UI Elements")]
    public Button backButton; // Button to return to world map
    public Text cityNameText; // Text to display city name
    
    [Header("Camera Settings")]
    public Camera cityCamera;
    public float orthographicSize = 10f; // Size for orthographic view
    
    private City currentCity;
    
    void Start()
    {
        SetupCityScene();
    }
    
    void SetupCityScene()
    {
        // Get the current city from the scene manager
        currentCity = SceneTransitionManager.Instance.GetCurrentCity();
        
        if(currentCity != null)
        {
            // Display city name
            if(cityNameText != null)
            {
                cityNameText.text = currentCity.name;
            }
        }
        
        // Set up camera for top-down view
        SetupCamera();
        
        // Set up UI buttons
        SetupUI();
        
        // Initialize city view (in a real implementation, this would populate buildings, etc.)
        InitializeCityView();
    }
    
    void SetupCamera()
    {
        if(cityCamera == null)
            cityCamera = Camera.main;
        
        if(cityCamera != null)
        {
            // Switch to orthographic for top-down 2D-like view
            cityCamera.orthographic = true;
            cityCamera.orthographicSize = orthographicSize;
            cityCamera.transform.rotation = Quaternion.Euler(90f, 0f, 0f); // Look straight down
            cityCamera.transform.position = new Vector3(0f, 20f, 0f); // Position above the city center
        }
    }
    
    void SetupUI()
    {
        if(backButton != null)
        {
            backButton.onClick.AddListener(ReturnToWorld);
        }
    }
    
    void InitializeCityView()
    {
        // In a real implementation, this would generate the city layout
        // with buildings, roads, resources, etc.
        Debug.Log("Initializing city view for: " + (currentCity != null ? currentCity.name : "Unknown"));
        
        // Create some placeholder objects to represent the city
        CreateCityPlaceholderObjects();
    }
    
    void CreateCityPlaceholderObjects()
    {
        // Create a grid of objects to represent buildings
        int gridSize = 10;
        float spacing = 3f;
        
        for(int x = 0; x < gridSize; x++)
        {
            for(int z = 0; z < gridSize; z++)
            {
                if(Random.value > 0.7f) // Randomly place some "buildings"
                {
                    GameObject building = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    building.transform.position = new Vector3(
                        (x - gridSize/2) * spacing, 
                        1f, 
                        (z - gridSize/2) * spacing
                    );
                    building.transform.localScale = new Vector3(2f, Random.Range(2f, 5f), 2f);
                    
                    // Add a simple material for visual distinction
                    Renderer renderer = building.GetComponent<Renderer>();
                    if(renderer != null)
                    {
                        renderer.material = new Material(Shader.Find("Standard"));
                        renderer.material.color = new Color(
                            Random.Range(0.3f, 0.8f),
                            Random.Range(0.3f, 0.8f),
                            Random.Range(0.3f, 0.8f)
                        );
                    }
                }
            }
        }
    }
    
    public void ReturnToWorld()
    {
        SceneTransitionManager.Instance.ReturnToWorldFromCity();
    }
    
    void Update()
    {
        // Handle camera movement in city view
        HandleCityCameraMovement();
    }
    
    void HandleCityCameraMovement()
    {
        if(cityCamera == null) return;
        
        float moveSpeed = 10f * Time.deltaTime;
        
        // Move camera with arrow keys
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");
        
        Vector3 movement = new Vector3(horizontalInput, 0, verticalInput) * moveSpeed;
        cityCamera.transform.Translate(movement, Space.Self);
        
        // Zoom with scroll wheel
        float scrollInput = Input.GetAxis("Mouse ScrollWheel");
        if(scrollInput != 0)
        {
            float newSize = cityCamera.orthographicSize - scrollInput * 10f;
            cityCamera.orthographicSize = Mathf.Clamp(newSize, 5f, 50f);
        }
    }
}