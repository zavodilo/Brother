using UnityEngine;

public class CityIconUpdater : MonoBehaviour
{
    private CityManager cityManager;
    
    void Start()
    {
        cityManager = FindObjectOfType<CityManager>();
    }
    
    void LateUpdate()
    {
        if(cityManager != null)
        {
            cityManager.UpdateAllIcons();
        }
    }
}