
	var speed : float;
	var damage : float;
	var directionHashtable : Hashtable = new Hashtable();
	var sprite0 : Sprite;
	private var launched : boolean;
	private var vertAxis : boolean;
	private var salvoSpread : float;
	private var velX : float;
	private var velY : float;

function Launch (direction : float,spread : float, vert : boolean) {

	directionHashtable[0f] = [0,1]; // x = horizontal translation, y = vertical translation, z = sprite type 
	directionHashtable[45f] = [-1,1];
	directionHashtable[90f] = [-1,0];
	directionHashtable[135f] = [-1,-1];
	directionHashtable[180f] = [0,-1];
	directionHashtable[225f] = [1,-1];
	directionHashtable[270f] = [1,0];
	directionHashtable[315f] = [1,1];
	directionHashtable[360f] = [0,1];

	// get direction
	
	var directionTranslation : Array = directionHashtable[direction];
	velX = directionTranslation[0];
	velY = directionTranslation[1];
	// render appropriate spite
	
	var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);
	yield WaitForSeconds(0.02);
	vertAxis = vert;
	salvoSpread = spread;
	launched = true;
	renderer.sprite = sprite0;
	
}

function Update(){
	
	if(vertAxis){
		velY += salvoSpread;
	}
	else{
		velX += salvoSpread;
	}
	if(launched){	
			var movement : Vector3 = new Vector3(velX * speed, velY * speed, 0f);
		    movement *= Time.deltaTime;
			transform.Translate(movement);
	}
}
	
