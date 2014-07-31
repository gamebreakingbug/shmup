#pragma strict


var pitching : boolean;
private var scale : Vector3;


function LerpScale(time : float, targetScale : Vector3){
	var originalScale = transform.localScale;
	var originalTime = time;
	 
	while (time > 0.0f)
	{
	time -= Time.deltaTime;
	 
	transform.localScale = Vector3.Lerp(targetScale, originalScale, time / originalTime);
	yield;
	}
}


function SetSprite (state: State, depth: Depth) {

	var anim : Animator = gameObject.GetComponent(Animator);
	var delay : float = transform.GetComponentInParent(JunkerClassController).delay;

	if(state == State.BankingL){
			anim.SetTrigger("BankingL");
		}
	else if(state == State.BankingR){
			anim.SetTrigger("BankingR");
		}
	else if(state == State.Cruising){
			anim.SetTrigger("Cruising");
		}

	if(pitching){
		switch(depth){
		
			case Depth.Bottom:
				scale = new Vector3(0.4,0.4,1);
				break;
			case Depth.Middle:
				scale = new Vector3(0.7,0.7,1);
				break;
			case Depth.Top:
				scale = new Vector3(1,1,1);
				break;
		}
		StartCoroutine(LerpScale(delay, scale));
	}
}