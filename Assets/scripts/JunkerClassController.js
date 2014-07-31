#pragma strict
	
public class JunkerClassController extends MonoBehaviour {
	
	var bCr : Sprite;
	var bCl : Sprite;
	var bBl : Sprite;
	var bBr : Sprite;
	var mCr : Sprite;
	var mCl : Sprite;
	var mDv : Sprite;
	var mBl : Sprite;
	var mBr : Sprite;
	var tCr : Sprite;
	var tDv : Sprite;
	var tBl : Sprite;
	var tBr : Sprite;
		
	var speed : float = 1f;
	var rollSpeed : float = 1f;
	var pitchSpeed : float = 1f;
	var delay : float = 1f;
	
	var window : GameObject;
	var depth : Depth;
	var state : State;
	
	private var colorTop : Color = new Color(1,1,1,1);
	private var colorMiddle : Color = new Color(0.8,0.8,0.8,1);
	private var colorBottom : Color = new Color(0.6,0.6,0.6,1);
	
	private var topHashtable : Hashtable = new Hashtable();
	private var middleHashtable : Hashtable = new Hashtable();
	private var bottomHashtable : Hashtable = new Hashtable();
	private var spriteHashtable : Hashtable = new Hashtable();
	private var colorHashtable : Hashtable = new Hashtable();
	
	private var screenBounds : Vector3;
	private var screenOffset : Vector3;
	private var pitching : boolean;

	function Start () {
	
		screenBounds = Vector3(Screen.width,Screen.height,0);
		screenOffset.x = (screenBounds.x*6)/100; // 6% of Screen width
		screenOffset.y = (screenBounds.y*12)/100; // 6% of Screen height
		
		// populate sprite hashtables
		
		topHashtable[State.Cruising] = tCr;
		topHashtable[State.Diving] = tDv;
		topHashtable[State.BankingL] = tBl;
		topHashtable[State.BankingR] = tBr;
		middleHashtable[State.Cruising] = mCr;
		middleHashtable[State.Climbing] = mCl;
		middleHashtable[State.Diving] = mDv;
		middleHashtable[State.BankingL] = mBl;
		middleHashtable[State.BankingR] = mBr;
		bottomHashtable[State.Cruising] = bCr;
		bottomHashtable[State.Climbing] = bCl;
		bottomHashtable[State.BankingL] = bBl;
		bottomHashtable[State.BankingR] = bBr;
		
		spriteHashtable[Depth.Top] = topHashtable;
		spriteHashtable[Depth.Middle] = middleHashtable;
		spriteHashtable[Depth.Bottom] = bottomHashtable;
		
		colorHashtable[Depth.Top] = colorTop;
		colorHashtable[Depth.Middle] = colorMiddle;
		colorHashtable[Depth.Bottom] = colorBottom;
		
		depth = Depth.Middle;
		state = state.Cruising;
	
	}
	
	function GetState(){
		return state;
	}
	
	function GetDepth(){
		return depth;
	}
	
	function SpriteRend(){
		var sprTable : Hashtable = spriteHashtable[depth];
		var currentSpr : Sprite = sprTable[state];
		var currentCol : Color = colorHashtable[depth];
		var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);
		
		renderer.sprite = currentSpr;
		renderer.color = currentCol;
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
		
		window.GetComponent(GUIText).text = "thrust = " + thrust + "\n" + "bank = " + bank + "\n" + "pitch = " + pitch + "\n" + "STATE = " + state + "\n" + "DEPTH = " + depth;
		
		// Junker Movement //
		
		if (thrust == 0){
			rigidbody2D.velocity.y = rigidbody2D.velocity.y * 0.95f;
		}
		else if (thrust >= 0.75f || thrust <= -0.75f){
			rigidbody2D.AddForce(Vector2.up * (speed * thrust));
		}
		
		if (bank >= 0.75f || bank <= -0.75f){
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
		
		// Check State and render appropriate sprite//
		
		if(!pitching){
			
			if (pitch == 1 && depth != Depth.Bottom){
				state = State.Diving;
				rigidbody2D.AddForce(Vector2.up * (speed * (pitch * pitchSpeed)));
				SpriteRend();
				ShiftPitch(state);
			}
			else if (pitch == -1 && depth != Depth.Top){
				state = State.Climbing;
				rigidbody2D.AddForce(Vector2.up * (speed * (pitch * pitchSpeed)));
				SpriteRend();
				ShiftPitch(state);
			}
			else if (bank >= 0.75f){
				state = State.BankingR;
				SpriteRend();
				}
			else if (bank <= -0.75f){
				state = State.BankingL;
				SpriteRend();
				}
			else{ 
				state = State.Cruising;
				SpriteRend();
			}
		}
	}			

	

}