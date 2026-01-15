using UnityEngine;
using UnityEngine.SceneManagement;

public class SplashScreenController : MonoBehaviour
{
    [Header("Splash Screen Settings")]
    public float splashDuration = 3f; // How long the splash screen shows
    public string nextScene = "MainMenu"; // Scene to load after splash
    
    private float timer = 0f;
    private bool isFinished = false;

    void Start()
    {
        timer = 0f;
        isFinished = false;
        
        // Don't destroy this object during scene loads so we can transition properly
        DontDestroyOnLoad(gameObject);
    }

    void Update()
    {
        if (!isFinished)
        {
            timer += Time.deltaTime;
            
            // Allow skip by pressing any key or clicking
            if (timer >= splashDuration || Input.anyKeyDown)
            {
                FinishSplash();
            }
        }
    }

    void FinishSplash()
    {
        isFinished = true;
        
        // Load the next scene
        SceneManager.LoadScene(nextScene);
        
        // Destroy this object after scene loads
        Destroy(gameObject);
    }
}