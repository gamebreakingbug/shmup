#pragma strict

public class DriveClass extends MonoBehaviour {

	var spr00 : Sprite;
	var spr01 : Sprite;
	var spr02 : Sprite;
	var spr03 : Sprite;
	var spr10 : Sprite;
	var spr11 : Sprite;
	var spr12 : Sprite;
	var spr13 : Sprite;
	var spr20 : Sprite;
	var spr21 : Sprite;
	var spr22 : Sprite;
	var spr23 : Sprite;

	private var drives : Sprite[,] = new Sprite[3,4];
	private var d : int = 0;
	
	function Start(){
	
		var iStr : String;
		var jStr : String;
		var nextSprite : Sprite;
	
		for (var i = 0; i < 3; ++i){
			
			for (var j = 0; j < 4; ++j) {
			
				iStr = i.ToString();
				jStr = j.ToString();
				nextSprite = eval('spr' + iStr + jStr);
				drives[i,j] = nextSprite;
				
			}
		
		}
	
		InvokeRepeating("DTimer",0,0.4);
	
	}
	
	function Update(){
		
			var ship : GameObject = transform.parent.gameObject;
			var script = ship.GetComponent(JunkerShipController);
			var a : int = script.GetAlign();
			var driveSprite : Sprite = drives[a,d];
			var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);
			renderer.sprite = driveSprite;
				
	}
	
	function DTimer(){
			if(d >= 3){
				d = 0;
			}
			else {
				++d;
			}	
	}
	
}