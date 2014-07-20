#pragma strict

public class TurretManager extends MonoBehaviour {

	var leftHashtable : Hashtable = new Hashtable();
	var topHashtable : Hashtable = new Hashtable();
	var rightHashtable : Hashtable = new Hashtable();
	var turretHashtable : Hashtable = new Hashtable();
	var turretTables = new Hashtable[3];

	var lNN : Sprite;
	var lNW : Sprite;
	var lWW : Sprite;
	var lSW : Sprite;
	var lSS : Sprite;
	var lSE : Sprite;
	var lEE : Sprite;
	var lNE : Sprite;

	var tNN : Sprite;
	var tNW : Sprite;
	var tWW : Sprite;
	var tSW : Sprite;
	var tSS : Sprite;
	var tSE : Sprite;
	var tEE : Sprite;
	var tNE : Sprite;

	var rNN : Sprite;
	var rNW : Sprite;
	var rWW : Sprite;
	var rSW : Sprite;
	var rSS : Sprite;
	var rSE : Sprite;
	var rEE : Sprite;
	var rNE : Sprite;

	var boltPrefab : GameObject;
	var salvoPrefab : GameObject;
	var fireRate : float;
	var nextFire : float;
	private var salvo :boolean;

	function Start () {
	
		leftHashtable[0f] = lNN;
		leftHashtable[45f] = lNW;
		leftHashtable[90f] = lWW;
		leftHashtable[135f] = lSW;
		leftHashtable[180f] = lSS;
		leftHashtable[225f] = lSE;
		leftHashtable[270f] = lEE;
		leftHashtable[315f] = lNE;
		leftHashtable[360f] = lNN;

		topHashtable[0f] = tNN;
		topHashtable[45f] = tNW;
		topHashtable[90f] = tWW;
		topHashtable[135f] = tSW;
		topHashtable[180f] = tSS;
		topHashtable[225f] = tSE;
		topHashtable[270f] = tEE;
		topHashtable[315f] = tNE;
		topHashtable[360f] = tNN;

		rightHashtable[0f] = rNN;
		rightHashtable[45f] = rNW;
		rightHashtable[90f] = rWW;
		rightHashtable[135f] = rSW;
		rightHashtable[180f] = rSS;
		rightHashtable[225f] = rSE;
		rightHashtable[270f] = rEE;
		rightHashtable[315f] = rNE;
		rightHashtable[360f] = rNN;
		
		turretHashtable[0f] = [0,1];
		turretHashtable[45f] = [-1,1];
		turretHashtable[90f] = [-1,0];
		turretHashtable[135f] = [-1,-1];
		turretHashtable[180f] = [0,-1];
		turretHashtable[225f] = [1,-1];
		turretHashtable[270f] = [1,0];
		turretHashtable[315f] = [1,1];
		turretHashtable[360f] = [0,1];

		turretTables[0] = leftHashtable;
		turretTables[1] = topHashtable;
		turretTables[2] = rightHashtable;

	}

	function Update () {

	// **** ROTATE TURRET IN 45° INCREMENTS **** //
		
		// Get input from second thumbstick (horiz + vertical axes must be inverted in Input Inspector)
		
			var xAxis : float = Input.GetAxis("Horizontal2");
			var yAxis : float = Input.GetAxis("Vertical2");
		
			//var xAxis : float = Input.GetAxis("TurretHorizontal");
			//var yAxis : float = Input.GetAxis("TurretVertical");
		
		
		// Get Radians from Horizontal and Vertical inputs and then convert to Degrees 
			
			var degrees : float = Mathf.Atan2(xAxis,yAxis) * Mathf.Rad2Deg;
			
		// Convert negative degrees to eulerAngles(0 to 360°)
		
			if(degrees<0f){
				degrees = 360f + degrees;
			}
		
		// Snap to 45°
		
			degrees = Mathf.Ceil(degrees/45f) * 45f;
	
		// Check ship alignment
		
			var ship : GameObject = transform.parent.gameObject;
			var script = ship.GetComponent(JunkerShipController);
			var align : int = script.GetAlign();
			var lookupTable : Hashtable = turretTables[align];
											
		// Get Sprite from Hashtable
		
			var turretSprite : Sprite = lookupTable[degrees];
			var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);
	
		
			renderer.sprite = turretSprite;
			
	// **** FIRE WEAPON **** //	
		
			if(Input.GetButton("FireTurret")){
				FireTurret(degrees);
			}
			if(Input.GetButton("FireTurretB")){
				FireSalvo(degrees, 3);
			}

	}
	
	function FireTurret(angle: float){
	
		if(Time.time > nextFire){
			nextFire = Time.time + fireRate;
			var spawnX = transform.position.x;
			var spawnY = transform.position.y;
			var turretTranslation : Array = turretHashtable[angle];
			var modX : float = turretTranslation[0];
			var modY : float = turretTranslation[1];
			spawnX += 0.24 * modX;  //  instantiates still slightly over turret to allow for muzzle flash
			spawnY += 0.24 * modY;  //
			var spawnPos : Vector3 = new Vector3(spawnX, spawnY, 0);
			var newBolt : GameObject = Instantiate(boltPrefab, spawnPos, transform.rotation);
			newBolt.GetComponent(BoltClass).Launch(angle);
		}
	
	}
	
	function FireSalvo(angle: float, rate: int){
	
		if(Time.time > nextFire && !salvo){
			salvo = true;
			var vert : boolean;
			var salvoArray = new GameObject[rate];
			var spreadArray = [-0.4, 0, 0.4];
			var turretTranslation : Array = turretHashtable[angle];
			var spawnX : float;
			var spawnY : float;
			var modX : float;
			var modY : float;
			
			for(var i = 0; i < rate; i++){		
				spawnX = transform.position.x;
				spawnY = transform.position.y;
				modX = turretTranslation[0];
				modY = turretTranslation[1];
							
				spawnX += 0.16 * modX;  //  instantiates still slightly over turret to allow for muzzle flash
				spawnY += 0.16 * modY;  //
				var spawnPos : Vector3 = new Vector3(spawnX, spawnY, 0);
				salvoArray[i] = Instantiate(salvoPrefab, spawnPos, transform.rotation);
				
				if(modX == 0){
					vert = false;
				}
				else{
					vert = true;
				}
				
				salvoArray[i].GetComponent(SalvoClass).Launch(angle, spreadArray[i], vert);
				yield WaitForSeconds(0.1);
			}
			nextFire = Time.time + fireRate;
			salvo = false;
		}
	
	}
	
}