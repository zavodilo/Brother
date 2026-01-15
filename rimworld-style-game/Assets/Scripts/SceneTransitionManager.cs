using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneTransitionManager : MonoBehaviour
{
    public static SceneTransitionManager Instance { get; private set; }
    
    [Header("Scene Names")]
    public string worldSceneName = "WorldScene";
    public string citySceneName = "CityScene";
    
    private City currentCity;
    
    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public void TransitionToCityScene(City city)
    {
        currentCity = city;
        
        // Save current city data if needed
        SaveCurrentCityData();
        
        // Load city scene
        SceneManager.LoadScene(citySceneName);
    }
    
    public void TransitionToWorldScene()
    {
        SceneManager.LoadScene(worldSceneName);
    }
    
    void SaveCurrentCityData()
    {
        // Save any necessary data about the current city
        if(currentCity != null)
        {
            PlayerPrefs.SetString("CurrentCityName", currentCity.name);
            PlayerPrefs.SetFloat("CurrentCityPosX", currentCity.position.x);
            PlayerPrefs.SetFloat("CurrentCityPosY", currentCity.position.y);
            PlayerPrefs.SetFloat("CurrentCityPosZ", currentCity.position.z);
            PlayerPrefs.Save();
        }
    }
    
    public City GetCurrentCity()
    {
        if(currentCity != null)
        {
            return currentCity;
        }
        
        // Try to load from PlayerPrefs if we don't have it
        if(PlayerPrefs.HasKey("CurrentCityName"))
        {
            City savedCity = new City
            {
                name = PlayerPrefs.GetString("CurrentCityName"),
                position = new Vector3(
                    PlayerPrefs.GetFloat("CurrentCityPosX"),
                    PlayerPrefs.GetFloat("CurrentCityPosY"),
                    PlayerPrefs.GetFloat("CurrentCityPosZ")
                )
            };
            
            return savedCity;
        }
        
        return null;
    }
    
    public void ReturnToWorldFromCity()
    {
        // Clean up city-specific data if needed
        currentCity = null;
        
        // Load world scene
        SceneManager.LoadScene(worldSceneName);
    }
}