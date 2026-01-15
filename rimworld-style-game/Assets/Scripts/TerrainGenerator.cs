using UnityEngine;

public class TerrainGenerator : MonoBehaviour
{
    public int terrainWidth = 200;
    public int terrainHeight = 200;
    public float scale = 20f;
    public float heightMultiplier = 20f;
    public int octaves = 4;
    public float persistence = 0.5f;
    public float lacunarity = 2f;
    public int seed = 42;
    
    private Terrain terrain;
    private TerrainData terrainData;
    
    void Start()
    {
        GenerateTerrain();
    }
    
    public void GenerateTerrain()
    {
        // Create terrain data
        terrainData = new TerrainData();
        terrainData.heightmapResolution = terrainWidth + 1;
        terrainData.size = new Vector3(terrainWidth, heightMultiplier * 2, terrainHeight);
        terrainData.baseMapResolution = 512;
        terrainData.SetHeights(0, 0, GenerateHeightmap());
        
        // Create terrain object
        GameObject terrainObject = Terrain.CreateTerrainGameObject(terrainData);
        terrainObject.name = "ProceduralTerrain";
        terrainObject.transform.position = new Vector3(-terrainWidth/2f, 0, -terrainHeight/2f);
        
        // Configure terrain settings
        terrain = terrainObject.GetComponent<Terrain>();
        terrain.materialType = Terrain.MaterialType.Default;
        
        // Add collider for raycasting
        terrain.gameObject.AddComponent<TerrainCollider>();
    }
    
    float[,] GenerateHeightmap()
    {
        float[,] heights = new float[terrainWidth + 1, terrainHeight + 1];
        
        for (int x = 0; x <= terrainWidth; x++)
        {
            for (int y = 0; y <= terrainHeight; y++)
            {
                float amplitude = 1;
                float frequency = 1;
                float noiseHeight = 0;
                
                System.Random rand = new System.Random(seed);
                Vector2 offset = new Vector2(rand.Next(-100000, 100000), rand.Next(-100000, 100000));
                
                for (int o = 0; o < octaves; o++)
                {
                    float sampleX = (x + offset.x) / scale * frequency;
                    float sampleY = (y + offset.y) / scale * frequency;
                    
                    float perlinValue = Mathf.PerlinNoise(sampleX, sampleY);
                    noiseHeight += perlinValue * amplitude;
                    
                    amplitude *= persistence;
                    frequency *= lacunarity;
                }
                
                // Normalize the height values
                noiseHeight = Mathf.InverseLerp(-1f, 1f, noiseHeight);
                heights[x, y] = noiseHeight;
            }
        }
        
        return heights;
    }
}