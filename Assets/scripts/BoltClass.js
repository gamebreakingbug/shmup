#pragma strict

public class BoltClass extends MonoBehaviour {

	var speed : float;
	var damage : float;
	var sprite0 : Sprite;
	var sprite1 : Sprite;
	var sprite2 : Sprite;
	var sprite3 : Sprite;
	private var launched; 
	private var velX : float;
	private var velY : float;
	private var tPool : GameObject;

	function Start(){

	}

	function Launch (direction : float, depth : Depth) {

		var directionHashtable : Hashtable = new Hashtable();
		var spriteArray = new Sprite[4];
		
		directionHashtable[0f] = [0,1,0]; // x = horizontal translation, y = vertical translation, z = sprite type 
		directionHashtable[45f] = [-1,1,3];
		directionHashtable[90f] = [-1,0,1];
		directionHashtable[135f] = [-1,-1,2];
		directionHashtable[180f] = [0,-1,0];
		directionHashtable[225f] = [1,-1,3];
		directionHashtable[270f] = [1,0,1];
		directionHashtable[315f] = [1,1,2];
		directionHashtable[360f] = [0,1, 0];
		spriteArray[0] = sprite0;
		spriteArray[1] = sprite1;
		spriteArray[2] = sprite2;
		spriteArray[3] = sprite3;
		
		var directionTranslation : Array = directionHashtable[direction];
		velX = directionTranslation[0];
		velY = directionTranslation[1];
		
		// resize
		
		switch(depth){
		
			case Depth.Bottom:
				transform.localScale = Vector3(0.4,0.4,1);
				break;
			case Depth.Middle:
				transform.localScale = Vector3(0.7,0.7,1);
				break;
			case Depth.Top:
				transform.localScale = Vector3(1,1,1);
				break;
		}
		
		// render appropriate spite
		
		var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);
		var spriteRef = directionTranslation[2];
		var boltSprite : Sprite = spriteArray[spriteRef];
		yield WaitForSeconds(0.02);
		launched = true;
		renderer.sprite = boltSprite;
	
		
	}

	function Update(){
		
		var screenBounds : Vector3 = new Vector3(Screen.width,Screen.height,0);
		var boltPos : Vector3 = Camera.main.WorldToScreenPoint(transform.position);

		if(launched){	
				var movement : Vector3 = new Vector3(velX * speed, velY * speed, 0f);
			    movement *= Time.deltaTime;
				transform.Translate(movement);
		}
		
		if(boltPos.x > screenBounds.x || boltPos.x < 0 || boltPos.y > screenBounds.y || boltPos.y < 0)
				{
					Destroy(gameObject);
				}
	}
}