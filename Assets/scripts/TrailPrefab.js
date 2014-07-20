#pragma strict

public class TrailPrefab extends MonoBehaviour {
	
	function FadeTrail(spawnPos : Vector3, originalParent : Transform){
		
		transform.position = spawnPos;
		yield WaitForSeconds(0.1); // delay to allow sprite to be seen clearly
		
		var i : int = 0;
		while(i < 4) {
			++i;
			transform.position = spawnPos;
			//transform.position = transform.parent.position;
			transform.localScale.x -= 0.25;
			transform.localScale.y -= 0.25;
			gameObject.GetComponent(SpriteRenderer).color.a -= 0.25;
			yield WaitForSeconds(0.1);
		}
			
		transform.position = originalParent.position;
		transform.parent = originalParent;	
		transform.localScale.x = 1;
		transform.localScale.y = 1;
		gameObject.GetComponent(SpriteRenderer).color.a = 1;
	}

}
