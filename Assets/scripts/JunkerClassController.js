#pragma strict

public class JunkerClassController extends MonoBehaviour {

	var speed : float = 1f;
	var window : GameObject;
		
	private var screenBounds : Vector3;
	private var screenOffset : Vector3;
	private var rollAlign : int = 1;  // 0 = roll left, 1 = top, 2 = roll right
	private var pitchAlign : int = 1; 
	private	var pitch : float;
	private var pitching : boolean;
	private var rolling : boolean;
	private var depth : int = 1; // 0 = bottom, 1 = middle, 2 = top
	var flagPitch : boolean;

	function Start () {
	
		screenBounds = Vector3(Screen.width,Screen.height,0);
		screenOffset.x = (screenBounds.x*6)/100; // 6% of Screen width
		screenOffset.y = (screenBounds.y*12)/100; // 6% of Screen height
	
	}

	function SetAlign(rollVal : int, pitchVal : int){
		rollAlign = rollVal;
		pitchAlign = pitchVal;
	}
	
	function SetDepth(val : float){

		depth -= val;
		if(depth > 2){
			depth = 2;
		}
		if(depth < 0){
			depth = 0;
		}	
		yield WaitForSeconds(1);
		flagPitch = false;
		pitching = false;
	}
	
	function Update () {

		var thrust : float = Input.GetAxis("Vertical");
		
		if(!pitching){
			var roll : float = Input.GetAxis("Horizontal");
			if(roll !=0){
				rolling = true;
			}
		}
		if(!rolling){ 
		 	pitch = Input.GetAxis("Vertical2");
		 	if(pitch !=0){
		 		pitching = true;
		 	}
		}
		
		var shipPos : Vector3 = Camera.main.WorldToScreenPoint(transform.position);
		
		// text window
		
		window.GetComponent(GUIText).text = "pitch " + pitch;
		
		// Junker Movement
		
		if (thrust == 0){
			rigidbody2D.velocity.y = rigidbody2D.velocity.y * 0.95f;
		}
		else if (thrust >= 0.75f || thrust <= -0.75f){
			rigidbody2D.AddForce(Vector2.up * (speed * thrust));
		}
		
		if (roll == 0){
			rolling = false;
			rigidbody2D.velocity.x = rigidbody2D.velocity.x * 0.95f;
		}
		else if (!flagPitch && (roll >= 0.75f || roll <= -0.75f)){
			rigidbody2D.AddForce(Vector2.right * (speed * roll));
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
		
		
		if (!flagPitch){
			if(Mathf.Abs(pitch) == 1){
				flagPitch = true;
				SetDepth(pitch);
			}
		}
		
		if (flagPitch){
			if(pitch > 0 && depth > 0){
				SetAlign(1,0); // dive}
				Debug.Log("DIVE");
			}
			else if(pitch < 0 && depth < 2){
				SetAlign(1,2); // climb}
				Debug.Log("CLIMB");
			}
		
		}

		else if (roll >= 0.75f && !pitching){
				SetAlign(2,1);
			}
		else if (roll <= -0.75f && !pitching){
				SetAlign(0,1);
			}
		else { // {(pitch == 0 && roll ==0){
				pitch = 0;
				SetAlign(1,1);
		}
		

		
		gameObject.GetComponentInChildren(JunkerSprite).SetSprite(rollAlign, pitchAlign, depth);
		
	}			

	

}