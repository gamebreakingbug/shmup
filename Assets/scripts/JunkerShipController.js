#pragma strict

public class JunkerShipController extends MonoBehaviour {

	var speed : float = 1f;
	var accelRate : float = 0f;
	
	var spriteT : Sprite;
	var spriteL : Sprite;
	var spriteR : Sprite;
	
	private var screenBounds : Vector3;
	private var screenOffset : Vector3;
	private var align : int = 1;  // 0 = bank left, 1 = top, 2 = bank right

	var window : GameObject;

	function Start () {
	
		screenBounds = Vector3(Screen.width,Screen.height,0);
		screenOffset.x = (screenBounds.x*6)/100; // 6% of Screen width
		screenOffset.y = (screenBounds.y*12)/100; // 6% of Screen height
		
		gameObject.GetComponentInChildren(TrailManager).BeginTrail();
		
	}

	function Update () {

		var thrust : float = Input.GetAxis("Vertical");
		var bank : float = Input.GetAxis("Horizontal");
		var shipPos : Vector3 = Camera.main.WorldToScreenPoint(transform.position);
		
		var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);
		
		// text window
		
		window.GetComponent(GUIText).text = rigidbody2D.velocity.x + " " + rigidbody2D.velocity.y;
		
		// Junker Movement
		
		if (thrust == 0){
			rigidbody2D.velocity.y = rigidbody2D.velocity.y * 0.95f;
		}
		else if (thrust >= 0.75f || thrust <= -0.75f){
			rigidbody2D.AddForce(Vector2.up * (speed * thrust));
		}
		if (bank == 0){
			rigidbody2D.velocity.x = rigidbody2D.velocity.x * 0.95f;
			SetAlign(1);
			renderer.sprite = spriteT;
		}
		else if (bank >= 0.75f || bank <= -0.75f){
			rigidbody2D.AddForce(Vector2.right * (speed * bank));
			if (bank >= 0.75f){
				SetAlign(2);
				renderer.sprite = spriteR;
			}
			else if (bank <= -0.75f){
				SetAlign(0);
				renderer.sprite = spriteL;
			}
		
		}
		
		// screen edge buffering
	
		if(shipPos.x > screenBounds.x-screenOffset.x)
			{
			transform.position = Camera.main.ScreenToWorldPoint(Vector3(screenBounds.x-screenOffset.x,shipPos.y,1));
			rigidbody2D.velocity.x *= -0.5;
			}
		if(shipPos.x < screenOffset.x)
			{
			transform.position = Camera.main.ScreenToWorldPoint(Vector3(screenOffset.x,shipPos.y,1));
			rigidbody2D.velocity.x *= -0.5;
			}
		if(shipPos.y > screenBounds.y-screenOffset.y)
			{
			transform.position = Camera.main.ScreenToWorldPoint(Vector3(shipPos.x,screenBounds.y-screenOffset.y,1));
			rigidbody2D.velocity.y *= -0.5;
			}
		if(shipPos.y < screenOffset.y)
			{
			transform.position = Camera.main.ScreenToWorldPoint(Vector3(shipPos.x,screenOffset.y,1));
			rigidbody2D.velocity.y *= -0.5;
			}
		
	}			

	function SetAlign(val : int){
		align = val;
	}
	
	function GetAlign(){
		return align;
	}
	
	function GetVelocity(){
		return rigidbody2D.velocity;
	}

}