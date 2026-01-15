using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class MainMenuUI : MonoBehaviour
{
    [Header("UI Elements")]
    public Button startButton;
    public Button loadButton;
    public Button settingsButton;
    public Button quitButton;
    
    [Header("Panels")]
    public GameObject mainMenuPanel;
    public GameObject settingsPanel;
    
    void Start()
    {
        SetupButtons();
    }

    void SetupButtons()
    {
        if(startButton != null)
            startButton.onClick.AddListener(StartGame);
        
        if(loadButton != null)
            loadButton.onClick.AddListener(LoadGame);
        
        if(settingsButton != null)
            settingsButton.onClick.AddListener(ShowSettings);
        
        if(quitButton != null)
            quitButton.onClick.AddListener(QuitGame);
    }
    
    public void StartGame()
    {
        // Load the world scene
        SceneManager.LoadScene("WorldScene");
    }
    
    public void LoadGame()
    {
        // In a real implementation, this would show a save/load menu
        Debug.Log("Load Game clicked");
    }
    
    public void ShowSettings()
    {
        if(mainMenuPanel != null) mainMenuPanel.SetActive(false);
        if(settingsPanel != null) settingsPanel.SetActive(true);
    }
    
    public void HideSettings()
    {
        if(mainMenuPanel != null) mainMenuPanel.SetActive(true);
        if(settingsPanel != null) settingsPanel.SetActive(false);
    }
    
    public void QuitGame()
    {
        #if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
        #else
        Application.Quit();
        #endif
    }
}