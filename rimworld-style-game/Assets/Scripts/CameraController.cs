using UnityEngine;

public class CameraController : MonoBehaviour
{
    public float moveSpeed = 10f;
    public float zoomSpeed = 20f;
    public float rotationSpeed = 90f;
    public float minZoom = 5f;
    public float maxZoom = 100f;
    public float minY = 5f;
    public float maxY = 200f;
    
    private Transform playerTransform;
    private Vector3 dragStartPosition;
    private Vector3 dragCurrentPosition;
    private bool isDragging = false;
    private bool isRotating = false;
    private Vector3 lastMousePosition;
    
    void Start()
    {
        playerTransform = transform;
    }
    
    void Update()
    {
        HandleMovement();
        HandleZoom();
        HandleRotation();
        HandlePanning();
        KeepCameraAboveTerrain();
    }
    
    void HandleMovement()
    {
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");
        
        Vector3 forward = playerTransform.forward;
        Vector3 right = playerTransform.right;
        
        // Zero out y-components to keep movement flat relative to world
        forward.y = 0f;
        right.y = 0f;
        forward.Normalize();
        right.Normalize();
        
        Vector3 movementDirection = (forward * verticalInput + right * horizontalInput).normalized;
        playerTransform.Translate(movementDirection * moveSpeed * Time.deltaTime, Space.World);
    }
    
    void HandleZoom()
    {
        float scrollInput = Input.GetAxis("Mouse ScrollWheel");
        
        if (scrollInput != 0)
        {
            // Zoom in/out
            float zoomAmount = scrollInput * zoomSpeed * Time.deltaTime * 100f;
            playerTransform.Translate(Vector3.down * zoomAmount, Space.Self);
        }
        
        // Clamp the camera's local Y position to prevent going through terrain or too high
        Vector3 pos = playerTransform.localPosition;
        pos.y = Mathf.Clamp(pos.y, minZoom, maxZoom);
        playerTransform.localPosition = pos;
    }
    
    void HandleRotation()
    {
        // Rotate with middle mouse button + drag
        if (Input.GetMouseButtonDown(2))
        {
            isRotating = true;
            lastMousePosition = Input.mousePosition;
        }
        
        if (Input.GetMouseButtonUp(2))
        {
            isRotating = false;
        }
        
        if (isRotating)
        {
            Vector3 mouseDelta = Input.mousePosition - lastMousePosition;
            float rotationAmount = mouseDelta.x * rotationSpeed * Time.deltaTime;
            playerTransform.Rotate(Vector3.up, -rotationAmount, Space.World);
            lastMousePosition = Input.mousePosition;
        }
    }
    
    void HandlePanning()
    {
        // Pan with right mouse button + drag
        if (Input.GetMouseButtonDown(1))
        {
            RaycastHit hit;
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            
            if (Physics.Raycast(ray, out hit))
            {
                dragStartPosition = hit.point;
                isDragging = true;
            }
        }
        
        if (Input.GetMouseButtonUp(1))
        {
            isDragging = false;
        }
        
        if (isDragging)
        {
            RaycastHit hit;
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            
            if (Physics.Raycast(ray, out hit))
            {
                dragCurrentPosition = hit.point;
                Vector3 delta = dragStartPosition - dragCurrentPosition;
                transform.Translate(delta, Space.World);
            }
        }
    }
    
    void KeepCameraAboveTerrain()
    {
        // Make sure the camera stays above the terrain height
        RaycastHit hit;
        Ray ray = new Ray(new Vector3(transform.position.x, 1000, transform.position.z), Vector3.down);
        
        if (Physics.Raycast(ray, out hit))
        {
            if (hit.distance < 5) // If we're too close to the ground
            {
                Vector3 pos = transform.position;
                pos.y = hit.point.y + 5f; // Keep minimum 5 units above terrain
                transform.position = pos;
            }
        }
    }
}