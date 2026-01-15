using UnityEngine;
using System.Collections.Generic;

[System.Serializable]
public class City
{
    public string name;
    public Vector3 position;
    public GameObject cityIcon;
    public GameObject cityUIPanel;
}

public class CityManager : MonoBehaviour
{
    public GameObject cityIconPrefab; // Prefab for city icons
    public Transform canvasTransform; // Reference to UI canvas
    public int numberOfCities = 10;
    public float minCityDistance = 20f;
    
    private List<City> cities = new List<City>();
    private TerrainGenerator terrainGenerator;
    
    void Start()
    {
        terrainGenerator = FindObjectOfType<TerrainGenerator>();
        GenerateCities();
    }
    
    public void GenerateCities()
    {
        // Clear existing cities
        foreach(City city in cities)
        {
            if(city.cityIcon != null)
                Destroy(city.cityIcon);
            if(city.cityUIPanel != null)
                Destroy(city.cityUIPanel);
        }
        cities.Clear();
        
        // Generate new cities
        for(int i = 0; i < numberOfCities; i++)
        {
            Vector3 position = GetValidCityPosition();
            
            // Create city icon
            GameObject cityIcon = Instantiate(cityIconPrefab);
            RectTransform rectTransform = cityIcon.GetComponent<RectTransform>();
            rectTransform.SetParent(canvasTransform, false);
            
            // Position icon in world space
            UpdateIconPosition(rectTransform, position);
            
            // Create city data
            City city = new City
            {
                name = "City " + (i + 1),
                position = position,
                cityIcon = cityIcon
            };
            
            // Add click handler
            CityIconHandler iconHandler = cityIcon.GetComponent<CityIconHandler>();
            if(iconHandler != null)
            {
                iconHandler.Initialize(city, this);
            }
            
            cities.Add(city);
        }
    }
    
    Vector3 GetValidCityPosition()
    {
        Vector3 position;
        bool isValid = false;
        int attempts = 0;
        
        while(!isValid && attempts < 100)
        {
            // Generate random position on terrain
            float x = Random.Range(-terrainGenerator.terrainWidth/2f, terrainGenerator.terrainWidth/2f);
            float z = Random.Range(-terrainGenerator.terrainHeight/2f, terrainGenerator.terrainHeight/2f);
            
            // Get height at this position from terrain
            Terrain terrain = FindObjectOfType<Terrain>();
            float y = terrain.SampleHeight(new Vector3(x, 0, z)) + 2f; // Add slight elevation
            
            position = new Vector3(x, y, z);
            
            // Check distance from other cities
            isValid = true;
            foreach(City city in cities)
            {
                if(Vector3.Distance(position, city.position) < minCityDistance)
                {
                    isValid = false;
                    break;
                }
            }
            
            attempts++;
        }
        
        if(attempts >= 100)
        {
            // Fallback: just get a position far from others
            float x = Random.Range(-terrainGenerator.terrainWidth/2f, terrainGenerator.terrainWidth/2f);
            float z = Random.Range(-terrainGenerator.terrainHeight/2f, terrainGenerator.terrainHeight/2f);
            Terrain terrain = FindObjectOfType<Terrain>();
            float y = terrain.SampleHeight(new Vector3(x, 0, z)) + 2f;
            return new Vector3(x, y, z);
        }
        
        return position;
    }
    
    void UpdateIconPosition(RectTransform iconTransform, Vector3 worldPosition)
    {
        Camera mainCamera = Camera.main;
        Vector3 screenPoint = mainCamera.WorldToScreenPoint(worldPosition);
        
        // Only update if the position is in front of the camera
        if(screenPoint.z > 0)
        {
            iconTransform.position = screenPoint;
        }
    }
    
    public void UpdateAllIcons()
    {
        foreach(City city in cities)
        {
            if(city.cityIcon != null)
            {
                RectTransform rectTransform = city.cityIcon.GetComponent<RectTransform>();
                UpdateIconPosition(rectTransform, city.position);
            }
        }
    }
    
    public List<City> GetAllCities()
    {
        return cities;
    }
    
    public void OnCitySelected(City selectedCity)
    {
        // Hide other city panels
        foreach(City city in cities)
        {
            if(city.cityUIPanel != null)
            {
                city.cityUIPanel.SetActive(false);
            }
        }
        
        // Show selected city panel
        ShowCitySelectionPanel(selectedCity);
    }
    
    void ShowCitySelectionPanel(City city)
    {
        // Create or reuse a UI panel for city selection
        GameObject panel = new GameObject("CitySelectionPanel");
        panel.transform.SetParent(canvasTransform, false);
        
        // Add UI components (these would normally come from prefabs)
        RectTransform rectTransform = panel.AddComponent<RectTransform>();
        rectTransform.sizeDelta = new Vector2(300, 200);
        
        // Position near the city icon
        Camera mainCamera = Camera.main;
        Vector3 screenPos = mainCamera.WorldToScreenPoint(city.position);
        rectTransform.position = screenPos + new Vector3(30, 30, 0);
        
        // Add UI elements (would be better with prefabs in real implementation)
        GameObject titleText = new GameObject("TitleText");
        titleText.transform.SetParent(panel.transform, false);
        TMPro.TextMeshProUGUI titleTMP = titleText.AddComponent<TMPro.TextMeshProUGUI>();
        titleTMP.text = city.name;
        titleTMP.fontSize = 24;
        titleTMP.alignment = TMPro.TextAlignmentOptions.Center;
        
        RectTransform titleRect = titleText.GetComponent<RectTransform>();
        titleRect.anchorMin = new Vector2(0, 1);
        titleRect.anchorMax = new Vector2(1, 1);
        titleRect.pivot = new Vector2(0.5f, 1);
        titleRect.anchoredPosition = new Vector2(0, 0);
        titleRect.sizeDelta = new Vector2(0, 40);
        
        GameObject enterButton = new GameObject("EnterButton");
        enterButton.transform.SetParent(panel.transform, false);
        UnityEngine.UI.Button buttonComponent = enterButton.AddComponent<UnityEngine.UI.Button>();
        
        RectTransform buttonRect = enterButton.AddComponent<RectTransform>();
        buttonRect.anchorMin = new Vector2(0.5f, 0.5f);
        buttonRect.anchorMax = new Vector2(0.5f, 0.5f);
        buttonRect.pivot = new Vector2(0.5f, 0.5f);
        buttonRect.anchoredPosition = new Vector2(0, -20);
        buttonRect.sizeDelta = new Vector2(100, 40);
        
        GameObject buttonText = new GameObject("ButtonText");
        buttonText.transform.SetParent(enterButton.transform, false);
        TMPro.TextMeshProUGUI buttonTMP = buttonText.AddComponent<TMPro.TextMeshProUGUI>();
        buttonTMP.text = "Enter";
        buttonTMP.fontSize = 18;
        buttonTMP.alignment = TMPro.TextAlignmentOptions.Center;
        
        RectTransform textRect = buttonText.GetComponent<RectTransform>();
        textRect.anchorMin = Vector2.zero;
        textRect.anchorMax = Vector2.one;
        textRect.offsetMin = Vector2.zero;
        textRect.offsetMax = Vector2.zero;
        
        // Add click listener
        buttonComponent.onClick.AddListener(() => EnterCity(city));
        
        city.cityUIPanel = panel;
    }
    
    void EnterCity(City city)
    {
        Debug.Log("Entering city: " + city.name);
        // Transition to city screen
        SceneTransitionManager.Instance.TransitionToCityScene(city);
    }
}