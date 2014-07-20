#pragma strict

public class TrailManager extends MonoBehaviour {

	var trailPool : GameObject;
	var trailCol : Sprite;

	var range : float;
	
	function BeginTrail(){
	
		InvokeRepeating("Trail",0,0.4);
	
	}
	
	function Trail(){
			
				var trail : TrailPrefab;
				var trailParent : Transform;
				var renderer : SpriteRenderer;
				var currentPos : Vector3;
				var spread : int = SetSpread();
				
				for(var i = 0; i < spread; ++i){
					trail = trailPool.GetComponent(TrailPool).GetTrail();
					renderer = trail.gameObject.GetComponent(SpriteRenderer);
					currentPos = new Vector3(transform.position.x, transform.position.y, 0);
					trailParent = trail.gameObject.transform.parent;
					trail.gameObject.transform.parent = transform;
					renderer.sprite = trailCol;
					currentPos.x += Random.Range(-range,range);
					currentPos.y += Random.Range(-range,0);
					trail.FadeTrail(currentPos, trailParent);
				}
		}

	function SetSpread(){
	
			var ship : GameObject = transform.parent.gameObject;
			var script = ship.GetComponent(JunkerShipController);
			var v : Vector2 = script.GetVelocity();
			
			var x : float = Mathf.Abs(v.x);
			var y : float = Mathf.Abs(v.y);
			var n : float = Mathf.Max(x,y);
			var num : int = Mathf.CeilToInt(n);
			return num+1;
			
	}	
	
}

