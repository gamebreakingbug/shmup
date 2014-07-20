#pragma strict

	enum State{Cruising, Climbing, Diving, BankingL, BankingR, RollingL, RollingR};
	enum Depth{Bottom, Middle, Top};
	
public class JunkerClassController extends MonoBehaviour {
	
	var speed : float = 1f;
	var rollSpeed : float = 1f;
	var delay : float = 1f;
	
	var window : GameObject;
	var depth : Depth;
	var state : State;

	private var screenBounds : Vector3;
	private var screenOffset : Vector3;
	private var pitching : boolean;

	function Start () {
	
		screenBounds = Vector3(Screen.width,Screen.height,0);
		screenOffset.x = (screenBounds.x*6)/100; // 6% of Screen width
		screenOffset.y = (screenBounds.y*12)/100; // 6% of Screen height
		
		depth = Depth.Middle;
		state = state.Cruising;
	
	}
	
	function ShiftPitch (direction : State){
	
		pitching = true;
	
		switch (direction){
			
			case State.Diving:
				depth -= 1;
			break;
			
			case State.Climbing:
				depth +=1;
			break;
			
			default:
			break;
		}
		
		yield WaitForSeconds(delay);
		pitching = false;
	}

	function Update () {

		var thrust : float = Input.GetAxis("Vertical");
		var bank : float = Input.GetAxis("Horizontal");
		var pitch : float = Input.GetAxis("Vertical2");
		var roll : float = Input.GetAxis("Horizontal2");

		var shipPos : Vector3 = Camera.main.WorldToScreenPoint(transform.position);
		
		// text window //
		
		window.GetComponent(GUIText).text = "thrust = " + thrust + "\n" + "bank = " + bank + "\n" + "pitch = " + pitch + "\n" + "STATE = " + state + "\n" + "DEPTH = " + depth ;
		
		// Junker Movement //
		
		if (thrust == 0){
			rigidbody2D.velocity.y = rigidbody2D.velocity.y * 0.95f;
		}
		else if (thrust >= 0.75f || thrust <= -0.75f){
			rigidbody2D.AddForce(Vector2.up * (speed * thrust));
		}
		
		if (roll == 1f || roll == -1f){
			rigidbody2D.AddForce(Vector2.right * (speed * (roll * rollSpeed)));
		}
		else if (bank >= 0.75f || bank <= -0.75f){
			rigidbody2D.AddForce(Vector2.right * (speed * bank));
		}
		else if (bank == 0){
			rigidbody2D.velocity.x = rigidbody2D.velocity.x * 0.95f;
		}
			
		// screen edge buffering //
	
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
		
		// Check State //
		
		if (pitch == 1 && depth != Depth.Bottom && !pitching){
			state = State.Diving;
			ShiftPitch(state);
		}
		else if (pitch == -1 && depth != Depth.Top && !pitching){
			state = State.Climbing;
			ShiftPitch(state);
		}
		else if (roll == 1){
			state = State.RollingR;
		}
		else if (roll == -1){
			state = State.RollingL;
		}
		else if (bank >= 0.75f){
			state = State.BankingR;
			}
		else if (bank <= -0.75f){
			state = State.BankingL;
			}
		else { 
			state = State.Cruising;
		}
		
		gameObject.GetComponentInChildren(JunkerSprite).SetSprite(state, depth);
		
	}			

	

}