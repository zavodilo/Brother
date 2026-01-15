using UnityEngine;
using UnityEngine.EventSystems;

public class CityIconHandler : MonoBehaviour, IPointerClickHandler
{
    private City city;
    private CityManager cityManager;
    
    public void Initialize(City city, CityManager cityManager)
    {
        this.city = city;
        this.cityManager = cityManager;
    }
    
    public void OnPointerClick(PointerEventData eventData)
    {
        if(cityManager != null)
        {
            cityManager.OnCitySelected(city);
        }
    }
}