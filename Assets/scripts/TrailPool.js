#pragma strict

public class TrailPool extends MonoBehaviour {

	var trailPrefab : GameObject;
	var trailCount : int;
	
	
	private var tt:List.<TrailPrefab>;
	private var current = 0;
	
	function Start(){
	
		tt = new List.<TrailPrefab>();
		
		for ( var c: int = 0; c < trailCount; ++c){
			var newT : GameObject = Instantiate(trailPrefab);
			newT.name = "tt" + c;
			newT.transform.parent = transform;
			newT.transform.position = transform.position;
			tt.Add(newT.GetComponent(TrailPrefab));
		}
		
	}
	
	function GetTrail(){
		++current;
		if(current >= trailCount){
			current = 0;
		}
		return tt[current];
	}

}